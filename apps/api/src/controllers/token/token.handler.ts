import { AccessTokenData, ROLE_TYPE, TOKEN_TYPE } from "@battleships/contracts";
import { Forbidden } from "@panenco/papi";
import { getEm } from "utils";
import { RefreshToken } from "entities/token/refresh-token.entity";
import { Role } from "entities/role.entity";
import { createSimpleAccessToken } from "utils/helpers";

export class TokenHandler {
	static refreshAccessToken = async (refreshToken: string, userId: string, roleType: ROLE_TYPE) => {
		if (!refreshToken) {
			throw new Forbidden("missingRefreshToken", "Refresh token is required");
		}
		const em = getEm();

		const token = await em.findOneOrFail(
			RefreshToken,
			{ value: refreshToken },
			{ populate: ["user"] },
		);

		if (token.expiresAt < new Date()) {
			throw new Forbidden("expiredRefreshToken", "Refresh token is expired");
		}

		if (token.user.id !== userId) {
			throw new Forbidden("invalidRefreshToken", "Refresh token is invalid");
		}

		const roles = await em.find(Role, {
			user: { id: userId },
		});

		const accessTokenData: AccessTokenData = {
			userId,
			role: {
				id: roles[0].id,
				type: roles[0].type,
			},
			type: TOKEN_TYPE.ACCESS,
		};

		return await createSimpleAccessToken<AccessTokenData>(accessTokenData);
	};
}
