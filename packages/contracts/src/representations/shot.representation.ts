import { Exclude, Expose } from "class-transformer";
import { IsNumber, IsUUID, Min } from "class-validator";

@Exclude()
export class ShotRepresentation {
	@Expose()
	@IsUUID()
	public id: string;

	@Expose()
	@IsNumber()
	@Min(0)
	public x: number;

	@Expose()
	@IsNumber()
	@Min(0)
	public y: number;
}
