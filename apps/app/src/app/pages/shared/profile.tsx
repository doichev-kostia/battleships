import React from "react";
import { useFormik } from "formik";
import { UserBody, UserRepresentation } from "@battleships/contracts";
import { plainToInstance } from "class-transformer";
import Typography from "@mui/material/Typography";
import { UserForm } from "app/components/user-form";
import { styled } from "@mui/material";
import { useFetchUser, useTokenData } from "data";
import { Loader } from "app/components/loader";
import _ from "lodash";

const FormWrapper = styled("div")`
	max-width: 600px;
	margin: 0 auto;
	margin-top: 20px;
`;

const initializeDefaultValues = (data?: UserRepresentation) => {
	if (!data) return {} as UserBody;
	const values = _.pick(data, ["firstName", "lastName", "email", "username", "phoneNumber"]);
	return plainToInstance(UserBody, values);
};

const ProfilePage = () => {
	const tokenData = useTokenData();
	const userId = tokenData?.userId;

	const { data, isLoading } = useFetchUser(userId || "", {
		enabled: !!userId,
	});

	const handleSubmit = (values: UserBody) => {
		console.log({ values });
	};

	const formikConfig = useFormik({
		onSubmit: handleSubmit,
		initialValues: initializeDefaultValues(data),
	});

	return (
		<FormWrapper>
			<Typography variant="h5" className="mb-10">
				Profile
			</Typography>
			{!isLoading ? <UserForm formikConfig={formikConfig} hasPassword={false} /> : <Loader />}
		</FormWrapper>
	);
};

export default ProfilePage;
