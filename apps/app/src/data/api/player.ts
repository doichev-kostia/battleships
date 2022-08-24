import { PlayerBody, PlayerWithGameRepresentation } from "@battleships/contracts";
import api from "data/http-client/api";

export const updatePlayer = (playerId: string, body: Partial<PlayerBody>) => {
	return api.patch<PlayerWithGameRepresentation>(`/players/${playerId}`, body);
};
