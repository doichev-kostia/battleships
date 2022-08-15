import path from "path";

const root = path.join(__dirname, "../");
const src = path.join(root, "src");
const utils = path.join(src, "utils");

export const paths = {
	root,
	src,
	utils,
} as const;
