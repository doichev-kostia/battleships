import React from "react";
import { Button, TextField } from "@mui/material";
import { UseFormikConfig } from "app/utils/formik-types";
import { UserBody } from "@battleships/contracts";
import { FormikErrors, FormikTouched } from "formik/dist/types";
import { SignUpValues } from "app/pages/public/sign-up";

export type UserFormikConfig<Password> = Password extends true
	? UseFormikConfig<SignUpValues>
	: UseFormikConfig<UserBody>;

export interface UserFormProps<Password extends boolean> {
	hasPassword: Password;
	formikConfig: UserFormikConfig<Password>;
}

export const UserForm = <P extends boolean>({ hasPassword, formikConfig }: UserFormProps<P>) => {
	const { handleSubmit, values, handleChange, handleBlur, errors, touched } = formikConfig;

	return (
		<form onSubmit={handleSubmit}>
			<div className="flex justify-between items-center mb-3 gap-x-3">
				<TextField
					fullWidth
					required
					value={values.firstName}
					error={!!errors.firstName && touched.firstName}
					name="firstName"
					label="First name"
					id="firstName"
					onChange={handleChange}
					onBlur={handleBlur}
					helperText={touched.firstName ? errors.firstName : " "}
					FormHelperTextProps={{
						title: touched.firstName ? errors.firstName : " ",
						classes: {
							root: "whitespace-nowrap text-ellipsis overflow-hidden text-xs",
						},
					}}
				/>
				<TextField
					fullWidth
					required
					error={!!errors.lastName && touched.lastName}
					value={values.lastName}
					name="lastName"
					label="Last name"
					id="lastName"
					onChange={handleChange}
					onBlur={handleBlur}
					helperText={touched.lastName ? errors.lastName : " "}
					FormHelperTextProps={{
						title: touched.firstName ? errors.firstName : " ",
						classes: {
							root: "whitespace-nowrap text-ellipsis overflow-hidden text-xs",
						},
					}}
				/>
			</div>
			<TextField
				fullWidth
				required
				name="email"
				value={values.email}
				error={!!errors.email && touched.email}
				label="Email"
				id="email"
				onChange={handleChange}
				onBlur={handleBlur}
				helperText={touched.email ? errors.email : " "}
				className="mb-3"
			/>
			<TextField
				fullWidth
				required
				name="username"
				value={values.username}
				error={!!errors.username && touched.username}
				label="Username"
				id="username"
				onChange={handleChange}
				onBlur={handleBlur}
				helperText={touched.username ? errors.username : " "}
				className="mb-3"
			/>
			<TextField
				fullWidth
				name="phoneNumber"
				value={values.phoneNumber}
				error={!!errors.phoneNumber && touched.phoneNumber}
				label="Phone number"
				id="phoneNumber"
				onChange={handleChange}
				onBlur={handleBlur}
				helperText={touched.phoneNumber ? errors.phoneNumber : " "}
				className="mb-3"
			/>
			{hasPassword && (
				<>
					<TextField
						fullWidth
						required
						type="password"
						error={
							!!(errors as FormikErrors<SignUpValues>).password &&
							(touched as FormikTouched<SignUpValues>).password
						}
						value={(values as SignUpValues).password}
						name="password"
						label="Password"
						id="password"
						onChange={handleChange}
						onBlur={handleBlur}
						helperText={
							(touched as FormikTouched<SignUpValues>).password
								? (errors as FormikErrors<SignUpValues>).password
								: " "
						}
						className="mb-3"
					/>
					<TextField
						fullWidth
						required
						type="password"
						error={
							!!(errors as FormikErrors<SignUpValues>).confirmPassword &&
							(touched as FormikTouched<SignUpValues>).confirmPassword
						}
						value={(values as SignUpValues).confirmPassword}
						name="confirmPassword"
						label="Confirm password"
						id="confirmPassword"
						onChange={handleChange}
						onBlur={handleBlur}
						helperText={
							(touched as FormikTouched<SignUpValues>).confirmPassword
								? (errors as FormikErrors<SignUpValues>).confirmPassword
								: " "
						}
						className="mb-3"
					/>
				</>
			)}
			<div className="flex items-center justify-center">
				<Button type="submit" variant="contained">
					{hasPassword ? "Sing up" : "Save"}
				</Button>
			</div>
		</form>
	);
};
