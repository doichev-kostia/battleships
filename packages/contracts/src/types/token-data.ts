import { ROLE_TYPE, TOKEN_TYPE } from "../enums";

export interface BaseTokenData {
	userId: string;
	type: TOKEN_TYPE;
}

export interface AccessTokenData extends BaseTokenData {
	role: {
		id: string;
		type: ROLE_TYPE;
	};
}
