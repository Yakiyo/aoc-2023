import { isNum, readInput } from '../util.ts';

type Coordinate = [number, number];
type PartNumber = {
	value: string;
	position: Coordinate;
};

const input = (await readInput(3)).split('\n');

function partOne(input: string[]) {
	return input
		.map((line, column) => parseNumbers(line, column)) // get part numbers from each line
		.flat()
		.filter((i) => isValidPartNumber(i, input))
		.map((i) => Number(i.value))
		.reduce((acc, curr) => acc + curr, 0);
}

export function parseNumbers(line: string, y: number): PartNumber[] {
	const nums: PartNumber[] = [];
	for (let i = 0; i <= line.length; i++) {
		if (isNum(line[i])) {
			const x = i;
			let num = '';
			while (isNum(line[i])) {
				num += line[i];
				i++;
			}
			nums.push({
				value: num,
				position: [x, y],
			});
		}
	}
	return nums;
}

export function getSurroundings(num: PartNumber) {
	const [x, y] = num.position;
	const span = num.value.length;
	const surroundings: Coordinate[] = [
		[x - 1, y - 1],
		[x - 1, y],
		[x - 1, y + 1],
		[x + span, y - 1],
		[x + span, y],
		[x + span, y + 1],
	];
	for (let i = 0; i < span; i++) {
		surroundings.push([x + i, y + 1], [x + i, y - 1]);
	}
	// filter out any value that has negative index, those aren't valid
	return surroundings.filter((i) => !i.some((n) => n < 0));
}

function isValidPartNumber(
	num: PartNumber,
	input: string[],
): boolean {
	const surroundings = getSurroundings(num);
	for (const [x, y] of surroundings) {
		const char = (input.at(y) ?? '')[x];
		// if any of the surrounding characters is non-null and not a period,
		// then that number is a valid part number
		if (char && char !== '.') return true;
	}
	return false;
}

console.log(`Part 1: ${partOne(input)}`); // 533775
