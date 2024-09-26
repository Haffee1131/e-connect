"use client";

import { createContext, ReactNode, useContext, useState } from "react";

interface UserContextType {
	username: string;
	setUsername: (name: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
	const context = useContext(UserContext);
	if (!context) {
		throw new Error("useUser must be used within a UserProvider");
	}
	return context;
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
	const [username, setUsername] = useState("User");

	return (
		<UserContext.Provider value={{ username, setUsername }}>
			{children}
		</UserContext.Provider>
	);
};
