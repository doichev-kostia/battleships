import React from "react";
import cx from "classnames";

export interface CellProps extends React.HTMLAttributes<HTMLDivElement> {
	coordinates: {
		x: number;
		y: number;
	};
	isShip?: boolean;
}

export const Cell = ({ coordinates, className, isShip, ...rest }: CellProps) => {
	// const [, drop] = useDrop(
	// 	() => ({
	// 		accept: ITEM_TYPE.SHIP,
	// 		drop: () => (x, y),
	// 		collect: (monitor) => ({
	// 			isOver: monitor.isOver()
	// 		}
	// 	}),
	// 	[coordinates],
	// );
	const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
		console.log(`x: ${coordinates.x}, y: ${coordinates.y}`);
	};
	return (
		<div
			onClick={handleClick}
			role="button"
			tabIndex={0}
			className={cx(className, "w-10 h-10 border border-solid cursor-pointer")}
			{...rest}
		>
			{/*{isShip && <Ship />}*/}
		</div>
	);
};
