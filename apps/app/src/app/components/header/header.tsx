import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import MapIcon from "@mui/icons-material/Map";
import { Link, useNavigate } from "react-router-dom";

interface HeaderLink {
	label: string;
	absolutePath: string;
}

interface HeaderProps {
	pages: HeaderLink[];
	settings: HeaderLink[];
}

const Header = ({ pages, settings }: HeaderProps) => {
	const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
	const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

	const navigate = useNavigate();

	const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElNav(event.currentTarget);
	};

	const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElUser(event.currentTarget);
	};

	const handleCloseNavMenu = (path?: string) => {
		setAnchorElNav(null);
		if (path) {
			navigate(path);
		}
	};

	const handleCloseUserMenu = () => {
		setAnchorElUser(null);
	};

	return (
		<AppBar position="static">
			<Container maxWidth="xl">
				<Toolbar disableGutters>
					<MapIcon className="mr-px hidden md:flex" />
					<Typography
						variant="h6"
						noWrap
						component={Link}
						to="/"
						className="font-bold uppercase no-underline m-0.5 font-mono tracking-wide text-inherit hidden md:flex"
					>
						Battleships
					</Typography>

					<Box className="grow flex md:hidden">
						<IconButton
							size="large"
							aria-label="account of current user"
							aria-controls="menu-appbar"
							aria-haspopup="true"
							onClick={handleOpenNavMenu}
							color="inherit"
						>
							<MenuIcon />
						</IconButton>
						<Menu
							id="menu-appbar"
							anchorEl={anchorElNav}
							anchorOrigin={{
								vertical: "bottom",
								horizontal: "left",
							}}
							keepMounted
							transformOrigin={{
								vertical: "top",
								horizontal: "left",
							}}
							open={Boolean(anchorElNav)}
							onClose={() => handleCloseNavMenu()}
							className="block md:hidden"
						>
							{pages.map(({ label, absolutePath }) => (
								<MenuItem key={label} onClick={() => handleCloseNavMenu()}>
									<Typography
										component={Link}
										replace
										to={absolutePath}
										className="no-underline text-center text-inherit"
									>
										{label}
									</Typography>
								</MenuItem>
							))}
						</Menu>
					</Box>
					<MapIcon className="mr-px flex md:hidden" />
					<Typography
						variant="h5"
						noWrap
						component={Link}
						to="/"
						className="font-bold grow uppercase no-underline m-0.5 font-mono tracking-wide text-inherit flex md:hidden"
					>
						Battleships
					</Typography>

					<Box className="grow hidden md:flex">
						{pages.map(({ label, absolutePath }) => (
							<Typography
								component={Link}
								to={absolutePath}
								key={label}
								onClick={() => handleCloseNavMenu(absolutePath)}
								className="my-0.5 text-white block no-underline"
							>
								{label}
							</Typography>
						))}
					</Box>

					<Box sx={{ flexGrow: 0 }}>
						<Tooltip title="Open settings">
							<IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
								<Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
							</IconButton>
						</Tooltip>
						<Menu
							sx={{ mt: "45px" }}
							id="menu-appbar"
							anchorEl={anchorElUser}
							anchorOrigin={{
								vertical: "top",
								horizontal: "right",
							}}
							keepMounted
							transformOrigin={{
								vertical: "top",
								horizontal: "right",
							}}
							open={Boolean(anchorElUser)}
							onClose={handleCloseUserMenu}
						>
							{settings.map(({ label, absolutePath }) => (
								<MenuItem key={label} onClick={handleCloseUserMenu}>
									<Typography
										component={Link}
										replace
										to={absolutePath}
										className="no-underline text-center text-inherit"
									>
										{label}
									</Typography>
								</MenuItem>
							))}
						</Menu>
					</Box>
				</Toolbar>
			</Container>
		</AppBar>
	);
};

export default Header;
