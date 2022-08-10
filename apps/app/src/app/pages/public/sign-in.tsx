import React from "react";
import { Button, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import { validateForm } from "app/utils";
import { LoginBody } from "@battleships/contracts";
import { PublicLayout } from "app/components";

const initialValues = {
	email: "",
	password: "",
};

export type SignInPageValues = typeof initialValues;

const SignInPage = () => {
	const handleSubmit = (values: SignInPageValues) => {
		console.log({ values });
	};

	const {
		handleSubmit: onSubmit,
		handleChange,
		handleBlur,
		errors,
		values,
		isSubmitting,
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
			<form onSubmit={onSubmit}>
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
					helperText={touched.email ? errors.email : ""}
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
				<div className="flex align-middle justify-center">
					<Button type="submit" variant="contained" disabled={isSubmitting}>
						Submit
					</Button>
				</div>
			</form>
		</PublicLayout>
	);
};

export default SignInPage;
