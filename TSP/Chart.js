"use strict";

function Chart(canvasName) {
	this.render = new Canvas2D();
	this.render.initialize(canvasName);

	this.margin = 20;
	this.axisNegY = this.render.canvas.height / 4;
	this.axisPosY = this.render.canvas.height - 2*this.margin - this.axisNegY;
	this.axisX = this.render.canvas.width - 2*this.margin;
	this.origin = new Vector2(this.render.canvas.width/2, this.render.canvas.height-this.axisNegY-this.margin);

	this.statsPos = new Vector2(this.origin.x+20, this.origin.y+50);
	this.statsHeight = 20;
}

Chart.prototype.clear = function () {
	this.render.clear();
};

Chart.prototype.drawAxis = function (nameX, nameY) {
	var ctx = this.render.ctx;

	ctx.beginPath();
	ctx.strokeStyle = '#c0c0c0';
	ctx.moveTo(this.margin, this.origin.y);
	ctx.lineTo(this.render.canvas.width-this.margin, this.origin.y);
	ctx.moveTo(this.origin.x, this.origin.y+this.axisNegY);
	ctx.lineTo(this.origin.x, this.margin);
	ctx.stroke();

	ctx.font = '16px serif';
	ctx.fillStyle = 'blue';
	ctx.fillText(nameX, this.margin+4, this.origin.y-16);
	ctx.fillText(nameY, this.origin.x+4, this.margin+4);
}

Chart.prototype.drawGaussian = function (data, numBucket, fixedScale) {
	if ( typeof data === 'undefined' || data.length === 0 )
		return ;

	if ( typeof numBucket === 'undefined' || numBucket > this.axisX )
		numBucket = this.axisX;

	if ( numBucket <= 0 )
		return ;

	var ctx = this.render.ctx;
	var i = 0;
	var span;
	var bucketSize;
	var arrBucket = [];
	var pointer;

	/* because we enforce bucket-size at least 1, for simplicity convert float to integer */
	var intData = data.map(function (v) { return Math.floor(v); });

	intData.sort(function (a, b) { return a - b; });
	span = intData[intData.length-1] - intData[0] + 1;
	if ( numBucket > span )
		numBucket = span;
	bucketSize = span / numBucket;

	/* init target bucket array */
	arrBucket[numBucket-1] = 0;
	arrBucket.fill(0);

	for ( i = 0; i < intData.length; i ++ ) {
		pointer = (intData[i] - intData[0]) / bucketSize;
		pointer = Math.floor(pointer);
		arrBucket[pointer] ++;
	}

	/* drawing... */
	var step = Math.floor(this.axisX / numBucket);
	var beginX = this.margin;
	var maxValue = arrBucket.reduce(function (t, v) { return v > t ? v : t; }, 0);
	var scale = 1;
	var drawHeight = this.axisPosY*9/10;
	var beginLabel = intData[0];
	var textInterval = Math.floor(numBucket/10);
	var render = this.render;

	if ( typeof fixedScale === 'undefined' || fixedScale <= 0 ) {
		if ( maxValue < drawHeight )
			scale = Math.floor(drawHeight/maxValue);
	}
	else
		scale = fixedScale;


	ctx.beginPath();
	ctx.strokeStyle = 'red';
	for ( i = 0; i < arrBucket.length; i ++ ) {
		if ( i === 0 )
			ctx.moveTo(beginX, this.origin.y-arrBucket[i]*scale);
		else
			ctx.lineTo(beginX, this.origin.y-arrBucket[i]*scale);


		/* X-Axis labels */
		if ( i % textInterval === 0 )
			render.drawText(beginLabel, beginX, this.origin.y+20);
		else if ( i === arrBucket.length-1 )
			render.drawText(beginLabel, beginX+4, this.origin.y+20);

		/* Y-Axis labels */
		if ( maxValue === arrBucket[i] ) /* the most full bucket, label it with red font */
			render.drawText(arrBucket[i], beginX, this.origin.y-arrBucket[i]*scale, '24px serif', 'red');
		else if ( i % textInterval === 0 )
			render.drawText(arrBucket[i], beginX, this.origin.y-arrBucket[i]*scale);
		else if ( i === arrBucket.length-1 )
			render.drawText(arrBucket[i], beginX, this.origin.y-arrBucket[i]*scale, '20px serif', 'green');

		beginX += step;
		beginLabel = Math.floatAdd(bucketSize, beginLabel);
		beginLabel = Math.round(beginLabel);
	}
	ctx.stroke();
}

Chart.prototype.drawStats = function (text, where) {
	var ctx = this.render.ctx;
	var y = this.statsPos.y + this.statsHeight * where;

	ctx.font = '16px serif';
	ctx.fillStyle = 'black';
	ctx.fillText(text, this.statsPos.x, y);
}


var chart = undefined;
