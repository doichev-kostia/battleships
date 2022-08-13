import React from "react";
import { PublicLayout } from "app/components";
import { Typography } from "@mui/material";
import { useFormik } from "formik";
import { validateForm } from "app/utils";
import { SignUpValidationSchema } from "data";
import { UserForm } from "app/components/user-form";

export type SignUpValues = {
	[key in keyof SignUpValidationSchema]: string | null;
};

const initialValues: SignUpValues = {
	firstName: "",
	lastName: "",
	email: "",
	username: "",
	phoneNumber: null,
	password: "",
	confirmPassword: "",
};

const SignUpPage = () => {
	const handleSubmit = (values: SignUpValues) => {
		console.log({ values });
	};

	const formikConfig = useFormik<SignUpValues>({
		initialValues,
		onSubmit: handleSubmit,
		validate: (values) => validateForm(values, SignUpValidationSchema),
	});

	return (
		<PublicLayout>
			<Typography variant="h5" className="mb-3">
				Sign up
			</Typography>
			<UserForm formikConfig={formikConfig} hasPassword />
		</PublicLayout>
	);
};

export default SignUpPage;
