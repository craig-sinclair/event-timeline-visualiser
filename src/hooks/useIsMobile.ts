import { useState, useEffect } from "react";

export function useIsMobile({ maxWidthBreakpoint = 768 }: { maxWidthBreakpoint?: number } = {}) {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const media = window.matchMedia(`(max-width: ${maxWidthBreakpoint}px)`);
		const updateIsMobile = () => setIsMobile(media.matches);

		updateIsMobile();
		media.addEventListener("change", updateIsMobile);
		return () => media.removeEventListener("change", updateIsMobile);
	}, [maxWidthBreakpoint]);

	return isMobile;
}
