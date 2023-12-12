import { isNum, readInput } from '../util.ts';

type Coordinate = [number, number];
type PartNumber = {
	value: string;
	position: Coordinate;
};
type GearRatio = {
	position: Coordinate;
	adjacents: PartNumber[]; // the two adjacent part numbers
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

// This is kinda hacky. Theres prolly a better way to solve it.
// This gets all the valid part numbers, then for every part number, it
// gets their asterik surroundings. the asteriks are stored in a ratios array,
// with their adjacent values. if an asterik value of the same co-ordinate exists already
// we update it, else add a new entry to ratios.
function partTwo(input: string[]) {
	const partNumbers = input
		.map((line, column) => parseNumbers(line, column)) // get part numbers from each line
		.flat()
		.filter((i) => isValidPartNumber(i, input));
	const ratios: GearRatio[] = [];
	for (const partNumber of partNumbers) {
		const asteriks = getSurroundings(partNumber)
			.map(([x, y]) => ({
				char: (input.at(y) ?? '')[x],
				x,
				y,
			}))
			.filter((v) => v.char === '*');
		for (const asterik of asteriks) {
			const exists = ratios.findIndex((i) => {
				const [x, y] = i.position;
				return x === asterik.x && y === asterik.y;
			});
			// if one exists, push the value in it
			if (exists !== -1) {
				ratios[exists].adjacents.push(partNumber);
				continue;
			}
			// otherwise make a new one and add it
			ratios.push({
				position: [asterik.x, asterik.y],
				adjacents: [partNumber],
			});
		}
	}
	return ratios
		.filter((x) => x.adjacents.length === 2)
		.map((x) =>
			x.adjacents
				.map((v) => Number(v.value))
		)
		.map((i) => i.reduce((acc, curr) => acc * curr, 1))
		.reduce((acc, curr) => acc + curr, 0);
}

console.log(`Part 1: ${partOne(input)}`); // 533775
console.log(`Part 2: ${partTwo(input)}`); // 78236071
