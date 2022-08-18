import api from "data/http-client/api";
import { UserRepresentation } from "@battleships/contracts";

export const getUser = (id: string) => api.get<UserRepresentation>(`/users/${id}`);
