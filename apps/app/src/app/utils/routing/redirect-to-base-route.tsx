import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { paths } from "app/constants/paths";
import { ROLE_TYPE } from "@battleships/contracts";
import { useTokenData } from "data";

const roleBaseRoute = {
	[ROLE_TYPE.GAMER]: paths.gamer,
	[ROLE_TYPE.ADMIN]: paths.admin,
};

const RedirectToBaseRoute = () => {
	const tokenData = useTokenData();

	const location = useLocation();

	if (!tokenData) {
		return <Navigate to={`/${paths.signIn}`} state={{ from: location }} />;
	}

	const { role } = tokenData;

	return <Navigate to={`/${roleBaseRoute[role.type]}`} />;
};

export default RedirectToBaseRoute;
