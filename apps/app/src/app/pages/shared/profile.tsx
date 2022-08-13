import React from "react";
import { useFormik } from "formik";
import { UserBody } from "@battleships/contracts";
import { plainToInstance } from "class-transformer";
import Typography from "@mui/material/Typography";
import { UserForm } from "app/components/user-form";
import { styled } from "@mui/material";

const initialValues = plainToInstance(UserBody, {
	firstName: "Kostiantyn",
	lastName: "Doichev",
	email: "kostia.doichev@gmail.com",
	username: "doichev-kostia",
	phoneNumber: undefined,
});

const FormWrapper = styled("div")`
	max-width: 600px;
	margin: 0 auto;
	margin-top: 20px;
`;

const ProfilePage = () => {
	const handleSubmit = (values: UserBody) => {
		console.log({ values });
	};

	const formikConfig = useFormik({
		onSubmit: handleSubmit,
		initialValues,
	});
	return (
		<FormWrapper>
			<Typography variant="h5" className="mb-10">
				Profile
			</Typography>
			<UserForm formikConfig={formikConfig} hasPassword={false} />
		</FormWrapper>
	);
};

export default ProfilePage;
