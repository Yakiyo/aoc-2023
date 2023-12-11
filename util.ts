export function readInput(day: number): Promise<string> {
	return Deno.readTextFile(`./inputs/${day}.txt`);
}

export const isNum = (char: string): boolean =>
	char >= '0' && char <= '9';
