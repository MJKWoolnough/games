import {add, at, render} from './lib/css.js';
import {amendNode, clearNode, event, eventOnce} from './lib/dom.js';
import ready from './lib/load.js';
import {circle, defs, g, line, path, rect, svg, text, use} from './lib/svg.js';

ready.then(() => {
	add("html,body", {
		"padding": 0,
		"margin": 0
	});
	add("svg", {
		"max-width": "100vw",
		"max-height": "100vh",

		" rect": {
			"stroke-width": 0
		},

		" use": {
			"display": "none"
		},

		" text": {
			"pointer-events": "none",
		},

		".X .C use:first-child,.O .C use:nth-child(2)": {
			"display": "unset"
		},

		".X,.O": {
			" .C rect": {
				"display": "unset",

				":hover": {
					"opacity": 0.5,
					"cursor": "crosshair"
				}
			}
		},

		" .C": {
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
			},
		},

		" .W": {
			"stroke": "#f00",
			"stroke-width": 3,
			"display": "none"
		},

		" #S": {
			", text:not(:last-child)": {
				"display": "none",
			},

			".X,.O,.D": {
				"display": "unset"
			},

			".X text:nth-child(2),.O text:nth-child(3),.D text:nth-child(4)": {
				"display": "unset"
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
			},

			" text": {
				"fill": "#000"
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
			},

			" text": {
				"fill": "#fff"
			}
		}
	});

	amendNode(document.head, render());

	let turn = 0;

	const start = (t: number) => {
		for(const cell of cells) {
			amendNode(cell, {"class": ["!X", "!O"]});
		}

		for (const win of winLines) {
			amendNode(win, {"style": ""});
		}

		game.fill(0);

		amendNode(status, {"class": ""});
		setMark(board, turn = t);
	      },
	      setMark = (e: SVGElement, t: number) => amendNode(e, {"class": "C " + (t === 1 ? "X" : t === 2 ? "O" : "")}),
	      clicked = (n: number) => {
		if (game[n] || !turn) {
			return;
		}

		setMark(cells[n], game[n] = turn);

		const win = isWin(),
		      draw = game.every(c => c);
		if (win >= 0 || draw) {
			const next = -turn + 3;

			amendNode(winLines[win], {"style": "display: unset"});
			amendNode(status, {"class": win === -1 ? "D" : turn === 1 ? "X" : "O"});
			amendNode(restart, {"onclick": event(() => start(next), eventOnce)});

			turn = 3;
		}

		setMark(board, turn = -turn + 3);
	      },
	      wins = [
		[0, 1, 2],
		[0, 3, 6],
		[3, 4, 5],
		[1, 4, 7],
		[6, 7, 8],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6]
	      ] as const,
	      isWin = () => {
		let win = 0;
		for (const [a, b, c] of wins) {
			if (game[a] && game[a] === game[b] && game[a] === game[c]) {
				return win;
			}

			win++;
		}

		return -1;
	      },
	      cells = Array.from({"length": 9}, (_, n) => g({"class": "C", "transform": `translate(${(n % 3) * 33} ${Math.floor(n / 3) * 33})`}, [
		use({"href": "#X"}),
		use({"href": "#O"}),
		rect({"width": 33, "height": 33, "onclick": () => clicked(n)})
	      ])),
	      winLines = Array.from({"length": 3}, (_, n) => [
		line({"class": "W", "x1": 0, "y1": 16 + n * 33, "x2": 99, "y2": 16 + n * 33}),
		line({"class": "W", "x1": 16 + n * 33, "y1": 0, "x2": 16 + n * 33, "y2": 99})
	      ]).concat([
		line({"class": "W", "x1": 16, "y1": 16, "x2": 83, "y2": 83}),
		line({"class": "W", "x1": 83, "y1": 16, "x2": 16, "y2": 83})
	      ]).flat(),
	      restart = rect({"x": -28, "y": 18, "width": 56, "height": 17, "style": {"fill": "#888", "border": "2px outset #000"}}),
	      status = g({"id": "S", "text-anchor": "middle", "dominant-baseline": "hanging", "transform": "translate(49,30)"}, [
		rect({"x": -28, "width": 56, "height": 20, "fill": "#f00"}),
		text("X wins!"),
		text("O wins!"),
		text("Draw!"),
		restart,
		text({"y": 20}, "Restart"),
	      ]),
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
		winLines,
		status
	      ]);

	start(1);

	clearNode(document.body, board);
});
