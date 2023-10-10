import {add, at, render} from './lib/css.js';
import {amendNode, clearNode} from './lib/dom.js';
import ready from './lib/load.js';
import {circle, defs, g, line, path, rect, svg, use} from './lib/svg.js';

ready.then(() => {
	add({
		"svg": {
			"max-width": "100vw",
			"max-height": "100vh",

			" rect": {
				"stroke-width": 0
			},

			" use": {
				"display": "none"
			},

			".X g use:first-child,.O g use:nth-child(2)": {
				"display": "unset"
			},

			".X,.O": {
				" g rect": {
					"display": "unset",

					":hover": {
						"opacity": 0.5,
						"cursor": "crosshair"
					}
				}
			},

			" g": {
				" rect": {
					"display": "none"
				},
				".X use": {
					":first-child": {
						"display": "unset"
					},
					":nth-child(2)": {
						"display": "none"
					}
				},
				".O use": {
					":first-child": {
						"display": "none"
					},
					":nth-child(2)": {
						"display": "unset"
					}
				},
				".X,.O": {
					" rect": {
						"display": "none"
					}
				}
			},

			" .W": {
				"stroke": "#f00",
				"stroke-width": 3,
				"display": "none"
			}
		}
	});
	at("@media (prefers-color-scheme: light)", {
		"html, body": {
			"background-color": "#fff",
		},

		"svg": {
			"stroke": "#000",

			" rect": {
				"fill": "#fff"
			}
		}
	});
	at("@media (prefers-color-scheme: dark)", {
		"html, body": {
			"background-color": "#222",
		},

		"svg": {
			"stroke": "#fff",

			" rect": {
				"fill": "#222"
			}
		}
	});

	amendNode(document.head, render());

	let turn = 0;

	const start = (t: number) => {
		for(const cell of cells) {
			amendNode(cell, {"class": ""});
		}

		game.fill(0);

		setMark(board, turn = t);
	      },
	      setMark = (e: SVGElement, t: number) => amendNode(e, {"class": t === 1 ? "X" : t === 2 ? "O" : ""}),
	      clicked = (n: number) => {
		if (game[n] || !turn) {
			return;
		}

		setMark(cells[n], game[n] = turn);

		setMark(board, turn = -turn + 3);
	      },
	      cells = Array.from({"length": 9}, (_, n) => g({"transform": `translate(${(n % 3) * 33} ${Math.floor(n / 3) * 33})`}, [
		use({"href": "#X"}),
		use({"href": "#O"}),
		rect({"width": 33, "height": 33, "onclick": () => clicked(n)})
	      ])),
	      wins = Array.from({"length": 3}, (_, n) => [
		line({"class": "W", "x1": 0, "y1": 16 + n * 33, "x2": 99, "y2": 16 + n * 33}),
		line({"class": "W", "x1": 16 + n * 33, "y1": 0, "x2": 16 + n * 33, "y2": 99})
	      ]).concat([
		line({"class": "W", "x1": 16, "y1": 16, "x2": 83, "y2": 83}),
		line({"class": "W", "x1": 83, "y1": 16, "x2": 16, "y2": 83})
	      ]).flat(),
	      game = Array.from({"length": 9}, () => 0),
	      board = svg({"viewBox": "0 0 99 99"}, [
		defs([
			path({"id": "X", "d": "m5,5 l23,23 m0,-23 l-23,23", "stroke-width": 2}),
			circle({"id": "O", "cx": 16, "cy": 16, "r": 13, "stroke-width": 2, "fill": "none"})
		]),
		cells,
		line({"x1": 33, "x2": 33, "y2": 99}),
		line({"x1": 66, "x2": 66, "y2": 99}),
		line({"y1": 33, "x2": 99, "y2": 33}),
		line({"y1": 66, "x2": 99, "y2": 66}),
		wins
	      ]);

	start(1);

	clearNode(document.body, board);
});
