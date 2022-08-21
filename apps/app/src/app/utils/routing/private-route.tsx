import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { paths } from "app/constants/paths";
import RedirectToBaseRoute from "app/utils/routing/redirect-to-base-route";
import { ROLE_TYPE } from "@battleships/contracts";
import { useTokenData } from "data";

interface PrivateRouteProps {
	children: React.ReactNode;
	roles: ROLE_TYPE[];
}

const PrivateRoute = ({ children, roles }: PrivateRouteProps): JSX.Element => {
	const location = useLocation();

	const tokenData = useTokenData();

	if (!tokenData) {
		return <Navigate to={`/${paths.signIn}`} state={{ from: location }} />;
	}

	const { role } = tokenData;

	if (!roles.includes(role.type)) {
		return <RedirectToBaseRoute />;
	}

	return <>{children}</>;
};

export default PrivateRoute;
