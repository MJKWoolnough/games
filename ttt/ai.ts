import brain from './brain.js';

type Board = number;

type Moves = [number[], number[], number[], number[]];

const b64 = [Array.from({"length": 26}, (_, n) => String.fromCharCode(65+n)), Array.from({"length": 26}, (_, n) => String.fromCharCode(97+n)), Array.from({"length": 10}, (_, n) => String.fromCharCode(48+n))].flat(),
      decode = (b: string) => (b64.indexOf(b.charAt(0)) << 18) | (b64.indexOf(b.charAt(1)) << 12) | (b64.indexOf(b.charAt(2)) << 6) | b64.indexOf(b.charAt(3)),
      boards = new Map<Board, Moves>();

export default (gameBoard: number[], turn = 1) => {
	let board = 0,
	    transformation = 0,
	    moves: Moves | undefined = undefined;

	for (let p = 0; p < 9; p++) {
		if (gameBoard[p]) {
			board |= (gameBoard[p] === turn ? 1 : 2) << (2 * p);
		}
	}

	for (; transformation < 8; transformation++) {
		if (transformation === 4) {
			for (let p = 0; p < 9; p++) {
				const oldBoard = board,
				      q = 3*((p/3) | 0) + 2 - (p % 3);
				board = 0;

				board |= ((oldBoard >> (p * 2)) & 3) << (q * 2);
			}
		}

		moves = boards.get(board);
		if (moves) {
			break;
		}

		const oldBoard = board;
		board = 0;

		for (let p = 0; p < 9; p++) {
			const q = 2 - ((p/3) | 0) + 3*(p%3);

			board |= ((oldBoard >> (p * 2)) & 3) << (q * 2);
		}
	}

	if (!moves) {
		throw new Error("impossible board");
	}
};

for (let i = 0; i < brain.length; i += 4) {
	const moves: Moves = [[], [], [], []];
	let b = decode(brain.slice(i, i+4)),
	    board = 0;

	for (let p = 0; p < 9; p++) {
		const r = b % 6;

		b /= 6

		if (r >= 4) {
			board |= (r - 4) << (2 * p);
		} else {
			moves[r].push(p);
		}
	}

	boards.set(board, moves);
}
