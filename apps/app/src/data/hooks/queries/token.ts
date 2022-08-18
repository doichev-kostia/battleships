import { useMutation, UseMutationOptions } from "react-query";
import { tokenKeys } from "data/queryKeys";
import { refreshAccessToken } from "data/api/token";
import { AxiosError } from "axios";
import { APIError, APIValidationError } from "data/utils/types";
import { TokenBody } from "@battleships/contracts";

type UseRefreshAccessTokenOptions = Omit<
	UseMutationOptions<null, AxiosError<APIError | APIValidationError<TokenBody>>, TokenBody>,
	"mutationFn" | "mutationKey"
>;

export const useRefreshAccessToken = (options?: UseRefreshAccessTokenOptions) => {
	return useMutation(tokenKeys.refresh, refreshAccessToken, options);
};
