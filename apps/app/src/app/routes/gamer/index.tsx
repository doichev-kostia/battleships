import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Helmet } from "react-helmet";
import { gamerAbsolutePaths, paths } from "app/constants/paths";
import Layout from "app/components/layout/layout";

const Header = React.lazy(() => import("app/components/header/header"));
const DashboardPage = React.lazy(() => import("app/pages/gamer/dashboard"));
const ProfilePage = React.lazy(() => import("app/pages/shared/profile"));

const headerPages = [{ label: "Dashboard", absolutePath: gamerAbsolutePaths.dashboard }];
const headerSettings = [
	{ label: "Profile", absolutePath: gamerAbsolutePaths.profile },
	{ label: "Sign out", absolutePath: `/${paths.signOut}` },
];

const GamerRouter = () => {
	return (
		<Layout header={<Header pages={headerPages} settings={headerSettings} />}>
			<Helmet>
				<title>Battleships | Gamer</title>
			</Helmet>
			<Routes>
				<Route path={paths.dashboard} element={<DashboardPage />} />
				<Route
					path={paths.profile}
					element={
						<>
							<Helmet>
								<title>Battleships | Gamer | Profile</title>
							</Helmet>
							<ProfilePage />
						</>
					}
				/>
				<Route path="*" element={<Navigate replace to={gamerAbsolutePaths.dashboard} />} />
			</Routes>
		</Layout>
	);
};

export default GamerRouter;
