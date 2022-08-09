import { Token } from "./token.entity";
import { Entity, ManyToOne } from "@mikro-orm/core";
import { User } from "entities/user.entity";
import { TOKEN_TYPE } from "@battleships/contracts";

@Entity({
	discriminatorValue: TOKEN_TYPE.REFRESH,
})
export class RefreshToken extends Token {
	@ManyToOne(() => User)
	public user: User;
}
