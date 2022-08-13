import React, { Suspense } from "react";
import { Helmet } from "react-helmet";
import { Navigate, Route, Routes } from "react-router-dom";
import RedirectToBaseRoute from "app/utils/routing/redirect-to-base-route";
import { paths } from "app/constants/paths";
import PrivateRoute from "app/utils/routing/private-route";
import { ROLE_TYPE } from "@battleships/contracts";
import { Loader } from "app/components/loader";

const SignInPage = React.lazy(() => import("app/pages/public/sign-in"));
const SignUpPage = React.lazy(() => import("app/pages/public/sign-up"));
const SignOutPage = React.lazy(() => import("app/pages/public/sign-out"));
const GamerRouter = React.lazy(() => import("app/routes/gamer"));

const Router = () => {
	return (
		<>
			<Helmet>
				<title>Battleships</title>
			</Helmet>
			<Routes>
				<Route path={paths.signIn} element={<SignInPage />} />
				<Route path={paths.signUp} element={<SignUpPage />} />
				<Route path={paths.signOut} element={<SignOutPage />} />

				<Route
					path={`${paths.gamer}/*`}
					element={
						<Suspense fallback={<Loader />}>
							<PrivateRoute roles={[ROLE_TYPE.GAMER]}>
								<GamerRouter />
							</PrivateRoute>
						</Suspense>
					}
				/>

				<Route index element={<RedirectToBaseRoute />} />
				<Route path="*" element={<Navigate to="/" />} />
			</Routes>
		</>
	);
};

export default Router;
