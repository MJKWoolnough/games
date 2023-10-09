import {add, render} from './lib/css.js';
import {amendNode, clearNode} from './lib/dom.js';
import ready from './lib/load.js';
import {circle, defs, g, line, path, rect, svg, use} from './lib/svg.js';

ready.then(() => {
	add({
		"svg": {
			"max-width": "100vw",
			"max-height": "100vh"
		}
	});

	amendNode(document.head, render());

	const clicked = (_: number) => {},
	      cells = Array.from({"length": 9}, (_, n) => g({"transform": `translate(${(n % 3) * 33} ${Math.floor(n / 3) * 33})`}, [
		use({"href": "#X"}),
		use({"href": "#O"}),
		rect({"onclick": () => clicked(n)})
	      ])),
	      board = svg({"viewBox": "0 0 99 99", "stroke": "#000"}, [
		defs([
			path({"id": "X", "d": "m5,5 l23,23 m0,-23 l-23,23", "stroke-width": 2}),
			circle({"id": "O", "cx": 49, "cy": 16, "r": 13, "stroke-width": 2, "fill": "none"})
		]),
		cells,
		line({"x1": 33, "x2": 33, "y2": 99}),
		line({"x1": 66, "x2": 66, "y2": 99}),
		line({"y1": 33, "x2": 99, "y2": 33}),
		line({"y1": 66, "x2": 99, "y2": 66})
	      ]);

	clearNode(document.body, board);
});
