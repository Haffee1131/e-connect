import type { Metadata } from "next";

import { SocketProvider } from "@/contexts/SocketContext";

import "../styles/globals.css";

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
			<SocketProvider>
				<body>{children}</body>
			</SocketProvider>
		</html>
	);
}
