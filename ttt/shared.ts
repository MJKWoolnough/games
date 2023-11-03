export type Moves = [number[], number[], number[], number[], number[], number[]];

export const wins = [
	[0, 1, 2],
	[0, 3, 6],
	[3, 4, 5],
	[1, 4, 7],
	[6, 7, 8],
	[2, 5, 8],
	[0, 4, 8],
	[2, 4, 6]
] as const,
isWin = (board: number[]) => {
	let win = 0;
	for (const [a, b, c] of wins) {
		if (board[a] && board[a] === board[b] && board[a] === board[c]) {
			return win;
		}

		win++;
	}

	return -1;
},
pickRandomAIMove = (moves: Moves, board: number[], level: number) => {
	const myMoves: number[] = [];

	for (let l = 5; l >= 0; l--) {
		myMoves.splice(0, 0, ...moves[l]);

		if (l <= level && myMoves.length > 0) {
			break;
		}
	}

	if (!myMoves.length) {
		myMoves.splice(0, 0, ...board.filter(c => !c));
	}

	return myMoves[Math.floor(Math.random() * myMoves.length)];
};
