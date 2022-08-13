import React from "react";

export interface LayoutProps {
	header: React.ReactNode;
	children: React.ReactNode;
}

const Layout = ({ header, children }: LayoutProps) => {
	return (
		<div className="min-h-screen">
			{header}
			{children}
		</div>
	);
};

export default Layout;
