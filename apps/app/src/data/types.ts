import { ROLE_TYPE } from "@battleships/contracts/src";

export interface TokenData {
	role: {
		id: string;
		type: ROLE_TYPE;
	};
	iat: number;
	exp: number;
}
