import { AccessTokenData, TOKEN_TYPE } from "@battleships/contracts";
import { getEm } from "utils/request-context-manager";
import { createSimpleAccessToken } from "utils/helpers/tokens/create-simple-access-token";

import { RefreshToken } from "entities/token/refresh-token.entity";
import { User } from "entities/user.entity";

export const createLoginTokens = async (user: User) => {
	const em = getEm();
	await em.populate(user, ["roles"]);

	/**
	 * @todo: update for admin role
	 */
	const role = user.roles[0];
	const accessTokenData: AccessTokenData = {
		userId: user.id,
		role: {
			id: role.id,
			type: role.type,
		},
		type: TOKEN_TYPE.ACCESS,
	};

	const jwtAccessToken = await createSimpleAccessToken<AccessTokenData>(accessTokenData);
	const refreshToken = em.create(RefreshToken, {
		expiresAt: new Date(Date.now() + Number(process.env.REFRESH_TOKEN_LIFETIME)),
		user: user.id,
	});

	await em.persistAndFlush([refreshToken, user]);

	return {
		user,
		jwtAccessToken,
		refreshToken,
	};
};
