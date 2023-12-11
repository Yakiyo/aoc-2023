import { isNum, readInput } from '../util.ts';

const input = (await readInput(1))
	.split(
		'\n',
	);

function partOne(input: string[]): number {
	return input.map((s) => {
		const c = s.split('').filter(isNum);
		return Number(`${c.at(0)}${c.at(-1)}`);
	})
		.reduce((acc, curr) => acc + curr, 0);
}

const reps = new Map(Object.entries({
	'one': '1',
	'two': '2',
	'three': '3',
	'four': '4',
	'five': '5',
	'six': '6',
	'seven': '7',
	'eight': '8',
	'nine': '9',
}));

export function parse(str: string): string[] {
	const nums: string[] = [];
	for (let i = 0; i <= str.length; i++) {
		// if first char is a num, push it and continue with loop
		if (isNum(str[i])) {
			nums.push(str[i]);
			continue;
		}
		// otherwise get the slice from current index,
		// and if it starts with a valid number-text,
		// push it and exit inner loop
		const slice = str.slice(i);
		for (const [k, v] of reps) {
			if (slice.startsWith(k)) {
				nums.push(v);
				break;
			}
		}
	}
	if (nums.length < 1) throw `got at ${str}`;
	return nums;
}

function partTwo(input: string[]) {
	return input.map((s) => {
		const nums = parse(s);
		return Number(`${nums.at(0)}${nums.at(-1)}`);
	}).reduce((acc, curr) => acc + curr, 0);
}

console.log(`Part 1: ${partOne(input)}`); // 54644

console.log(`Part 2: ${partTwo(input)}`); // 53348
