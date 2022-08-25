import express, { Express, NextFunction } from "express";
import "express-async-errors";

import { MikroORM, RequestContext } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import ormConfig from "./orm.config";

import {
	getMetadataArgsStorage,
	RoutingControllersOptions,
	useExpressServer,
} from "routing-controllers";
import { errorMiddleware, getAuthenticator, importClasses } from "@panenco/papi";
import { validationMetadatasToSchemas } from "class-validator-jsonschema";
import { routingControllersToSpec } from "routing-controllers-openapi";
import * as swaggerUi from "swagger-ui-express";
import dotenv from "dotenv";
import { paths } from "paths";
import { createServer, Server } from "http";
import SocketClient from "./socket";

export class App {
	public orm: MikroORM<PostgreSqlDriver>;
	public readonly host: Express;
	public readonly port: number;
	public readonly socketPort: number;
	public readonly socketServer: Server;
	public socketClient: SocketClient;

	constructor() {
		dotenv.config();
		this.port = Number(process.env.PORT) || 8000;
		this.socketPort = Number(process.env.SOCKET_PORT) || 8001;
		this.host = express();
		this.socketServer = createServer(express());

		this.initializeMiddlewares();
		const controllers = importClasses([`${paths.root}/**/*.controller.js`]);
		this.initializeControllers(controllers);
		this.initializeSockets();
		this.initializeDocs();
		this.initializeErrorHandling();
	}

	private initializeSockets() {
		this.socketClient = new SocketClient(this.socketServer);
	}

	public listen() {
		this.socketServer.listen(this.socketPort, () => {
			console.info(`Websockets are available at port:${this.socketPort}`);
		});
		this.host.listen(this.port, () => {
			console.info(`=================================`);
			console.info(`======= ENV: ${process.env.NODE_ENV} ========`);
			console.info(`🚀 http://localhost:${process.env.PORT}/docs`);
			console.info(`=================================`);
		});
	}

	public async createDBConnection() {
		try {
			this.orm = await MikroORM.init(ormConfig);
			console.log("Database connection established");
		} catch (error) {
			console.error("An error has occurred while connecting to the DB", error);
		}
	}

	private initializeMiddlewares() {
		this.host.use(express.json());
		this.host.use(express.urlencoded({ extended: true }));
		this.host.use((req, __, next: NextFunction) => {
			(req as any).em = this.orm.em.fork();
			RequestContext.create(this.orm.em, next);
		});
	}

	private initializeControllers(controllers: Function[]) {
		useExpressServer(this.host, {
			cors: {
				origin: "*",
				exposedHeaders: ["x-auth", "x-refresh-token"],
			},
			controllers,
			defaultErrorHandler: false,
			routePrefix: "/api",
			// Tell routing-controllers to use the papi authentication checker
			authorizationChecker: getAuthenticator(process.env.JWT_SECRET as string),
		});
	}

	private initializeDocs() {
		const { defaultMetadataStorage } = require("class-transformer/cjs/storage");

		const schemas = validationMetadatasToSchemas({
			classTransformerMetadataStorage: defaultMetadataStorage,
			refPointerPrefix: "#/components/schemas/",
		}); // convert the metadata to an OpenAPI json schema

		const routingControllersOptions: RoutingControllersOptions = {
			routePrefix: "/api", // Set the route prefix so swagger knows all endpoints are prefixed with /api
		}; // configure some general options

		const storage = getMetadataArgsStorage();
		const spec = routingControllersToSpec(storage, routingControllersOptions, {
			// Convert the routing controller metadata + the class-validator metadata into an OpenAPI spec
			components: {
				schemas,
				securitySchemes: {
					// Add a security scheme so we will be able to enter a token on the endpoints
					JWT: {
						in: "header",
						name: "x-auth", // Define the header key to use
						type: "apiKey",
						bearerFormat: "JWT",
						description:
							'JWT Authorization header using the JWT scheme. Example: "x-auth: {token}"',
					},
				},
			},
			security: [{ JWT: [] }],
		});

		this.host.use("/docs", swaggerUi.serve, swaggerUi.setup(spec)); // Host swagger ui on /docs
	}

	private initializeErrorHandling() {
		this.host.use(errorMiddleware);
	}
}
