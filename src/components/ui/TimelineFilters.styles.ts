import { StylesConfig } from "react-select";

import { ReactSelectEvent } from "@/models/event";

export const customStyles: StylesConfig<ReactSelectEvent> = {
	control: (styles) => ({
		...styles,
		backgroundColor: "var(--background)",
		borderColor: "var(--borderColour)",
		borderRadius: "0.5rem",
		minHeight: "42px",
		cursor: "pointer",
		maxHeight: "42px",
		width: "100%",
		boxShadow: "none",
		"&:hover": {
			borderColor: "var(--borderColour)",
		},
	}),
	valueContainer: (styles) => ({
		...styles,
		flexWrap: "nowrap",
		overflow: "hidden",
	}),
	menu: (styles) => ({
		...styles,
		backgroundColor: "var(--background)",
		borderColor: "var(--borderColour)",
		borderWidth: "1px",
		borderStyle: "solid",
		borderRadius: "0.5rem",
	}),
	menuList: (styles) => ({
		...styles,
		padding: 0,
	}),
	option: (styles, { isFocused, isSelected }) => ({
		...styles,
		backgroundColor: isSelected
			? "#3b82f6"
			: isFocused
				? "var(--lightSecondary)"
				: "transparent",
		color: isSelected ? "#ffffff" : "var(--foreground)",
		cursor: "pointer",
		"&:active": {
			backgroundColor: "#3b82f6",
		},
	}),
	multiValue: (styles) => ({
		...styles,
		backgroundColor: "var(--lightSecondary)",
		borderRadius: "0.25rem",
	}),
	multiValueLabel: (styles) => ({
		...styles,
		color: "var(--foreground)",
		overflow: "hidden",
		textOverflow: "ellipsis",
		whiteSpace: "nowrap",
	}),
	multiValueRemove: (styles) => ({
		...styles,
		color: "var(--foreground)",
		cursor: "pointer",
		"&:hover": {
			backgroundColor: "var(--borderColour)",
			color: "var(--foreground)",
		},
	}),
	input: (styles) => ({
		...styles,
		color: "var(--foreground)",
	}),
	placeholder: (styles) => ({
		...styles,
		color: "var(--borderColour)",
	}),
	singleValue: (styles) => ({
		...styles,
		color: "var(--foreground)",
	}),
};
