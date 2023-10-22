import brain from './brain.js';

type Board = number;

type Moves = [number[], number[], number[], number[]];

const b64 = [Array.from({"length": 26}, (_, n) => String.fromCharCode(65+n)), Array.from({"length": 26}, (_, n) => String.fromCharCode(97+n)), Array.from({"length": 10}, (_, n) => String.fromCharCode(48+n)), ["+", "/"]].flat(),
      decode = (b: string) => (b64.indexOf(b.charAt(3)) << 18) | (b64.indexOf(b.charAt(2)) << 12) | (b64.indexOf(b.charAt(1)) << 6) | b64.indexOf(b.charAt(0)),
      boards = new Map<Board, Moves>(),
      flipPos = (p: number) => 3*((p/3) | 0) + 2 - (p % 3),
      rotatePos = (p: number) => 2 - ((p/3) | 0) + 3*(p%3),
      getPos = (board: number, p: number) => (board >> (p << 1)) & 3,
      setPos = (board: number, p: number, v: number) => board | (v << (p << 1));

export default (gameBoard: number[], turn: number, level: number) => {
	let board = 0,
	    flip = 0,
	    rotation = 0,
	    moves: Moves | undefined = undefined;

	for (let p = 0; p < 9; p++) {
		if (gameBoard[p]) {
			board |= (gameBoard[p] === turn ? 1 : 2) << (2 * p);
		}
	}

	Loop:
	for (; flip < 2; flip) {
		for (rotation = 0; rotation < 4; rotation++) {
			moves = boards.get(board);
			if (moves) {
				break Loop;
			}

			const oldBoard = board;
			board = 0;

			for (let p = 0; p < 9; p++) {
				board = setPos(board, rotatePos(p), getPos(oldBoard, p));
			}
		}

		const oldBoard = board;
		board = 0;

		for (let p = 0; p < 9; p++) {
			board = setPos(board, flipPos(p), getPos(oldBoard, p));
		}
	}

	if (!moves) {
		throw new Error("impossible board");
	}

	const myMoves: number[] = [];

	for (let l = 3; l >= 0; l--) {
		myMoves.splice(0, 0, ...moves[l]);

		if (l <= level && myMoves.length > 0) {
			break;
		}
	}

	let move = myMoves[Math.floor(Math.random() * myMoves.length)];

	for (rotation = 0; rotation < 4; rotation++) {
		move = rotatePos(move);
	}

	if (flip) {
		move = flipPos(move);
	}

	return move;
};

for (let i = 0; i < brain.length; i += 4) {
	const moves: Moves = [[], [], [], []];
	let b = decode(brain.slice(i, i+4)),
	    board = 0;

	for (let p = 0; p < 9; p++) {
		const r = b % 6;

		b = (b / 6) | 0;

		if (r >= 4) {
			board |= (r - 4) << (2 * p);
		} else {
			moves[r].push(p);
		}
	}

	boards.set(board, moves);
}
