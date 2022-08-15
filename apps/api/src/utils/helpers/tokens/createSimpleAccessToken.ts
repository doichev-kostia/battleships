import { createAccessToken } from "@panenco/papi";
import { BaseTokenData } from "@battleships/contracts";

export const createSimpleAccessToken = async <T extends BaseTokenData>(accessTokenData: T) => {
	return createAccessToken(
		process.env.JWT_SECRET,
		Number(process.env.ACCESS_TOKEN_LIFETIME),
		accessTokenData,
	);
};
