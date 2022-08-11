import React from "react";
import { PublicLayout } from "app/components";
import { Button, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import { validateForm } from "app/utils";
import { SignUpValidationSchema } from "data";

const initialValues = {
	firstName: "",
	lastName: "",
	email: "",
	username: "",
	phoneNumber: null,
	password: "",
};

type SignUpFormValues = typeof initialValues;

const SignUpPage = () => {
	const handleSubmit = (values: SignUpFormValues) => {
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
		validate: (values) => validateForm(values, SignUpValidationSchema),
	});

	return (
		<PublicLayout>
			<Typography variant="h5" className="mb-3">
				Sign up
			</Typography>
			<form onSubmit={onSubmit}>
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
						helperText={touched.firstName ? errors.firstName : ""}
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
						helperText={touched.lastName ? errors.lastName : ""}
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
					helperText={touched.email ? errors.email : ""}
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
					helperText={touched.username ? errors.username : ""}
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
					helperText={touched.phoneNumber ? errors.phoneNumber : ""}
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
				<div className="flex items-center justify-center">
					<Button type="submit" variant="contained" disabled={isSubmitting}>
						Submit
					</Button>
				</div>
			</form>
		</PublicLayout>
	);
};

export default SignUpPage;
