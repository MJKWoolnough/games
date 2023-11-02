const wins = [
	[0, 1, 2],
	[0, 3, 6],
	[3, 4, 5],
	[1, 4, 7],
	[6, 7, 8],
	[2, 5, 8],
	[0, 4, 8],
	[2, 4, 6]
      ] as const;

export const isWin = (board: number[]) => {
	let win = 0;
	for (const [a, b, c] of wins) {
		if (board[a] && board[a] === board[b] && board[a] === board[c]) {
			return win;
		}

		win++;
	}

	return -1;
};
