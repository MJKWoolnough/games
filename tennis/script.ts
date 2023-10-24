import {amendNode, clearNode} from './lib/dom.js';
import ready from './lib/load.js';
import {circle, rect, svg} from './lib/svg.js';

ready.then(() => {
	const left = rect({"width": 5, "height": 20, "fill": "#f00"}),
	      right = rect({"x": 95, "width": 5, "height": 20, "fill": "#00f"}),
	      ball = circle({"r": 5, "fill": "#fff"}),
	      game = svg({"viewBox": "0 0 100 100"}, [
		      rect({"width": "100%", "height": "100%", "fill": "#000"}),
		      left,
		      right,
		      ball
	      ]);

	clearNode(document.body, game);
});
