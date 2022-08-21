import { Exclude, Expose } from "class-transformer";
import { IsNumber, IsUUID, Min } from "class-validator";

@Exclude()
export class ShipRepresentation {
	@Expose()
	@IsUUID()
	public id: string;

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
