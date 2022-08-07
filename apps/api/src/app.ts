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
import { errorMiddleware, getAuthenticator } from "@panenco/papi";
import { validationMetadatasToSchemas } from "class-validator-jsonschema";
import { routingControllersToSpec } from "routing-controllers-openapi";
import * as swaggerUi from "swagger-ui-express";
import { AuthController } from "./controllers/auth/auth.controller";
import dotenv from "dotenv";

export class App {
  public orm: MikroORM<PostgreSqlDriver> | undefined;
  public readonly host: Express;
  public readonly port: number;

  constructor() {
    dotenv.config();
    this.port = Number(process.env.PORT) || 8000;
    this.host = express();
    this.host.use(express.json());
    this.host.use((req, res, next) => {
      console.log(`${req.method} ${req.url}`);
      next();
    });
    this.host.use((_, __, next: NextFunction) => {
      if (this.orm) {
        RequestContext.create(this.orm.em, next);
      }
      next();
    });
  }

  public listen() {
    this.initializeControllers([AuthController]);
    this.initializeDocs();
    this.host.use((req, res, next) => {
      res.status(404).json({ error: "Endpoint not found" });
    });
    this.host.use(errorMiddleware);
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
    } catch (error) {
      console.error("An error has occurred while connecting to the DB", error);
    }
  }

  private initializeControllers(controllers: Function[]) {
    useExpressServer(this.host, {
      cors: {
        origin: "*",
        exposedHeaders: ["x-auth"],
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
}
