import bind from './lib/bind.js';
import {add, render} from './lib/css.js';
import {amendNode, clearNode} from './lib/dom.js';
import {keyEvent} from './lib/events.js';
import ready from './lib/load.js';
import {circle, rect, svg, text} from './lib/svg.js';

ready.then(() => {
	add("html,body", {
		"padding": 0,
		"margin": 0,
		"background-color": "#000"
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
	      paddleOffset = 10,
	      gameHeight = 100,
	      gameWidth = gameHeight + 2 * paddleOffset,
	      ballSize = 3,
	      initialBallOffset = paddleOffset + 15,
	      paddles = [bind((gameHeight - paddleLength) >> 1), bind((gameHeight - paddleLength) >> 1)] as const,
	      ball = circle({"r": ballSize, "fill": "#fff"}),
	      scores = [bind(0), bind(0)] as const,
	      game = svg({"viewBox": `0 0 ${gameWidth} ${gameHeight}`}, [
		rect({"width": "100%", "height": "100%", "fill": "#000"}),
		[0, gameWidth - 10].map((x, n) => text({x, "fill": "#fff", "dominant-baseline": "hanging"}, scores[n])),
		[paddleOffset, gameWidth - paddleWidth - paddleOffset].map((x, n) => rect({x, "y": paddles[n], "width": paddleWidth, "height": paddleLength, "fill": !n ? "#f00" : "#00f"})),
		ball
	      ]),
	      initialBall = (side = (Math.random() * 2) | 0) => {
		amendNode(ball, {"cx": side * (gameWidth - 2 * initialBallOffset) + initialBallOffset, "cy": gameHeight >> 1});
	      };

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
			if (paddles[n].value > 0) {
				paddles[n].value--;
			}
		});

		setKeyEvent(down, () => {
			if (paddles[n].value < gameHeight - paddleLength) {
				paddles[n].value++;
			}
		});
	});

	clearNode(document.body, game);

	initialBall();
});
