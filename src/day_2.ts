import { readInput } from '../util.ts';

type Game = {
	id: number;
	records: GameRecord[];
};

type GameRecord = {
	blue: number;
	red: number;
	green: number;
};

const MAX_VALS: GameRecord = {
	blue: 14,
	green: 13,
	red: 12,
};

const input = (await readInput(2)).split('\n');

export function parseGame(str: string): Game {
	const s = str.split(':');
	if (s.length !== 2) throw new Error(`Invalid value? s: ${s}`);
	const game: Game = {
		id: Number(s[0].split(' ').at(-1)!),
		records: s[1].split(';').map((x) => x.trim()).map((x) =>
			parseRecord(x)
		),
	};
	return game;
}

export function parseRecord(str: string): GameRecord {
	const vals = str.trim().split(',').map((s) => s.trim()).map((s) =>
		s.split(' ')
	);
	const colors: GameRecord = {
		red: 0,
		blue: 0,
		green: 0,
	};
	vals.forEach((val) => {
		if (val.length !== 2) {
			throw new Error(`Invalid value? str: ${str}, val: ${val}`);
		}
		const v = Number(val[0]);
		if (isNaN(v)) {
			throw new Error(
				`Why NaN? v: ${val[0]} str: ${str}, val: ${val}`,
			);
		}
		const k = val[1] as keyof GameRecord;
		if (!(k in colors)) {
			throw new Error(`key: ${k} not valid color`);
		}
		colors[k] = v;
	});
	return colors;
}

export function isValidGame(game: Game): boolean {
	const records = game.records;
	for (const record of records) {
		for (const [k, v] of Object.entries(record)) {
			if (MAX_VALS[k as keyof GameRecord] < v) {
				return false;
			}
		}
	}
	return true;
}

function partOne(input: string[]) {
	return input
		.map(parseGame) // map lines to games
		.filter(isValidGame) // filter valid games
		.map((i) => i.id) // only take their ids
		.reduce((acc, curr) => acc + curr, 0); // add em
}

function powerOfGame(game: Game): number {
	let red = 0;
	let blue = 0;
	let green = 0;
	game.records.forEach((v) => {
		if (v.red > red) red = v.red;
		if (v.blue > blue) blue = v.blue;
		if (v.green > green) green = v.green;
	});
	return red * blue * green;
}

function partTwo(input: string[]) {
	return input
		.map(parseGame) // convert lines to Games
		.map(powerOfGame) // calculate power of each Game
		.reduce((acc, curr) => acc + curr, 0); // sum em
}

console.log(`Part 1: ${partOne(input)}`); // 2369
console.log(`Part 2: ${partTwo(input)}`); // 66363
