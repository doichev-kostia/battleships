import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { paths } from "app/constants/paths";
// import { useTokenData } from "data";
import RedirectToBaseRoute from "app/utils/routing/redirect-to-base-route";
import { ROLE_TYPE } from "@battleships/contracts";

interface PrivateRouteProps {
	children: React.ReactNode;
	roles: ROLE_TYPE[];
}

const PrivateRoute = ({ children, roles }: PrivateRouteProps) => {
	const location = useLocation();

	// const tokenData = useTokenData();
	const tokenData = {
		role: {
			type: ROLE_TYPE.GAMER,
		},
	};

	if (!tokenData) {
		return <Navigate to={`/${paths.signIn}`} state={{ from: location }} />;
	}

	const { role } = tokenData;

	if (!roles.includes(role.type)) {
		return <RedirectToBaseRoute />;
	}

	return children;
};

export default PrivateRoute;
