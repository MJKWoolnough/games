import {add, at, render} from './lib/css.js';
import {amendNode, clearNode} from './lib/dom.js';
import ready from './lib/load.js';
import {rect, svg} from './lib/svg.js';

ready.then(() => {
	add("html,body", {
		"padding": 0,
		"margin": 0
	});
	add("svg", {
		"max-width": "100vw",
		"max-height": "100vh",
	});
	at("@media (prefers-color-scheme: light)", {
		"html, body": {
			"background-color": "#fff"
		},

		"svg": {
			"stroke": "#000",

			" rect": {
				"fill": "#fff"
			},

			" text": {
				"fill": "#000"
			}
		}
	});
	at("@media (prefers-color-scheme: dark)", {
		"html, body": {
			"background-color": "#222"
		},

		"svg": {
			"stroke": "#fff",

			" rect": {
				"fill": "#222"
			},

			" text": {
				"fill": "#fff"
			}
		}
	});

	amendNode(document.head, render());

	const board = svg({"viewBox": "0 0 100 100"}),
	      game: boolean[] = [],
	      cells: SVGRectElement[] = [],
	      start = (level: number) => {
		const cellSize = 100 / level;

		game.splice(0, game.length, ...Array.from({"length": level * level}, _ => false));
		cells.splice(0, cells.length, ...Array.from({"length": level * level}, (_, n) => rect({"x": (n % level) * cellSize + 1, "y": Math.floor(n / level) * cellSize + 1, "width": cellSize - 2, "height": cellSize - 2})));

		clearNode(board, cells);
	      };

	start(1);

	clearNode(document.body, board);
});
