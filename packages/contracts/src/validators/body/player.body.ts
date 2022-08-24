import { Exclude, Expose } from "class-transformer";
import { IsBoolean } from "class-validator";

@Exclude()
export class PlayerBody {
	@Expose()
	@IsBoolean()
	public isWinner: boolean;
}
