import React, { ForwardedRef, useEffect, useMemo, useState } from "react";
import cx from "classnames";
import { Coordinates } from "app/utils/types";
import { Cell as GameCell } from "app/utils/game/cell";

export interface CellProps extends React.HTMLAttributes<HTMLDivElement> {
	cell: GameCell;
	clickable?: boolean;
	isOpponentComputer?: boolean;
	isKilled?: boolean;
	onMiss: (coordinates: Coordinates) => void;
	onHit: (coordinates: Coordinates) => void;
	onKill: (coordinates: Coordinates) => void;
	onShot: (coordinates: Coordinates) => void;
}

type CellState = "miss" | "hit" | "kill" | null;

export const Cell = React.forwardRef(
	(
		{
			cell,
			className,
			onMiss,
			onKill,
			onHit,
			onShot,
			isOpponentComputer = false,
			clickable = true,
			isKilled = false,
			...rest
		}: CellProps,
		ref: ForwardedRef<HTMLDivElement>,
	) => {
		const [state, setState] = useState<CellState>(null);
		const coordinates = useMemo(() => cell.getCoordinates(), [cell]);
		const ship = cell.getShip();
		const isShip = ship != undefined;

		useEffect(() => {
			if (isKilled) {
				setState("kill");
			}
		}, [isKilled]);

		useEffect(() => {
			if (!cell.getIsHit()) return;

			if (isShip) {
				if (ship.getIsKilled()) {
					setState("kill");
					return;
				}
				setState("hit");
				return;
			}

			setState("miss");
		}, [cell.getIsHit()]);

		const handleClick = () => {
			if (!isOpponentComputer && (!clickable || cell.getIsHit())) {
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
				ref={ref}
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
			></div>
		);
	},
);
