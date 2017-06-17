"use strict";

/* GA Ïà¹ØËã·¨ */
var Alg = {};
Alg.circularRouteDistance = function(vecRoute) {
	function vecDistCallback(total, currentValue, index, arr) {
		var nextIndex = index + 1;
		var nextValue;

		nextIndex = ( nextIndex >= arr.length ) ? 0 : nextIndex;
		nextValue = arr[nextIndex];

		/* debug-only */
		//console.log("total: " + total + ", currentValue: " + currentValue + ", index: " + index);
		//console.log("nextIndex: " + nextIndex + ", nextValue: " + nextValue);
		/* end here */

		return total + currentValue.distTo(nextValue);
	}

	return vecRoute.reduce(vecDistCallback, 0);
}

Alg.mutateEM = function(chromo) {
	var pos1, pos2;

	pos1 = Math.randInt(chromo.length);
	pos2 = pos1;

	while ( pos1 === pos2 )
		pos2 = Math.randInt(chromo.length);

	Utils.swapByIndex(chromo, pos1, chromo, pos2);
}

Alg.crossoverPMX = function(mum, dad, minSpan) {
	var span = Math.randSpan(0, mum.length, minSpan);
	var gene1, gene2;
	var i = 0;
	var baby1 = [].concat(mum);
	var baby2 = [].concat(dad);
	var pos = 0;

	//console.log('span: ' + span[0] + ', ' + span[1]);
	for ( i = span[0]; i <= span[1]; i ++ ) {
		gene1 = baby1[i];
		gene2 = baby2[i];

		if ( gene1 === gene2 )
			continue ;

		//console.log('gene1: ' + gene1 + ', gene2: ' + gene2);

		pos = baby1.indexOf(gene2);
		if ( pos === -1 )
			console.log('error! in crossoverPMX');
		Utils.swapByIndex(baby1, pos, baby1, i);

		pos = baby2.indexOf(gene1);
		if ( pos === -1 )
			console.log('error! in crossoverPMX');
		Utils.swapByIndex(baby2, pos, baby2, i);
	}

	return new Array(baby1, baby2);
}
