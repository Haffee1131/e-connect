import type { Metadata } from "next";

import { UserProvider } from "@/contexts/UserContext";
import "./globals.css";

export const metadata: Metadata = {
	title: "E-Connect",
	description: "Chat Room created by Haffee with ❤️",
	applicationName: "E-Connect",
	authors: [{ name: "Hafeez Mohamad" }],
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body>
				<UserProvider>{children}</UserProvider>
			</body>
		</html>
	);
}
