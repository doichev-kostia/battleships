import { useMutation } from "react-query";
import { playerKeys } from "data/queryKeys";
import { updatePlayer } from "../../api/player";

export const useSaveWinner = () => {
	return useMutation(playerKeys.update, (playerId: string) =>
		updatePlayer(playerId, { isWinner: true }),
	);
};
