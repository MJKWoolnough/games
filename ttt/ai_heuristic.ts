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
	const moves: Moves = [[], [], [], [], [], []];

	for (const [n, p] of gameBoard.entries()) {
		if (p) {
			continue;
		}

		gameBoard[n] = turn;
		if (isWin(gameBoard)) {
			moves[5].push(n);
			gameBoard[n] = 0;

			continue;
		}

		gameBoard[n] = 3 - turn;
		if (isWin(gameBoard)) {
			moves[4].push(n);
			gameBoard[n] = 0;

			continue;
		}

		gameBoard[n] = turn;
		if (has2InARow(gameBoard)) {
			moves[2].push(n);
			gameBoard[n] = 0;

			continue;
		}

		moves[1 - (n % 1)].push(n);
		gameBoard[n] = 0;
	}

	return pickRandomAIMove(moves, gameBoard, level);
}
