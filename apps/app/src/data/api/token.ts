import { TokenBody } from "@battleships/contracts";
import api from "data/http-client/api";
import Cookies from "js-cookie";
import { AUTH_COOKIES_KEY } from "data/constants";
import { AuthCookie } from "data/types";

export const refreshAccessToken = (body: TokenBody) => {
	const { refresh } = JSON.parse(Cookies.get(AUTH_COOKIES_KEY) ?? "{}") as AuthCookie;
	return api.post<null>("/tokens/refresh", body, {
		headers: {
			"x-refresh-token": refresh,
		},
	});
};
