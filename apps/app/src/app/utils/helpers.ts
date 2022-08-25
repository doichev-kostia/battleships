export const getRandomInt = (min: number, max: number) => {
	min = Math.ceil(min);
	max = Math.floor(max);
	//The maximum is exclusive and the minimum is inclusive
	return Math.floor(Math.random() * (max - min)) + min;
};

export const saveBlob = (blob: Blob, filename: string) => {
	const anchor = document.createElement("a");
	anchor.href = URL.createObjectURL(blob);
	anchor.setAttribute("download", filename);
	anchor.click();
};
