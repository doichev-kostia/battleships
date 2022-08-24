import {
	useMutation,
	UseMutationOptions,
	useQuery,
	useQueryClient,
	UseQueryOptions,
} from "react-query";
import { gameKeys } from "data/queryKeys";
import {
	createGame,
	fetchAvailableGames,
	fetchFinishedGames,
	fetchGame,
	finishGame,
	joinGame,
	JoinGameArgs,
	registerShot,
	RegisterShotArgs,
	startGame,
} from "data/api/game";
import { GameRepresentation } from "@battleships/contracts";
import { APIError, ListRepresentation } from "data/utils/types";

type UseInitializeGameOptions = Omit<
	UseMutationOptions<GameRepresentation, APIError, null>,
	"mutationFn" | "mutationKey"
>;

export const useInitializeGame = (options?: UseInitializeGameOptions) => {
	return useMutation<GameRepresentation, APIError, null>(gameKeys.create, createGame, options);
};

type UseFetchGamesOptions = Omit<
	UseQueryOptions<ListRepresentation<GameRepresentation>, APIError>,
	"queryFn" | "queryKey"
>;

export const useFetchAvailableGames = (roleId: string, options?: UseFetchGamesOptions) => {
	return useQuery(gameKeys.available, () => fetchAvailableGames(roleId), options);
};

export const useFetchFinishedGames = (roleId: string, options?: UseFetchGamesOptions) => {
	return useQuery(gameKeys.finished, () => fetchFinishedGames(roleId), options);
};

type UseFetchGameOptions = Omit<
	UseQueryOptions<GameRepresentation, APIError, GameRepresentation, any>,
	"queryFn" | "queryKey"
>;

export const useFetchGame = (id: string, options?: UseFetchGameOptions) => {
	return useQuery(gameKeys.get(id), () => fetchGame(id), options);
};

type UseJoinGameOptions = Omit<
	UseMutationOptions<GameRepresentation, APIError, JoinGameArgs>,
	"mutationFn" | "mutationKey"
>;

export const useJoinGame = (options?: UseJoinGameOptions) => {
	return useMutation(gameKeys.join, joinGame, options);
};

type ProgressGameOptions = Omit<
	UseMutationOptions<GameRepresentation, APIError, string>,
	"mutationFn" | "mutationKey"
>;
export const useStartGame = (options?: ProgressGameOptions) => {
	return useMutation(gameKeys.start, startGame, options);
};

export const useFinishGame = (options?: ProgressGameOptions) => {
	return useMutation(gameKeys.finish, finishGame, options);
};

type UseShotOptions = Omit<
	UseMutationOptions<GameRepresentation, APIError, RegisterShotArgs>,
	"mutationFn" | "mutationKey"
>;

export const useShoot = (options?: UseShotOptions) => {
	const queryClient = useQueryClient();
	return useMutation(gameKeys.shoot, registerShot, {
		...options,
		onSuccess: (data, variables, context) => {
			queryClient.invalidateQueries(gameKeys.get(data.id));
			if (typeof options?.onSuccess === "function") {
				options.onSuccess(data, variables, context);
			}
		},
	});
};
