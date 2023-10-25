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
	      paddles = [0, 95].map(x => rect({x, "width": paddleWidth, "height": paddleLength, "fill": !x ? "#f00" : "#00f"})),
	      ball = circle({"r": ballSize, "fill": "#fff"}),
	      game = svg({"viewBox": `0 0 ${gameSize} ${gameSize}`}, [
		      rect({"width": "100%", "height": "100%", "fill": "#000"}),
		      paddles,
		      ball
	      ]);

	let ys = [0, 0],
	    intervals = [-1, -1];

	[["w", "s"], ["ArrowUp", "ArrowDown"]].forEach(([up, down], n) => {
		const clearPaddleInterval = () => {
			clearInterval(intervals[n]);
			intervals[n] = -1;
		      },
		      setPaddleInterval = (fn: () => void) => () => {
			if (intervals[n] !== -1) {
				clearInterval(intervals[n]);
			}

			intervals[n] = setInterval(fn, 10);
		      };

		keyEvent(up, setPaddleInterval(() => {
			if (ys[n] > 0) {
				amendNode(paddles[n], {"y": --ys[n]});
			}
		}), clearPaddleInterval)[0]();

		keyEvent(down, setPaddleInterval(() => {
			if (ys[n] < gameSize - paddleLength) {
				amendNode(paddles[n], {"y": ++ys[n]});
			}
		}), clearPaddleInterval)[0]();
	});

	clearNode(document.body, game);
});
