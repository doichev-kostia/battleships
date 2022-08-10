import React from "react";
import { Helmet } from "react-helmet";
import { Navigate, Route, Routes } from "react-router-dom";
import RedirectToBaseRoute from "./redirect-to-base-route";
import { paths } from "app/constants/paths";

const SignInPage = React.lazy(() => import("app/pages/public/sign-in"));
const SignUpPage = React.lazy(() => import("app/pages/public/sign-up"));

const Router = () => {
	return (
		<>
			<Helmet>
				<title>Battleships</title>
			</Helmet>
			<Routes>
				<Route path={`/${paths.signIn}`} element={<SignInPage />} />
				<Route path={`/${paths.signUp}`} element={<SignUpPage />} />
				<Route index element={<RedirectToBaseRoute />} />
				<Route path="*" element={<Navigate to="/" />} />
			</Routes>
		</>
	);
};

export default Router;
