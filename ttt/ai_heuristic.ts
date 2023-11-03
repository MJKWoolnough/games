import type {Moves} from './shared.js';
import {isWin, pickRandomAIMove, wins} from './shared.js';

const has2InARow = (board: number[]) => {
	for (const [a, b, c] of wins) {
		const counts = [0, 0, 0];

		counts[board[a]]++;
		counts[board[b]]++;
		counts[board[c]]++;

		if (counts[0] && (counts[1] === 2 || counts[2] === 2)) {
			return true;
		}
	}

	return false;
 };

export default (gameBoard: number[], turn: number, level: number) => {
	const moves: Moves = [[], [], [], [], [], []],
	      emptyCount = gameBoard.reduce((n, p) => n += +!p, 0);

	for (const [n, p] of gameBoard.entries()) {
		if (p) {
			continue;
		}

		gameBoard[n] = turn;
		if (isWin(gameBoard) !== -1) {
			moves[5].push(n);
			gameBoard[n] = 0;

			continue;
		}

		gameBoard[n] = 3 - turn;
		if (isWin(gameBoard) !== -1) {
			moves[4].push(n);
			gameBoard[n] = 0;

			continue;
		}

		gameBoard[n] = 0;
		if (emptyCount === 7 && gameBoard[4] === turn && gameBoard[1] + gameBoard[3] + gameBoard[5] + gameBoard[7] === 3 - turn && n & 1) {
			moves[3].push(n);

			continue;
		}

		gameBoard[n] = turn;
		if (has2InARow(gameBoard)) {
			moves[2].push(n);
			gameBoard[n] = 0;

			continue;
		}

		moves[1 - (n & 1)].push(n);
		gameBoard[n] = 0;
	}

	return pickRandomAIMove(moves, gameBoard, level);
}
