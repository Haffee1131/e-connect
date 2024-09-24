import { useState, useEffect, useRef } from "react";

import { AvatarComponent } from "@/components/Message/AvatarComponent";
import { ReadMoreButton } from "@/components/Message/ReadMoreButton";
import { formatTime } from "@/utils/TimeUtils";

interface IMessageContentProps {
	text: string;
	timestamp: Date;
	userName: string;
	sent: boolean;
}

export function MessageContent({
	text,
	timestamp,
	userName,
	sent,
}: IMessageContentProps) {
	const [expanded, setExpanded] = useState(false);
	const [showReadMore, setShowReadMore] = useState(false);
	const contentRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (contentRef.current) {
			const lineHeight = parseInt(
				getComputedStyle(contentRef.current).lineHeight
			);
			const maxHeight = lineHeight * 5;
			setShowReadMore(contentRef.current.scrollHeight > maxHeight);
		}
	}, [text]);

	return (
		<div
			className={`flex items-start ${sent ? "flex-row-reverse" : "flex-row"}`}
		>
			<AvatarComponent userName={userName} sent={sent} />
			<div
				className={`relative max-w-[70%] p-3 rounded-lg ${sent ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-background"}`}
			>
				<div className="mb-1">
					<span className="text-md font-bold">{userName}</span>
				</div>
				<div
					ref={contentRef}
					className={`overflow-hidden ${expanded ? "max-h-full" : "max-h-[7.5em]"}`}
					style={{ wordBreak: "break-word" }}
				>
					{text}
				</div>
				<div className="flex justify-between items-center mt-1">
					{showReadMore && (
						<ReadMoreButton
							expanded={expanded}
							setExpanded={setExpanded}
						/>
					)}
					<span
						className={`text-xs text-muted-foreground ml-auto ${
							sent
								? "text-primary-foreground"
								: "text-muted-foreground"
						}
					`}
					>
						{formatTime(timestamp)}
					</span>
				</div>
				<div
					className={`absolute top-0 w-4 h-4 ${
						sent ? "-right-2 bg-primary" : "-left-2 bg-secondary"
					}`}
					style={{
						clipPath: sent
							? "polygon(0 0, 0% 100%, 100% 0)"
							: "polygon(100% 0, 0 0, 100% 100%)",
					}}
				/>
			</div>
		</div>
	);
}
