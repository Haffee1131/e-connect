import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
	title: "E-Connect",
	description: "Chat Room created by Haffee with ❤️",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body>{children}</body>
		</html>
	);
}
