import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Helmet } from "react-helmet";
import { gamerAbsolutePaths, paths } from "app/constants/paths";
import Layout from "app/components/layout/layout";

const Header = React.lazy(() => import("app/components/header/header"));
const DashboardPage = React.lazy(() => import("app/pages/gamer/dashboard"));
const ProfilePage = React.lazy(() => import("app/pages/shared/profile"));
const GamePage = React.lazy(() => import("app/pages/gamer/game"));
const WaitingRoomPage = React.lazy(() => import("app/pages/gamer/waiting-room"));
const ArchivePage = React.lazy(() => import("app/pages/gamer/archive"));

const headerPages = [
	{ label: "Dashboard", absolutePath: gamerAbsolutePaths.dashboard },
	{ label: "Archive", absolutePath: gamerAbsolutePaths.archive },
];
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
				<Route
					path={paths.dashboard}
					element={
						<>
							<Helmet>
								<title>Battleships | Gamer | Dashboard</title>
							</Helmet>
							<DashboardPage />
						</>
					}
				/>
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
				<Route
					path={`${paths.game}/:gameId`}
					element={
						<>
							<Helmet>
								<title>Battleships | Gamer | Game</title>
							</Helmet>
							<GamePage />
						</>
					}
				/>
				<Route
					path={`${paths.waitingRoom}/${paths.game}/:gameId`}
					element={
						<>
							<Helmet>
								<title>Battleships | Gamer | Waiting room</title>
							</Helmet>
							<WaitingRoomPage />
						</>
					}
				/>
				<Route
					path={paths.archive}
					element={
						<>
							<Helmet>
								<title>Battleships | Gamer | Archive</title>
							</Helmet>
							<ArchivePage />
						</>
					}
				/>
				<Route path="*" element={<Navigate replace to={gamerAbsolutePaths.dashboard} />} />
			</Routes>
		</Layout>
	);
};

export default GamerRouter;
