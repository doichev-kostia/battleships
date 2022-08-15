import { LoginBody, RegisterBody, UserRepresentation } from "@battleships/contracts";
import api from "data/http-client/api";

export const register = (body: RegisterBody) =>
	api.post<UserRepresentation>("/authentication/register", body);

export const login = (body: LoginBody) =>
	api.post<UserRepresentation>("/authentication/login", body);

export const refresh = () => api.post("/authentication/refresh");
