import { Entity, ManyToOne } from "@mikro-orm/core";
import { TOKEN_TYPE } from "@battleships/contracts";

import { Token } from "./token.entity";
import { User } from "../user.entity";

@Entity({
	discriminatorValue: TOKEN_TYPE.REFRESH,
})
export class RefreshToken extends Token {
	@ManyToOne("User")
	public user: User;
}
