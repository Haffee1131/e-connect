import { useEffect, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getRandomColor } from "@/utils/ColorUtils";

interface AvatarProps {
	userName: string;
	sent: boolean;
}

export function AvatarComponent({ userName, sent }: AvatarProps) {
	const [avatarColor, setAvatarColor] = useState("");

	useEffect(() => {
		setAvatarColor(getRandomColor());
	}, []);

	return (
		<Avatar
			className={`w-7 h-7 ${sent ? "ml-2" : "mr-2"}`}
			style={{ backgroundColor: avatarColor }}
		>
			<AvatarImage
				src={`https://api.dicebear.com/6.x/initials/svg?seed=${userName}`}
				alt={userName}
			/>
			<AvatarFallback
				style={{ backgroundColor: avatarColor, color: "white" }}
			>
				{userName.charAt(0)}
			</AvatarFallback>
		</Avatar>
	);
}
