"use strict";

function MapTSP (width, height, numCities) {
	this.width = width;
	this.height = height;
	this.numCities = numCities;
	this.bestPossibleRoute = 0;
	this.vecCityCoOrds = new Array();

	this.createCitiesCircular();
	this.calcBestPossibleRoute();
}

MapTSP.prototype.createCitiesCircular = function () {
	var margin = 50;
	var origin = new Vector2(this.width/2, this.height/2);
	var radius;
	var angle = 0;
	var segment = 2 * Math.PI / this.numCities;
	var x, y;

	if ( this.height < this.width )
		radius = this.height/2 - margin;
	else
		radius = this.width/2 - margin;

	while ( angle < 2 * Math.PI ) {
		x = radius * Math.cos(angle) + origin.x;
		y = radius * Math.sin(angle) + origin.y;
		this.vecCityCoOrds.push(new Vector2(x, y));
		angle += segment;
	}

}

/* 计算最佳路径长度
 * 由于初始创建路径时是按环形创建的，所以最佳路径就是此初始环形路径
 * 计算此路径长度的目的是便于以后比较，用来确定算法是否收敛到最优解
 * */
MapTSP.prototype.calcBestPossibleRoute = function () {
	this.bestPossibleRoute = Alg.circularRouteDistance(this.vecCityCoOrds);
	this.bestPossibleRoute = Math.float6(this.bestPossibleRoute) + 1;
}

MapTSP.prototype.index2CoOrds = function (indexArray) {
	if ( typeof indexArray === 'undefined' )
		return undefined;

	function callbackIndex2Vec(currentValue) {
		return this.vecCityCoOrds[currentValue];
	}

	return indexArray.map(callbackIndex2Vec, this);
}
