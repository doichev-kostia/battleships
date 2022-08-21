export type Entries<T> = {
	[K in keyof T]: [K, T[K]];
}[keyof T][];

export type Coordinates = {
	x: number;
	y: number;
};
