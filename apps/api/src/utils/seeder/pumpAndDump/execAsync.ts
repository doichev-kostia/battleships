import { exec } from "child_process";

const rmrf = new RegExp(/rm -rf /);
export const execAsync = (command: string) => {
	if (rmrf.test(command)) {
		return new Promise((resolve, reject) => {
			reject(new Error("rm -rf is not allowed"));
		});
	}
	return new Promise((resolve, reject) => {
		exec(command, (error, stdout, stderr) => {
			if (error) {
				console.error(`exec error: ${error}`);
				reject(error.message);
				return;
			}
			if (stderr) {
				console.error(`stderr: ${stderr}`);
				reject(stderr);
				return;
			}
			resolve(stdout);
		});
	});
};
