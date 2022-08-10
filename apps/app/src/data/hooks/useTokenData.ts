import jwtDecode from "jwt-decode";
import Cookies from "js-cookie";
import { TokenData } from "data/types";

export const useTokenData = (): TokenData | undefined => {
	const token = Cookies.get("auth");
	return token ? jwtDecode<TokenData>(token) : undefined;
};
