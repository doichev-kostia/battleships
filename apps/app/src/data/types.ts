import { AccessTokenData as TokenPayload } from "@battleships/contracts";

export interface AuthCookie {
	// access token
	auth: string;
	// refresh token
	refresh: string;
}

export interface AccessTokenData extends TokenPayload {
	iat: number;
	exp: number;
}
