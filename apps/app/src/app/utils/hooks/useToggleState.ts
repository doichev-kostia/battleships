import React, { useState } from "react";

export const useToggleState = (
	initialState: boolean,
): [boolean, () => void, React.Dispatch<React.SetStateAction<boolean>>] => {
	const [state, setState] = useState<boolean>(initialState);

	const toggle = (): void => {
		setState(!state);
	};

	return [state, toggle, setState];
};
