import api from "data/http-client/api";
import { GameRepresentation, JoinGameBody, ShotBody } from "@battleships/contracts";
import { ListRepresentation } from "data/utils/types";

export const createGame = () => {
	return api.post<GameRepresentation>("/games");
};

export const getAvailableGames = (roleId: string) => {
	return api.get<ListRepresentation<GameRepresentation>>(`/games/available/${roleId}`);
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

export interface RegisterShotArgs {
	gameId: string;
	body: ShotBody;
}

export const registerShot = ({ gameId, body }: RegisterShotArgs) => {
	return api.patch<GameRepresentation>(`/games/${gameId}/shoot`, body);
};
