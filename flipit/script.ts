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
				"fill": "#fff",

				".S": {
					"fill": "#000"
				}
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
				"fill": "#222",

				".S": {
					"fill": "#fff"
				}
			},

			" text": {
				"fill": "#fff"
			}
		}
	});

	amendNode(document.head, render());

	let level = 0;

	const scale = 200,
	      board = svg({"viewBox": `0 0 ${scale} ${scale}`}),
	      game: boolean[] = [],
	      cells: SVGRectElement[] = [],
	      clicked = (n: number) => {
		const x = n % level,
		      y = Math.floor(n / level),
		      toChange = [n];

		if (x > 0) {
			toChange.push(n-1);
		}

		if (x < level - 1) {
			toChange.push(n+1);
		}

		if (y > 0) {
			toChange.push(n-level);
		}

		if (y < level - 1) {
			toChange.push(n+level);
		}

		for (const c of toChange) {
			amendNode(cells[c], {"class": {"S": game[c] = !game[c]}});
		}


		if (game.every(c => c)) {
			start(level+1);
		}
	      },
	      start = (l: number) => {
		level = l;

		const cellSize = scale / level;

		game.splice(0, game.length, ...Array.from({"length": level * level}, _ => false));
		cells.splice(0, cells.length, ...Array.from({"length": level * level}, (_, n) => rect({"x": (n % level) * cellSize + 1, "y": Math.floor(n / level) * cellSize + 1, "width": cellSize - 2, "height": cellSize - 2, "onclick": () => clicked(n)})));

		clearNode(board, cells);
	      };

	start(1);

	clearNode(document.body, board);
});
