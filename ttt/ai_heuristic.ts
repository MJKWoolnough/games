import {isWin, pickRandomAIMove} from './shared.js';

export default (gameBoard: number[], turn: number, level: number) => {
	const moves: [number[], number[], number[], number[], number[], number[]] = [[], [], [], [], [], []];

	for (const [p, n] of gameBoard.entries()) {
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

		moves[0].push(n);
	}

	return pickRandomAIMove(moves, gameBoard, level);
}
