import { Exclude, Expose } from "class-transformer";
import { IsNumber, Min } from "class-validator";

@Exclude()
export class ShipBody {
	@Expose()
	@IsNumber()
	@Min(0)
	public xStart: number;

	@Expose()
	@IsNumber()
	@Min(0)
	public yStart: number;

	@Expose()
	@IsNumber()
	@Min(0)
	public xEnd: number;

	@Expose()
	@IsNumber()
	@Min(0)
	public yEnd: number;
}
