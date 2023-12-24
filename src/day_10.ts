/**
 * 1: 0
 * 2: 0
 */
type Plan = string[][];
type Coordinate = [number, number]; // [x, y]

function resolveStart(plan: Plan): Coordinate {
    for (let column = 0; column < plan.length; column++) {
        const element = plan.at(column)!;
        for (let row = 0; row < element.length; row++) {
            if (element[row] === 'S') {
                return [row, column];
            }
        }
    }
    throw 'Missing entry point';
}

export function partOne(input: string) {
	const plan = input
    .split('\n')
    .map((x) => x.split('')) as Plan;

    const _start = resolveStart(plan);
}
