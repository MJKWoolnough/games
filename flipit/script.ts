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
	      start = (_level: number) => {

	      };

	start(1);

	clearNode(document.body, board);
});
