import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { paths } from "app/constants/paths";
import Cookies from "js-cookie";

const SignOutPage = () => {
	useEffect(() => {
		Cookies.remove("auth", { path: "/" });
	}, []);

	return <Navigate to={`${paths.signIn}`} />;
};

export default SignOutPage;
