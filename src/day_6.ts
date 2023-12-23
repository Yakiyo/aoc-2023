/**
 * 1: 2756160
 * 2: 34788142
 */

/**
 * Calculate number of ways to do a race and return
 * the number of races that exceed record time
 */
function calcWins(time: number, record: number) {
	let wins = 0;
	for (let held = 0; held <= time; held++) {
		const distance = held * (time - held);
		if (distance > record) wins++;
	}
	return wins;
}

export function partOne(input: string) {
	const [times, distances] = input
		.split('\n')
		.map((x) => x.split(':')[1].trim())
		.map((x) => x.split(/ +/).map(Number));

	const vals = [];
	for (let i = 0; i < times.length; i++) {
		vals.push(calcWins(times[i], distances[i]));
	}

	return vals.reduce((acc, curr) => acc * curr, 1);
}

export function partTwo(input: string) {
	const [time, distance] = input
		.split('\n')
		.map((x) => x.split(':')[1].trim())
		.map((x) => x.split(/ +/).reduce((acc, curr) => acc + curr, ''))
		.map(Number);
	return calcWins(time, distance);
}
