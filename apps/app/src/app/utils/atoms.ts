import { atom } from "jotai";
import { GridSize } from "app/constants/game-config";

export const gridSizeAtom = atom<GridSize>("standard");
