import brain from './brain.js';

type Board = number;

type Moves = [number[], number[], number[], number[], number[]];

const b64 = [Array.from({"length": 26}, (_, n) => String.fromCharCode(65+n)), Array.from({"length": 26}, (_, n) => String.fromCharCode(97+n)), Array.from({"length": 10}, (_, n) => String.fromCharCode(48+n)), ["+", "/"]].flat(),
      decode = (b: string) => (b64.indexOf(b.charAt(0)) << 18) | (b64.indexOf(b.charAt(1)) << 12) | (b64.indexOf(b.charAt(2)) << 6) | b64.indexOf(b.charAt(3)),
      boards = new Map<Board, Moves>(),
      flipPos = (p: number) => 3*((p/3) | 0) + 2 - (p % 3),
      rotatePos = (p: number) => 2 - ((p/3) | 0) + 3*(p%3),
      getPos = (board: number, p: number) => (board >> (p << 1)) & 3,
      setPos = (board: number, p: number, v: number) => board | (v << (p << 1)),
      positions = Array.from({"length": 9}, _ => 0),
      transformBoard = (pos: (p: number) => number, val: (p: number) => number) => positions.reduce((t, _, p) => setPos(t, pos(p), val(p)), 0);

export default (gameBoard: number[], turn: number, level: number) => {
	const filled = gameBoard.filter(c => c).length,
	      p1 = (turn - 1) !== (filled % 1) ? 2 : 1;

	if (filled === 9) {
		return -1;
	}

	let board = transformBoard(p => p, p => gameBoard[p] ? gameBoard[p] === p1 ? 1 : 2 : 0),
	    flip = 0,
	    rotation = 0,
	    moves: Moves | undefined = undefined;

	Loop:
	for (; flip < 2; flip++) {
		for (rotation = 0; rotation < 4; rotation++) {
			moves = boards.get(board);
			if (moves) {
				break Loop;
			}

			board = transformBoard(rotatePos, p => getPos(board, p));
		}

		board = transformBoard(flipPos, p => getPos(board, p));
	}

	if (!moves) {
		throw new Error("impossible board");
	}

	const myMoves: number[] = [];

	for (let l = 4; l >= 0; l--) {
		myMoves.splice(0, 0, ...moves[l]);

		if (l <= level && myMoves.length > 0) {
			break;
		}
	}

	let move = myMoves[Math.floor(Math.random() * myMoves.length)];

	for (;rotation < 4; rotation++) {
		move = rotatePos(move);
	}

	if (flip) {
		move = flipPos(move);
	}

	return move;
};

for (let i = 0; i < brain.length; i += 4) {
	const moves: Moves = [[], [], [], [], []];
	let b = decode(brain.slice(i, i+4)),
	    board = 0;

	for (let p = 0; p < 9; p++) {
		const r = b % 6;

		b = (b / 6) | 0;

		if (r >= 4) {
			board |= (r - 3) << (p << 1);
		} else {
			moves[r > 1 ? r + 1 : r == 1 ? 2 - (p & 1) : r].push(p);
		}
	}

	boards.set(board, moves);
}
