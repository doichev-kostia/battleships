import React, { useMemo, useState } from "react";
import cx from "classnames";
import { Coordinates } from "app/utils/types";
import { Cell as GameCell } from "app/utils/game/cell";

export interface CellProps extends React.HTMLAttributes<HTMLDivElement> {
	cell: GameCell;
	clickable?: boolean;
	isKilled?: boolean;
	isShot?: boolean;
	onMiss: (coordinates: Coordinates) => void;
	onHit: (coordinates: Coordinates) => void;
	onKill: (coordinates: Coordinates) => void;
	onShot: (coordinates: Coordinates) => void;
}

type CellState = "miss" | "hit" | "kill" | null;

export const Cell = ({
	cell,
	className,
	onMiss,
	onKill,
	onHit,
	isShot,
	onShot,
	clickable = true,
	isKilled = false,
	...rest
}: CellProps) => {
	const [state, setState] = useState<CellState>(null);
	const coordinates = useMemo(() => cell.getCoordinates(), [cell]);
	const ship = useMemo(() => cell.getShip(), [cell]);
	const isShip = ship != undefined;
	//
	// useEffect(() => {
	// 	if (isKilled) {
	// 		console.log({ isKilled, coordinates });
	// 		setState("kill");
	// 	}
	// }, [isKilled]);
	//
	// useEffect(() => {
	// 	console.time("shot effect");
	// 	if (!isShot) return;
	//
	// 	if (isShip) {
	// 		if (ship.getIsKilled()) {
	// 			setState("kill");
	// 			return;
	// 		}
	// 		setState("hit");
	// 		return;
	// 	}
	//
	// 	setState("miss");
	// 	console.time("shot effect");
	// }, [isShot]);

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
	const handleClick = () => {
		if (!clickable) {
			return;
		}

		onShot(coordinates);

		if (!isShip) {
			onMiss(coordinates);
			setState("miss");
			return;
		}

		cell.hit();

		onHit(coordinates);

		if (ship.getIsKilled()) {
			onKill(coordinates);
			setState("kill");
			return;
		}

		setState("hit");
	};
	return (
		<div
			onClick={handleClick}
			role="button"
			tabIndex={0}
			className={cx(
				className,
				"h-10 w-10 cursor-pointer border border-solid",
				state === "miss" && "bg-slate-500",
				state === "hit" && "bg-green-500",
				state === "kill" && "bg-red-500",
			)}
			{...rest}
		>
			{/*{isShip && <Ship />}*/}
		</div>
	);
};
