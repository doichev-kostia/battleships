import api from "data/http-client/api";
import { GameRepresentation, JoinGameBody, ShotBody } from "@battleships/contracts";
import { ListRepresentation } from "data/utils/types";

export const createGame = () => {
	return api.post<GameRepresentation>("/games");
};

export const fetchAvailableGames = (roleId: string) => {
	return api.get<ListRepresentation<GameRepresentation>>(`/games/available/${roleId}`);
};

export const fetchFinishedGames = (roleId: string) => {
	return api.get<ListRepresentation<GameRepresentation>>(`/games/finished/${roleId}`);
};

export const exportFinishedGames = (roleId: string) => {
	return api.get<Blob>(`/games/finished/${roleId}/download`, {
		responseType: "blob",
	});
};

export const fetchGame = (id: string) => {
	return api.get<GameRepresentation>(`/games/${id}`);
};

export interface JoinGameArgs {
	gameId: string;
	body: JoinGameBody;
}

export const joinGame = ({ gameId, body }: JoinGameArgs) => {
	return api.patch<GameRepresentation>(`/games/${gameId}/join`, body);
};

export const startGame = (id: string) => {
	return api.patch<GameRepresentation>(`/games/${id}/start`);
};

export const finishGame = (id: string) => {
	return api.patch<GameRepresentation>(`/games/${id}/finish`);
};

export interface RegisterShotArgs {
	gameId: string;
	body: ShotBody;
}

export const registerShot = ({ gameId, body }: RegisterShotArgs) => {
	return api.patch<GameRepresentation>(`/games/${gameId}/shoot`, body);
};
