import jwtDecode from "jwt-decode";
import Cookies from "js-cookie";
import { AccessTokenData } from "data/types";
import { AUTH_COOKIES_KEY } from "data/constants";

export const useTokenData = (): AccessTokenData | undefined => {
	const token = Cookies.get(AUTH_COOKIES_KEY);
	return token ? jwtDecode<AccessTokenData>(token) : undefined;
};
