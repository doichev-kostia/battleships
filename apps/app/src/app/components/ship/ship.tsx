import React from "react";
import { useDrag } from "react-dnd";
import { ITEM_TYPE } from "app/constants/game-config";

const Ship = () => {
	const [{ isDragging }, drag] = useDrag({
		type: ITEM_TYPE.SHIP,
		collect: (monitor) => ({
			isDragging: monitor.isDragging(),
		}),
	});
	return (
		<div
			ref={drag}
			style={{
				opacity: isDragging ? 0.5 : 1,
				fontSize: 25,
				fontWeight: "bold",
				cursor: "move",
			}}
		>
			Ship
		</div>
	);
};

export default Ship;
