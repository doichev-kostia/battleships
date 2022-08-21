import { authKeys } from "data/queryKeys";
import { useMutation, UseMutationOptions, useQueryClient } from "react-query";
import { login, register } from "data/api/auth";
import { LoginBody, RegisterBody, UserRepresentation } from "@battleships/contracts";
import { AxiosError } from "axios";
import { APIError, APIValidationError } from "data/utils/types";

type UseSignUpOptions = Omit<
	UseMutationOptions<
		UserRepresentation,
		AxiosError<APIError | APIValidationError<RegisterBody>>,
		RegisterBody
	>,
	"mutationFn" | "mutationKey"
>;

export const useSignUp = (options?: UseSignUpOptions) => {
	return useMutation(authKeys.register, register, options);
};

type UseSignInOptions = Omit<
	UseMutationOptions<
		UserRepresentation,
		AxiosError<APIError | APIValidationError<LoginBody>>,
		LoginBody
	>,
	"mutationFn" | "mutationKey"
>;

export const useSignIn = (options?: UseSignInOptions) => {
	const queryClient = useQueryClient();
	return useMutation(authKeys.login, login, {
		...options,
		retry: false,
		onSuccess: (data) => {
			queryClient.setQueryData(authKeys.login, data);
		},
	});
};
