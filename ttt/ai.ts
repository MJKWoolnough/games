import {brain} from './brain.js';

type Board = number;

type Moves = number;

const b64 = [Array.from({"length": 26}, (_, n) => String.fromCharCode(65+n)), Array.from({"length": 26}, (_, n) => String.fromCharCode(97+n)), Array.from({"length": 10}, (_, n) => String.fromCharCode(48+n))].flat(),
      decode = (b: string) => (b64.indexOf(b.charAt(0)) << 18) | (b64.indexOf(b.charAt(1)) << 12) | (b64.indexOf(b.charAt(2)) << 6) | b64.indexOf(b.charAt(3)),
      boards = new Map<Board, Moves>();

for (let i = 0; i < brain.length; i += 4) {
	let b = decode(brain.slice(i, i+4)),
	    board = 0,
	    moves = 0;

	for (let p = 0; p < 9; p++) {
		const r = b % 6;

		b /= 6
		board *= 3
		moves *= 4

		if (r < 2) {
			board |= r;
		} else {
			moves |= r - 2;
		}
	}

	boards.set(board, moves);
}
