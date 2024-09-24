export function getRandomColor() {
	const hue = Math.floor(Math.random() * 360);
	const saturation = 70;
	const lightness = 60;
	return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

// Utility to generate a consistent color from a userName
export function getHashedColor(userName: string) {
	let hash = 0;
	for (let i = 0; i < userName.length; i++) {
		hash = userName.charCodeAt(i) + ((hash << 5) - hash);
	}
	const hue = hash % 360;
	const saturation = 70;
	const lightness = 60;
	return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}