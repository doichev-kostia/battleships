export type DeepPartial<T> = {
	[P in keyof T]?: DeepPartial<T[P]>;
};

type a = DeepPartial<{
	a: {
		b: {
			c: number;
		};
	};
}>;
