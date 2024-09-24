import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReadMoreButtonProps {
	expanded: boolean;
	setExpanded: (value: boolean) => void;
}

export function ReadMoreButton({ expanded, setExpanded }: ReadMoreButtonProps) {
	return (
		<Button
			variant="link"
			className="p-0 h-auto font-normal text-default"
			onClick={() => setExpanded(!expanded)}
		>
			{expanded ? (
				<>
					Read less <ChevronUp className="h-3 w-3 ml-1" />
				</>
			) : (
				<>
					Read more <ChevronDown className="h-3 w-3 ml-1" />
				</>
			)}
		</Button>
	);
}
