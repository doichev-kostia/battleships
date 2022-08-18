import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";
import { HTTP_REQUEST_METHOD, STATUS_CODE } from "@battleships/contracts";
import { AUTH_COOKIES_KEY } from "data/constants";
import { AccessTokenData, AuthCookie } from "data/types";
import { refreshAccessToken } from "data/api/token";

class HttpClient {
	private readonly axios: AxiosInstance;

	constructor(config: AxiosRequestConfig) {
		this.axios = axios.create(config);
		const { requestInterceptor, responseInterceptor, errorInterceptor } = this;
		this.axios.interceptors.request.use(requestInterceptor);
		this.axios.interceptors.response.use(responseInterceptor, errorInterceptor);
	}

	public static isTokenUrl(url: string): boolean {
		return new RegExp(/\/tokens/).test(url);
	}

	public static isRefreshUrl(url: string): boolean {
		return new RegExp(/tokens\/refresh/).test(url);
	}

	public static isAuthUrl(url: string): boolean {
		return new RegExp(/\/api\/authentication/).test(url);
	}

	private requestInterceptor(config: AxiosRequestConfig) {
		const configCopy = { ...config };

		const { auth, refresh } = JSON.parse(Cookies.get(AUTH_COOKIES_KEY) ?? "{}") as AuthCookie;

		if (typeof auth === "string" && auth) {
			const { exp, role, userId } = jwtDecode<AccessTokenData>(auth);
			const hasTokenExpired = new Date().getTime() / 1000 > Number(exp) - 5;

			if (hasTokenExpired && !HttpClient.isRefreshUrl(configCopy.url || "")) {
				refreshAccessToken({ userId, roleType: role.type });
				return {
					...configCopy,
					cancelToken: new axios.CancelToken((cancel) =>
						cancel(`The request was canceled. Token has expired. URL: ${config.url}`),
					),
				};
			}
			if (!hasTokenExpired && configCopy.headers) {
				configCopy.headers["x-auth"] = auth;
				configCopy.headers["x-refresh-token"] = refresh;
			}
		}

		return configCopy;
	}

	private responseInterceptor(response: AxiosResponse) {
		const {
			data,
			request,
			config: { method },
		} = response;

		const normalizedHttpMethod = method?.toUpperCase();
		if (
			HttpClient.isAuthUrl(request.responseURL) ||
			(normalizedHttpMethod === HTTP_REQUEST_METHOD.POST &&
				HttpClient.isTokenUrl(request.responseURL))
		) {
			const authCookie: AuthCookie = {
				auth: response.headers["x-auth"],
				refresh: response.headers["x-refresh-token"],
			};

			Cookies.set(AUTH_COOKIES_KEY, JSON.stringify(authCookie));
		}

		return data;
	}

	private errorInterceptor(error: AxiosError | Error) {
		if (error instanceof AxiosError) {
			const { response } = error;
			/**
			 * @todo: Make type safe
			 */
			const { auth } = JSON.parse(Cookies.get(AUTH_COOKIES_KEY) ?? "{}") as AuthCookie;

			if (typeof auth === "string" && auth) {
				const { role, userId } = jwtDecode<AccessTokenData>(auth);

				// in case the refresh token is expired or invalid, we need to logout the user
				if (
					(response?.status === STATUS_CODE.UNAUTHORIZED ||
						response?.status === STATUS_CODE.NOT_FOUND) &&
					HttpClient.isRefreshUrl(response?.config.url || "")
				) {
					Cookies.remove(AUTH_COOKIES_KEY, { path: "/" });
					window.location.href = "/";

					// in case the access token is expired, we need to refresh the session
				} else if (response?.status === STATUS_CODE.UNAUTHORIZED) {
					refreshAccessToken({ userId, roleType: role.type });
				}
			}
		}

		console.error(error);
		return Promise.reject(error);
	}

	public get<Response = unknown, Data = any>(
		url: string,
		config?: AxiosRequestConfig<Data>,
	): Promise<Response> {
		return this.axios.get.apply(this, [url, config]) as Promise<Response>;
	}

	public post<Response = unknown, Data = any>(
		url: string,
		data?: Data,
		config?: AxiosRequestConfig<Data>,
	): Promise<Response> {
		return this.axios.post.apply(this, [url, data, config]) as Promise<Response>;
	}

	public patch<Response = unknown, Data = any>(
		url: string,
		data?: Data,
		config?: AxiosRequestConfig<Data>,
	): Promise<Response> {
		return this.axios.patch.apply(this, [url, data, config]) as Promise<Response>;
	}

	public put<Response = unknown, Data = any>(
		url: string,
		data?: Data,
		config?: AxiosRequestConfig<Data>,
	): Promise<Response> {
		return this.axios.put.apply(this, [url, data, config]) as Promise<Response>;
	}

	public delete<Response = unknown, Data = any>(
		url: string,
		config?: AxiosRequestConfig<Data>,
	): Promise<Response> {
		return this.axios.delete.apply(this, [url, config]) as Promise<Response>;
	}
}

export default HttpClient;
