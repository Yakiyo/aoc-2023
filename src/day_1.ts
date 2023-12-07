const isNum = (char: string): boolean => char >= '0' && char <= '9';

function calibrate(input: string[]): number {
    return input.map((s) => {
		const c = s.split('');
		return Number(`${c.find(isNum)}${c.findLast(isNum)}`);
	})
	.reduce((acc, curr) => acc + curr, 0)
}

const input = (await Deno.readTextFile('./inputs/1.txt'))
	.split(
		'\n',
	);

const part1 = calibrate(input);

console.log('part 1: ', part1);

const reps = new Map(Object.entries({
	'one': '1',
	'two': '2',
	'three': '3',
	'four': '4',
	'five': '5',
	'six': '6',
	'seven': '7',
	'eight': '8',
	'nine': '9,',
}));

const newInput = input.map(s => {
    for (const [k, v] of reps) {
        s = s.replaceAll(k, `${v}${k}`);
    }
    return s;
})

const part2 = calibrate(newInput);

console.log("part 2: ", part2);