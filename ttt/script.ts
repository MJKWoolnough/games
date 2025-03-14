import {add, at, render} from './lib/css.js';
import {amendNode, clearNode, event, eventOnce} from './lib/dom.js';
import {br, button, div, h2, input, label, option, select} from './lib/html.js';
import ready from './lib/load.js';
import {circle, defs, g, line, path, rect, svg, text, use} from './lib/svg.js';
import heuristic from './ai_heuristic.js';
import memory from './ai_memory.js';
import {isWin} from './shared.js';

ready.then(() => {
	add("html,body", {
		"padding": 0,
		"margin": 0
	});
	add("body>div>div", {
		"display": "grid",
		"grid-template-columns": "repeat(2, 1fr)",
		"grid-column-gap": "0",
		"grid-row-gap": 0
	});
	add("input:not(:checked)+select", {
		"display": "none"
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
			"pointer-events": "none"
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
			}
		},

		" .W": {
			"stroke": "#f00",
			"stroke-width": 3,
			"display": "none"
		},

		" #S": {
			", text:not(:last-child)": {
				"display": "none"
			},

			".X,.O,.D": {
				"display": "unset"
			},

			".X text:nth-child(2),.O text:nth-child(3),.D text:nth-child(4)": {
				"display": "unset"
			},

			" rect:last-of-type:hover": {
				"cursor": "pointer",

				"+text": {
					"fill": "#f00",
					"stroke": "#f00"
				}
			}
		}
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

	let turn = 0,
	    aiRestart = -1;

	const start = (t: number) => {
		if (aiRestart !== -1) {
			clearTimeout(aiRestart);
		}

		for(const cell of cells) {
			amendNode(cell, {"class": ["!X", "!O"]});
		}

		for (const win of winLines) {
			amendNode(win, {"style": ""});
		}

		game.fill(0);
		amendNode(status, {"class": ""});
		setMark(board, turn = t);
		runAI();
	      },
	      setMark = (e: SVGElement, t: number) => amendNode(e, {"class": "C " + (t === 1 ? "X" : t === 2 ? "O" : "")}),
	      clicked = (n: number) => {
		if (game[n] || !turn) {
			return;
		}

		setMark(cells[n], game[n] = turn);

		const win = isWin(game),
		      draw = game.every(c => c);

		if (win >= 0 || draw) {
			const next = -turn + 3,
			      startNext = () => start(next);

			amendNode(winLines[win], {"style": "display: unset"});
			amendNode(status, {"class": win === -1 ? "D" : turn === 1 ? "X" : "O"});
			amendNode(restart, {"onclick": event(startNext, eventOnce)});

			turn = 3;

			if (playerIsAI[0] && playerIsAI[1]) {
				aiRestart = setTimeout(startNext, cpuRestartDelay);
			}
		}

		setMark(board, turn = -turn + 3);
		runAI();
	      },
	      cpuDelay = 250,
	      cpuRestartDelay = 1000,
	      ais = [heuristic, memory] as const,
	      runAI = () => {
		if (!playerIsAI[turn - 1]) {
			return;
		}

		const move = ais[turn - 1](game, turn, aiLevel[turn - 1]),
		      t = turn;

		setMark(board, turn = 0);

		setTimeout(() => {
			setMark(board, turn = t);
			clicked(move);
		}, cpuDelay);
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
		text({"y": 20}, "Restart")
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
	      ]),
	      playerIsAI = [false, false],
	      aiLevel = [5, 5];

	clearNode(document.body, div([
		div(Array.from({"length": 2}, (_, n) => div([
			h2(`Player ${n + 1}`),
			label({"for": `human_${n}`}, "Human"),
			input({"type": "radio", "name": `player_${n}`, "id": `human_${n}`, "checked": true, "onclick": () => playerIsAI[n] = false}),
			br(),
			label({"for": `ai_${n}`}, "CPU"),
			input({"type": "radio", "name": `player_${n}`, "id": `ai_${n}`, "onclick": () => playerIsAI[n] = true}),
			select({"onchange": function(this: HTMLSelectElement) {aiLevel[n] = parseInt(this.value)}}, Array.from({"length": 6}, (_, n) => option({"value": 5 - n}, (6 - n) + "")))
		]))),
		button({"onclick": () => {
			start(1);

			clearNode(document.body, board);
		}}, "Start!")
	]));
});
