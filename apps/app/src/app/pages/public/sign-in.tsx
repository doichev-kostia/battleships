import React from "react";
import { Button, FormHelperText, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import { validateForm } from "app/utils";
import { LoginBody } from "@battleships/contracts";
import { PublicLayout } from "app/components";
import { useSignIn } from "data";
import { Link, useNavigate } from "react-router-dom";
import { paths } from "app/constants/paths";

const initialValues = {
	login: "",
	password: "",
};

export type SignInPageValues = typeof initialValues;

const SignInPage = () => {
	const { mutate: signIn, error, isError } = useSignIn();
	const navigate = useNavigate();

	const handleSubmit = (values: SignInPageValues) => {
		signIn(values, {
			onSuccess: () => {
				navigate("/");
			},
		});
	};

	const {
		handleSubmit: onSubmit,
		handleChange,
		handleBlur,
		errors,
		values,
		touched,
	} = useFormik({
		initialValues,
		onSubmit: handleSubmit,
		validate: (values) => validateForm(values, LoginBody),
	});

	return (
		<PublicLayout>
			<Typography variant="h5" className="mb-3">
				Sign In
			</Typography>
			<form onSubmit={onSubmit} className="mb-10">
				<TextField
					fullWidth
					required
					name="login"
					value={values.login}
					error={!!errors.login && touched.login}
					label="login"
					id="login"
					onChange={handleChange}
					onBlur={handleBlur}
					helperText={touched.login ? errors.login : ""}
					className="mb-3"
				/>
				<TextField
					fullWidth
					required
					type="password"
					error={!!errors.password && touched.password}
					value={values.password}
					name="password"
					label="Password"
					id="password"
					onChange={handleChange}
					onBlur={handleBlur}
					helperText={touched.password ? errors.password : ""}
					className="mb-3"
				/>
				<FormHelperText error={isError}>
					{error?.response?.data ? error.response.data.message : ""}
				</FormHelperText>
				<div className="flex align-middle justify-center">
					<Button type="submit" variant="contained">
						Submit
					</Button>
				</div>
			</form>
			<div>
				<Typography className="text-center" variant="body2">
					Don't have an account, yet?{" "}
					<Link className="no-underline text-blue-400" to={`/${paths.signUp}`}>
						Sign Up
					</Link>
				</Typography>
			</div>
		</PublicLayout>
	);
};

export default SignInPage;
