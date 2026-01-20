// Helper function to get appropriate colour (on gradient scale) for an event
// Based upon the event's position value (agreement on continuous scale to a side) between 0.0 and 1.0
export const getEventColor = (position: number) => {
	const r = Math.round(220 * (1 - position) + 34 * position);
	const g = Math.round(38 * (1 - position) + 197 * position);
	const b = Math.round(38 * (1 - position) + 94 * position);
	return `rgb(${r}, ${g}, ${b})`;
};
