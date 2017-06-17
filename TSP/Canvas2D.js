"use strict";

function Canvas2D() {
	this.canvas = undefined;
	this.ctx = undefined;
}

Canvas2D.prototype.initialize = function (canvasName) {
	this.canvas = document.getElementById(canvasName);
	this.ctx = this.canvas.getContext('2d');
};

Canvas2D.prototype.clear = function () {
	this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
};

Canvas2D.prototype.drawText = function (text, x, y, font, style) {
	if ( typeof style === 'undefined' )
		style = 'black';

	if ( typeof font === 'undefined' )
		font = '12px serif';

	this.ctx.font = font
	this.ctx.fillStyle = style;
	this.ctx.fillText(text, x, y);
}

Canvas2D.prototype.drawRect = function (x, y, w, h) {
	x -= w / 2;
	y -= h / 2;

	this.ctx.fillStyle = "red";
	this.ctx.fillRect(x, y, w, h);
}

Canvas2D.prototype.drawPath = function (path, closed) {
	var i = 0;

	this.ctx.beginPath();
	this.ctx.strokeStyle = "blue";
	this.ctx.moveTo(path[0].x, path[0].y);

	for ( i = 1; i < path.length; i ++ ) {
		this.ctx.lineTo(path[i].x, path[i].y);
	}

	if ( closed === true )
		this.ctx.closePath();

	this.ctx.stroke();
}

var canvas2D = new Canvas2D();
