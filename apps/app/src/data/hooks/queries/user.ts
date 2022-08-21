import { useQuery, UseQueryOptions } from "react-query";
import { userKeys } from "data/queryKeys";
import { getUser } from "data/api/user";
import { APIError } from "data/utils/types";
import { UserRepresentation } from "@battleships/contracts";

type UseFetchUserOptions = Omit<
	UseQueryOptions<UserRepresentation, APIError, UserRepresentation, any>,
	"queryFn" | "queryKey"
>;

export const useFetchUser = (id: string, options?: UseFetchUserOptions) => {
	return useQuery(
		userKeys.get(id),
		() => {
			return getUser(id);
		},
		options,
	);
};
