"use strict";

function Graph() {
}

Graph.prototype.draw = function () {
	var i = 0;
	var cityCoOrds = undefined;
	var fitnesses;

	if ( theTSP.routeShortest === -1 )
		return ;

	canvas2D.clear();
	chart.clear();

	/* debug */
	//console.log("draw(): " + theTSP.theFittest);

	cityCoOrds = theTSP.map.index2CoOrds(theTSP.population[theTSP.theFittest].cities);

	/* debug */
	//console.log("draw(): " + cityCoOrds.length);
	//console.log("draw(): " + cityCoOrds);

	for ( i = 0; i < cityCoOrds.length; i ++ ) {
		canvas2D.drawRect(cityCoOrds[i].x, cityCoOrds[i].y, 10, 10);
		canvas2D.drawText(i, cityCoOrds[i].x + 4, cityCoOrds[i].y - 2, '18px serif', 'black');
	}

	canvas2D.drawPath(cityCoOrds, true);

	fitnesses = theTSP.helperGetFitnesses(false, function (a, b) { return a - b });

	/* debug */
	//console.log(fitnesses);

	chart.drawAxis('fitness', 'number-of-genomes (total ' + theTSP.popSize + ')');
	chart.drawGaussian(fitnesses, 200, 3);
	chart.drawStats('generation: ' + theTSP.gen, 0);
	chart.drawStats('shortest: ' + theTSP.routeShortest, 1);
	chart.drawStats('target: ' + theTSP.map.bestPossibleRoute, 2);
	chart.drawStats('optimal: ' + theTSP.optimal, 3);
}

Graph.prototype.update = function () {
	theTSP.epoch();
}

Graph.prototype.loop = function () {
	graph.update()
	graph.draw();

	requestAnimationFrame(graph.loop);
}

Graph.prototype.start = function (canvas, chartName, width, height) {
	canvas2D.initialize(canvas);
	chart = new Chart(chartName);

	theTSP = new GaTSP(MUTATE_RATE, CROSSOVER_RATE, POP_SIZE, NUM_CITIES, width, height);

	requestAnimationFrame(graph.loop);
}

var graph = new Graph();
