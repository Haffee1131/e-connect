import { useEffect, useState } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getHashedColor } from "@/utils/ColorUtils";

interface AvatarProps {
	userName: string;
	sent: boolean;
}

export function AvatarComponent({ userName, sent }: AvatarProps) {
	const [avatarColor, setAvatarColor] = useState("");

	useEffect(() => {
		setAvatarColor(getHashedColor(userName));
	}, []);

	return (
		<Avatar
			className={`w-7 h-7 ${sent ? "ml-2" : "mr-2"}`}
			style={{ backgroundColor: avatarColor }}
		>
			<AvatarFallback
				style={{ backgroundColor: avatarColor, color: "white" }}
			>
				{userName.slice(0, 2).toUpperCase()}
			</AvatarFallback>
		</Avatar>
	);
}
