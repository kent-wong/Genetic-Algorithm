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

/* �������·������
 * ���ڳ�ʼ����·��ʱ�ǰ����δ����ģ��������·�����Ǵ˳�ʼ����·��
 * �����·�����ȵ�Ŀ���Ǳ����Ժ�Ƚϣ�����ȷ���㷨�Ƿ����������Ž�
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
