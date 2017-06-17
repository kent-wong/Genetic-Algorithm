"use strict";

Math.randInt = function (start, end) {
	if ( typeof start === 'undefined' )
		return undefined;
	else if ( typeof end === 'undefined' ) {
		end = start;
		start = 0;
	}

	if ( start >= end )
		return undefined;

	var length = end - start;
	var num = Math.floor(Math.random() * length);

	return num + start;
}

Math.randSpan = function (start, end, minSpan) {
	if ( typeof start === 'undefined' )
		return undefined;

	if ( typeof end === 'undefined' ) {
		end = start;
		start = 0;
	}

	if ( start > end )
		return undefined;

	if ( typeof minSpan === 'undefined' )
		minSpan = 1;

	var length = end - start;
	if ( minSpan >= length )
		return undefined;

	var randStart = Math.randInt(start, end - minSpan);
	var randEnd = Math.randInt(randStart + minSpan, end);

	return new Array(randStart, randEnd);
}

Math.permute = function (arr) {
	if ( typeof arr === 'undefined' )
		return undefined;

	var result = new Array();
	var index = 0;
	for ( var i = 0; i < arr.length; i ++ ) {
		index = Math.randInt(result.length + 1);
		result.splice(index, 0, arr[i]);
	}

	return result;
}

Math.range = function (start, end) {
	if ( typeof start === 'undefined' )
		return undefined;
	else if ( typeof end === 'undefined' ) {
		end = start;
		start = 0;
	}

	if ( start > end )
		return undefined;

	var result = new Array();
	for ( var i = start; i < end; i ++ ) {
		result.push(i);
	}

	return result;
}

Math.float6 = function(num) {
	var n = new Number(num);
	return parseFloat(n.toFixed(6));
}

Math.opAdd = 0;
Math.opSub = 1;

Math.floatOp = function(v1, v2, op) {
	var str;
	var len1, len2;
	var times = 1;

	str = "" + v1;
	len1 = str.split(".")[1] === undefined ? 0 : str.split(".")[1].length;
	str = "" + v2;
	len2 = str.split(".")[1] === undefined ? 0 : str.split(".")[1].length;

	times = Math.pow(10, Math.max(len1, len2));
	v1 *= times;
	v2 *= times;
	
	v1 = parseInt(v1 + 0.5);
	v2 = parseInt(v2 + 0.5);

	if ( typeof op === 'undefined' || op === Math.opAdd )
		return (v1 + v2) / times;
	else
		return (v1 - v2) / times;
}

Math.floatAdd = function(v1, v2) {
	return Math.floatOp(v1, v2, Math.opAdd);
}

Math.floatSub = function(v1, v2) {
	return Math.floatOp(v1, v2, Math.opSub);
}

Math.floatAddArray = function(arr) {
	var sum = 0;
	var i = 0;

	for ( i = 0; i < arr.length; i ++ )
		sum = Math.floatAdd(sum, arr[i]);

	return sum;
}


var Utils = {};
Utils.swapByIndex = function(a, i, b, j) {
	var tmp = a[i];
	a[i] = b[j];
	b[j] = tmp;
}

function checkFloat() {
	var i = 0;
	var num1 = 0;
	var num2 = 0;
	var a = new Array();
	var total1 = 0;
	var total2 = 0;

	while ( i++ < 1000 ) {
		num1 = Math.float6(Math.random()*1000000);
		num2 = Math.float6(Math.random()*1000000);

		num1 = Math.floatSub(num1, num2);
		total1 = Math.floatAdd(total1, num1);
		a.push(num1);
	}

	for ( i = 0; i < a.length; i ++ ) {
		total2 = Math.floatAdd(total2, a[i]);
	}

	if ( total1 !== total2 ) {
		console.log('total1: ' + total1 + ', total2: ' + total2);
	}
	console.log('total1: ' + total1 + ', total2: ' + total2);
}
