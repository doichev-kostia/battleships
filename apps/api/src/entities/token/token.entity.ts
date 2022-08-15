import { Entity, Enum, Property } from "@mikro-orm/core";
import { TOKEN_TYPE } from "@battleships/contracts";
import * as crypto from "crypto";

import { Base } from "utils/entities/base.entity";

@Entity({ discriminatorColumn: "type", abstract: true })
export abstract class Token extends Base<Token> {
	@Property({ unique: true })
	public value: string;

	@Property({ nullable: true, length: 3 })
	public expiresAt?: Date;

	@Enum(() => TOKEN_TYPE)
	public type: TOKEN_TYPE;

	constructor(tokenBody: unknown) {
		super();
		const length = (typeof tokenBody === "string" && tokenBody?.length) || 120;
		this.value = crypto.randomBytes(length).toString("hex").substring(length);
	}
}
