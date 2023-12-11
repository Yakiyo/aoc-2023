import { isNum, readInput } from '../util.ts';

type Coordinate = [number, number];
type PartNumber = {
	value: string;
	position: Coordinate;
};

const input = (await readInput(3)).split('\n');

function partOne(input: string[]) {
	input;
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
    return surroundings.filter(i => !i.some(n => n < 0));
}

console.log(`Part 1: ${partOne(input)}`);
