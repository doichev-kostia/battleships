import "reflect-metadata";

import { Type } from "class-transformer";
import { IsArray, IsObject, ValidateIf, ValidateNested } from "class-validator";
import { ClassType } from "./classType";

/**
 * Nested objects with this decorator will also be validated.
 *
 * Transforms the nested objects to the defined type
 * @param type The type to validate and transform the nested property
 * @param isArray Whether the property is an object or an array of objects
 *
 * @category Decorator
 */
export const Nested = <T>(type: ClassType<T>, isArray = false) => {
	const nestedValidation = ValidateNested({
		each: isArray,
		context: type,
	});
	const typeParser = Type(() => type);
	const validateIf = ValidateIf((_, value) => value !== null);
	const validateAsObjectOrArray = isArray ? IsArray() : IsObject();

	return (object: any, propertyName: string) => {
		validateIf(object, propertyName);
		nestedValidation(object, propertyName);
		validateAsObjectOrArray(object, propertyName);
		typeParser(object, propertyName);
	};
};
