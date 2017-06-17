"use strict";

/* hyper parameters! */
var NUM_ELITES = 4;	// elitism is crucial !
var ELITISM_MODE_ONLY_BEST = true;
var MUTATE_RATE = 0.1;
var CROSSOVER_RATE = 0.75;
var POP_SIZE = 200;
var NUM_CITIES = 50;

/* when generation reached this number, GA is considered failed */
var MAX_GEN = NUM_CITIES * 100;

/* the main object of this program */
var theTSP = undefined;


function Genome(numCities) {
	if ( typeof numCities !== 'undefined' )
		this.cities = this.grabPermutation(numCities);
	else
		this.cities = undefined;
	this.fitness = 0;
}

Genome.prototype.grabPermutation = function (limit) {
	return Math.permute(Math.range(limit));
}

Genome.prototype.toString = function () {
	return this.cities.toString() + ", fitness: " + this.fitness + "\n";
}

function GaTSP(mutateRate, crossRate, popSize, numCities, mapWidth, mapHeight) {
	this.population = new Array();
	this.mutateRate = mutateRate;
	this.crossRate = crossRate;
	this.popSize = popSize;
	this.chromoLength = numCities;

	/* current generation of population */
	this.gen = 0;

	/* fitness */
	this.totalFitness = 0;
	this.routeShortest = -1;
	this.routeLongest = 0;
	this.theFittest = -1;
	this.optimal = false;

	this.map = new MapTSP(mapWidth, mapHeight, numCities);
	this.createStartingPopulation();
	this.calcPopFitness();
}

GaTSP.prototype.toString = function () {
	console.log('theFittest: ' + this.theFittest);
	for ( var i = 0; i < this.popSize; i ++ ) {
		console.log(this.population[i]);
	}
}

/* 创建初始种群 */
GaTSP.prototype.createStartingPopulation = function () {
	this.population.splice(0);
	for ( var i = 0; i < this.popSize; i ++ ) {
		this.population.push(new Genome(this.chromoLength));
	}

	this.gen = 1; // this is first generation

	this.resetPopFitness();
}

GaTSP.prototype.initialize = function () {
	this.createStartingPopulation();
	this.calcPopFitness();
}

/* 计算种群fitness得分 */
GaTSP.prototype.calcPopFitness = function () {
	var dist = 0;
	var i = 0;
	var a = 0;

	this.resetPopFitness();
	for ( i = 0; i < this.popSize; i ++ ) {
		dist = Alg.circularRouteDistance(this.map.index2CoOrds(this.population[i].cities));
		dist = Math.float6(dist);

		this.population[i].fitness = dist;

		// record the shortest route
		if ( this.routeShortest === -1 || dist < this.routeShortest ) {
			this.routeShortest = dist;
			this.theFittest = i;
		}

		if ( dist > this.routeLongest )
			this.routeLongest = dist;
	}

	for ( i = 0; i < this.popSize; i ++ ) {
		a = this.population[i].fitness;
		this.population[i].fitness = Math.floatSub(this.routeLongest, a);
	}

	var total = 0;
	for ( i = 0; i < this.popSize; i ++ ) {
		total = Math.floatAdd(this.population[i].fitness, total);
		this.totalFitness = Math.floatAdd(this.population[i].fitness, this.totalFitness);
	}

	/* debug */
	//console.log('++ totalFitness: ' + this.totalFitness + ' ++');
	//console.log('++ total: ' + total + ' ++');

	/* the genes is optimal */
	if ( this.routeShortest <= this.map.bestPossibleRoute ) {
		this.optimal = true;
	}
}

GaTSP.prototype.resetPopFitness = function () {
	this.routeShortest = -1;
	this.routeLongest = 0;
	this.totalFitness = 0;
	this.theFittest = -1;
	this.optimal = false;
}


GaTSP.prototype.selectRouletteWheel = function () {
	var pointer = Math.random() * this.totalFitness;
	var sum = 0;
	var i = 0;

	if ( this.population.length === 0 ) {
		console.log('selectRouletteWheel(): population is empty!');
		return undefined;
	}

	for ( i = 0; i < this.popSize; i ++ ) {
		sum = Math.floatAdd(sum, this.population[i].fitness);
		if ( sum > pointer )
			break;
	}

	if ( i >= this.popSize ) {
		console.log('selectRouletteWheel(): internal error! popsize: ' + this.popSize + ', i: ' + i);
		console.log('pointer: ' + pointer + ', sum: ' + sum + ', population length: ' + this.population.length);
		console.log('total fitness: ' + this.totalFitness);

		return undefined;
	}

	return this.population[i];
}

GaTSP.prototype.mutateEM = function (chromo) {
	if ( Math.random() > this.mutateRate )
		return ;

	Alg.mutateEM(chromo);
}

/* Partially Matched Crossover */
GaTSP.prototype.crossoverPMX = function (mum, dad) {
	/* all parameters must be Array */
	if ( mum.constructor !== Array || dad.constructor !== Array )
		return ;

	if ( Math.random() > this.crossRate || mum.toString() === dad.toString() )
		return new Array(mum, dad);

	/* breed two children */
	return Alg.crossoverPMX(mum, dad);
}


GaTSP.prototype.epoch = function () {
	var i = 0;
	var newPop = new Array();
	var mum, dad;
	var baby1, baby2;
	var result;

	/* genes are already optimal */
	if (this.optimal)
		return true;


	// Elitism
	if (ELITISM_MODE_ONLY_BEST) {
		for ( i = 0; i < NUM_ELITES; i ++ )
			newPop.push(this.population[this.theFittest]);
	}
	else {
		var best = this.bestGenomeN(NUM_ELITES);
		for ( i = 0; i < NUM_ELITES; i ++ )
			newPop.push(this.population[best[i].x]);
	}

	while ( newPop.length < this.popSize ) {
		mum = this.selectRouletteWheel();
		dad = this.selectRouletteWheel();

		/* create 2 children */
		baby1 = new Genome();
		baby2 = new Genome();

		/* breed them */
		result = this.crossoverPMX(mum.cities, dad.cities);
		baby1.cities = result[0];
		baby2.cities = result[1];
		
		/* mutate them */
		this.mutateEM(baby1.cities);
		this.mutateEM(baby2.cities);

		/* add to new population */
		newPop.push(baby1, baby2);
	}

	this.population = newPop;
	this.gen ++;

	this.calcPopFitness();

	/* debug */
	//console.log('** generation: ' + this.gen);
	//console.log('shortest/target: ' + this.routeShortest + '/' + this.map.bestPossibleRoute);

	return this.optimal;
}

/* return fitness array of current generation */
GaTSP.prototype.helperGetFitnesses = function (alsoIndex, sortFunc) {
	if ( typeof alsoIndex === 'undefined' )
		alsoIndex = false;

	function mapFunc(value, index) {
		if (alsoIndex)
			return new Vector2(index, value.fitness);
		else
			return value.fitness;
	}

	var arr = this.population.map(mapFunc);

	if ( typeof sortFunc !== 'undefined' )
		arr.sort(sortFunc);

	return arr;
}

GaTSP.prototype.bestGenomeN = function (n) {
	if ( typeof n === 'undefined' )
		n = 1;

	var arr = this.helperGetFitnesses(true, function (a, b) { return b.y - a.y });
	return arr.slice(0, n);
}



var testGA = {};
testGA.tsp = undefined;
testGA.score = function(n, func) {
	var score = 0;
	var min = 999999;
	var max = 0;
	var failed = false;
	var failCount = 0;
	var i = 0;

	if ( typeof n === 'undefined' )
		n = 1;

	this.tsp = new GaTSP(MUTATE_RATE, CROSSOVER_RATE, POP_SIZE, NUM_CITIES, 640, 480);
	if ( typeof func !== 'undefined' )
		func(this.tsp);


	while ( i++ < n ) {
		while (!this.tsp.epoch()) {
			if ( this.tsp.gen >= MAX_GEN ) {
				failCount ++;
				failed = true;
				break ;
			}
		}

		if ( this.tsp.gen < min )
			min = this.tsp.gen;
		if ( this.tsp.gen > max )
			max = this.tsp.gen;

		if (failed) {
			failed = false;
			console.log('test ' + i + ' >>> failed !');
		}
		else {
			console.log('test ' + i + ' >>> score: ' + this.tsp.gen);
			score += this.tsp.gen;
		}

		this.tsp.initialize();
	}

	n -= failCount;
	if ( n === 0 ) {
		console.log('!!! all tests failed !!!');
		return -1;
	}

	console.log('avg score(' + score + '/' + n + '): ' + score/n);
	console.log('min ~ max: ' + min + ' ~ ' + max);
	if ( failCount > 0 )
		console.log('!! failed tests: ' + failCount);

	return score / n;
}


/* debug */
function checkTSP(num) {
	var tsp = new GaTSP(MUTATE_RATE, CROSSOVER_RATE, POP_SIZE, NUM_CITIES, 640, 480);
	var i = 0;
	var result = false;

	while ( i++ < num && result === false ) {
		result = tsp.epoch();
	}

	console.log('result: ' + result);
	console.log('shortest route: ' + tsp.routeShortest);
}


function checkPMX(arr) {
	if ( arr.length === 0 )
		return false;

	var i = 0;
	var pos = 0;
	for ( i = 0; i < arr.length; i ++ ) {
		pos = arr.indexOf(i);
		if ( pos === -1 )
			return false;
	}

	return true;
}

function checkCrossover(length) {
	var mum;
	var dad;
	var children;
	var i = 0;

	while ( i++ < 100 ) {
		mum = Math.permute(Math.range(length));
		dad = Math.permute(Math.range(length));
		children = Alg.crossoverPMX(mum, dad);

		if ( checkPMX(children[0]) === false || checkPMX(children[1]) === false ) {
			console.log(mum.toString());
			console.log(dad.toString());
			console.log(children[0].toString());
			console.log(children[1].toString());
		}
	}
}

function checkFitness(tsp) {
	var i = 0;
	var total = 0;

	for ( i = 0; i < tsp.popSize; i ++ ) {
		total = Math.floatAdd(total, tsp.population[i].fitness);
	}

	if ( total !== tsp.totalFitness ) {
		console.log('TSP fitness error! totalFitness: ' + tsp.totalFitness + ', total: ' + total);
	}
}

