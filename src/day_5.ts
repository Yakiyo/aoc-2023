/**
 * 1: 227653707
 * 2: N/A
 */

class Range {
	private source: number;
	private destination: number;
	private range: number;

	constructor(line: string) {
		const [destination, source, range] = line.split(/ +/).map(Number);
		this.destination = destination;
		this.source = source;
		this.range = range - 1;
	}

	public static parse(line: string) {
		return new Range(line);
	}

	/**
	 * If the provided number falls in this range
	 */
	private matches(value: number): boolean {
		return value >= this.source && value <= this.source + this.range;
	}

	/**
	 * Converts the source number to the destination number
	 */
	public map(source: number): number | null {
		if (!this.matches(source)) return null;
		return this.destination + (source - this.source);
	}
}

class AlmanacMap {
	private ranges: Range[];
	constructor(input: string) {
		// we ignore the first line since all the maps are provided in order
		this.ranges = input.split('\n').slice(1).map(Range.parse);
	}

	public static parse(input: string) {
		return new AlmanacMap(input);
	}

	public convert(source: number) {
		let destination: number | null = null;
		for (const range of this.ranges) {
			destination = range.map(source);
			// if destination finally got a value, we stop the loop
			if (destination !== null) break;
		}

		// just in case destination is still null,
		// source and destination will then be the same value
		if (destination === null) {
			destination = source;
		}
		return destination;
	}
}

function convert(source: number, maps: AlmanacMap[]): number {
	let n = source;
	for (const map of maps) {
		n = map.convert(n);
	}
	return n;
}

export function partOne(input: string) {
	const inputs = input.split('\n\n');
	const seeds = inputs[0].replace('seeds: ', '').split(/ +/).map(
		Number,
	);
	const maps = inputs.slice(1).map(AlmanacMap.parse);
	return Math.min(...seeds.map((n) => convert(n, maps)));
}

/**
 * This SHOULD theoritically work, but the `seeds` array exceeds
 * 1516 elements (much more but i quit at that point), and eventually
 * Deno throws the error `invalid array length`, so i assume this
 * solution is not feasible. I'm fairly certain some sort of smart
 * and funky solution exists that can do it, guess i gotta go youtubing for it.
 * Till then imma leave it incomplete.
 */
export function partTwo(_input: string) {
	// const inputs = input.split('\n\n');
	// const seedPairs = inputs[0].replace('seeds: ', '').split(/ +/).map(Number);
	// const seeds: number[] = [];
	// for (let i = 0; i <= seedPairs.length; i += 2) {
	//     const start = seedPairs[i];
	//     const range = seedPairs[i + 1] - 1;
	//     for (let j = 0; j <= range; j++) {
	//         console.log(seeds.length);
	//         seeds.push(start + j);
	//     }
	// }
	// const maps = inputs.slice(1).map(AlmanacMap.parse);
	// return Math.min(...seeds.map(n => convert(n, maps)));
	return 0;
}
