import { TokenBody } from "@battleships/contracts";
import api from "data/http-client/api";

export const refreshAccessToken = (body: TokenBody) => api.post<null>("/tokens/refresh", body);
