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
	fetchGame,
	getAvailableGames,
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

type UseFetchAvailableGamesOptions = Omit<
	UseQueryOptions<ListRepresentation<GameRepresentation>, APIError>,
	"queryFn" | "queryKey"
>;

export const useFetchAvailableGames = (roleId: string, options?: UseFetchAvailableGamesOptions) => {
	return useQuery(gameKeys.available, () => getAvailableGames(roleId), options);
};

type UseFetchGameOptions = Omit<
	UseQueryOptions<GameRepresentation, APIError, GameRepresentation, any>,
	"queryFn" | "queryKey"
>;

export const useFetchGame = (id: string, options?: UseFetchGameOptions) => {
	const queryClient = useQueryClient();
	return useQuery(gameKeys.get(id), () => fetchGame(id), {
		...options,
		onSuccess: (data) => {
			queryClient.setQueryData(gameKeys.get(id), data);
			if (typeof options?.onSuccess === "function") {
				options.onSuccess(data);
			}
		},
	});
};

type UseJoinGameOptions = Omit<
	UseMutationOptions<GameRepresentation, APIError, JoinGameArgs>,
	"mutationFn" | "mutationKey"
>;

export const useJoinGame = (options?: UseJoinGameOptions) => {
	return useMutation(gameKeys.join, joinGame, options);
};

type UseStartGameOptions = Omit<
	UseMutationOptions<GameRepresentation, APIError, string>,
	"mutationFn" | "mutationKey"
>;
export const useStartGame = (options?: UseStartGameOptions) => {
	return useMutation(gameKeys.start, startGame, options);
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
