import { FormikErrors, FormikValues } from "formik";
import { validate } from "class-validator";
import { ClassConstructor, plainToInstance } from "class-transformer";

export const validateForm = async <V extends FormikValues, S extends ClassConstructor<object>>(
	values: V,
	schema: S,
) => {
	const transformed = plainToInstance(schema, values, {});
	const validationErrors = await validate(transformed, {
		skipMissingProperties: false,
		whitelist: true,
		forbidNonWhitelisted: true,
		stopAtFirstError: false,
	});

	return validationErrors.reduce((formikErrors, validationError) => {
		if (!validationError.constraints) {
			return formikErrors;
		}

		const errorMessage = Object.values(validationError.constraints).join(" ");
		return {
			...formikErrors,
			[validationError.property]: errorMessage,
		};
	}, {} as FormikErrors<V>);
};
