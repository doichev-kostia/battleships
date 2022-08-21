import { Exclude, Expose } from "class-transformer";
import { IsNumber, IsUUID, Min } from "class-validator";

@Exclude()
export class ShotBody {
	@Expose()
	@IsUUID()
	public playerId: string;

	@Expose()
	@IsNumber()
	@Min(0)
	public x: number;

	@Expose()
	@IsNumber()
	@Min(0)
	public y: number;
}
