import {add, render} from './lib/css.js';
import {amendNode, clearNode} from './lib/dom.js';
import {keyEvent} from './lib/events.js';
import ready from './lib/load.js';
import {circle, rect, svg} from './lib/svg.js';

ready.then(() => {
	add("html,body", {
		"padding": 0,
		"margin": 0
	});
	add("svg", {
		"max-width": "100vw",
		"max-height": "100vh",
	});

	amendNode(document.head, render());

	const paddleWidth = 5,
	      paddleLength = 20,
	      gameSize = 100,
	      ballSize = 3,
	      paddles = [0, 95].map(x => rect({x, "width": paddleWidth, "height": paddleLength, "fill": "#f00"})),
	      ball = circle({"r": ballSize, "fill": "#fff"}),
	      game = svg({"viewBox": `0 0 ${gameSize} ${gameSize}`}, [
		      rect({"width": "100%", "height": "100%", "fill": "#000"}),
		      paddles,
		      ball
	      ]);

	let leftY = 0,
	    leftInterval = -1,
	    rightY = 0,
	    rightInterval = -1;

	keyEvent("w", () => {
		if (leftInterval === -1) {
			leftInterval = setInterval(() => {
				if (leftY > 0) {
					leftY--;

					amendNode(paddles[0], {"y": leftY});
				}
			}, 10)
		}
	}, () => {
		clearInterval(leftInterval);
		leftInterval = -1;
	})[0]();

	keyEvent("s", () => {
		if (leftInterval === -1) {
			leftInterval = setInterval(() => {
				if (leftY < gameSize - paddleLength) {
					leftY++;

					amendNode(paddles[0], {"y": leftY});
				}
			}, 10)
		}
	}, () => {
		clearInterval(leftInterval);
		leftInterval = -1;
	})[0]();

	keyEvent("ArrowUp", () => {
		if (rightInterval === -1) {
			rightInterval = setInterval(() => {
				if (rightY > 0) {
					rightY--;

					amendNode(paddles[1], {"y": rightY});
				}
			}, 10)
		}
	}, () => {
		clearInterval(rightInterval);
		rightInterval = -1;
	})[0]();

	keyEvent("ArrowDown", () => {
		if (rightInterval === -1) {
			rightInterval = setInterval(() => {
				if (rightY < gameSize - paddleLength) {
					rightY++;

					amendNode(paddles[1], {"y": rightY});
				}
			}, 10)
		}
	}, () => {
		clearInterval(rightInterval);
		rightInterval = -1;
	})[0]();

	clearNode(document.body, game);
});
