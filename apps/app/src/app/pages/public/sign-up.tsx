import React from "react";
import { PublicLayout } from "app/components";
import { FormHelperText, Typography } from "@mui/material";
import { useFormik } from "formik";
import { validateForm } from "app/utils";
import { SignUpValidationSchema, useSignUp } from "data";
import { UserForm } from "app/components/user-form";
import { Link, useNavigate } from "react-router-dom";
import { paths } from "app/constants/paths";

export type SignUpValues = {
	[key in keyof SignUpValidationSchema]: any;
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
	const { mutate: signUp, error, isError } = useSignUp();

	const navigate = useNavigate();

	const handleSubmit = (values: SignUpValues) => {
		const { confirmPassword: _, ...body } = values;
		signUp(body, {
			onSuccess: () => {
				navigate("/");
			},
		});
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
			<FormHelperText error={isError}>
				{error?.response?.data ? error.response.data.message : ""}
			</FormHelperText>
			<div className="mt-10">
				<Typography className="text-center" variant="body2">
					Already have an account?{" "}
					<Link className="no-underline text-blue-400" to={`/${paths.signIn}`}>
						Sign In
					</Link>
				</Typography>
			</div>
		</PublicLayout>
	);
};

export default SignUpPage;
