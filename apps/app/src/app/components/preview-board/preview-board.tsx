import React from "react";
import { Grid } from "../../utils/game/grid";
import cx from "classnames";

interface PrepareBoardProps {
	grid: Grid;
}

export const PreviewBoard = ({ grid }: PrepareBoardProps) => {
	return (
		<>
			{grid.getGrid().map((row, index) => {
				return (
					<div className="flex flex-nowrap justify-center" key={index}>
						{row.map((cell) => {
							const hasShip = cell.getHasShip();
							const { x, y } = cell.getCoordinates();
							return (
								<div
									key={`${x}-${y}`}
									className={cx(
										hasShip && "bg-green-500",
										"h-10 w-10 cursor-pointer border border-solid",
									)}
								/>
							);
						})}
					</div>
				);
			})}
		</>
	);
};
