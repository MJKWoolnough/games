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
		"display": "block",
		"margin": "0 auto"
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

	let ys = [0, 0];

	[["w", "s"], ["ArrowUp", "ArrowDown"]].forEach(([up, down], n) => {
		let interval = -1,
		    lastKey = "";

		const setKeyEvent = (key: string, modifyFn: () => void) => keyEvent(key, () => {
			if (interval !== -1) {
				clearInterval(interval);
			}

			interval = setInterval(modifyFn, 10);
			lastKey = key;
		      }, () => {
			if (key === lastKey) {
				clearInterval(interval);
				interval = -1;
			}
		      })[0]();

		setKeyEvent(up, () => {
			if (ys[n] > 0) {
				amendNode(paddles[n], {"y": --ys[n]});
			}
		});

		setKeyEvent(down, () => {
			if (ys[n] < gameSize - paddleLength) {
				amendNode(paddles[n], {"y": ++ys[n]});
			}
		});
	});

	clearNode(document.body, game);
});
