var canvasWidth = Math.min(600,window.innerWidth-20);
var canvasHeight = canvasWidth;
var maxLineWidth = 20,minLineWidth = 1,maxV = 10,minV = 0.1;

window.onload = function(){
	var canvas = document.getElementById("canvas");
	var clearbtn = document.getElementById("clear_btn");
	var controller = "controller";
	var colorbtn = "color_btn";
	var write = new Write({tNode:canvas,clearbtn:clearbtn,controller:controller,colorbtn:colorbtn});
	write.drawGrid();
	write.catchWrite();
	write.catchClear();
	write.catchChangeColor();



	var canvas = document.getElementById("canvas2");
	var clearbtn = document.getElementById("clear_btn2");
	var controller = "controller2";
	var colorbtn = "color_btn2";
	var write2 = new Write({tNode:canvas,clearbtn:clearbtn,controller:controller,colorbtn:colorbtn});
	write2.drawGrid();
	write2.catchWrite();
	write2.catchClear();
	write2.catchChangeColor();
}

function Write(tObject){
	this.strokeColor = "black";
	this.isMouseDown = false;
	this.lastTimeStamp = 0;
	this.lastLocation = {x:0,y:0};
	this.lastLineWidth = -1;
	this.dom = tObject.tNode;
	this.clearbtn = tObject.clearbtn
	this.context = tObject.tNode.getContext("2d");
	this.controller = tObject.controller;
	this.colorbtn = tObject.colorbtn;

	tObject.tNode.width = canvasWidth;
	tObject.tNode.height = canvasHeight;
	document.getElementById(tObject.controller).style.width = canvasHeight+"px";
}

Write.prototype.drawGrid = function() {
	var tmpC = this.context;
	this.context.save();

	// 先绘制四条边
	tmpC.strokeStyle = "rgb(255,0,0)";
	tmpC.beginPath();
	tmpC.moveTo(3,3);
	tmpC.lineTo(canvasWidth-3,3);
	tmpC.lineTo(canvasWidth-3,canvasHeight-3);
	tmpC.lineTo(3,canvasHeight-3);
	tmpC.closePath();	// 使用closePath()表示这是一个闭合的路径
	tmpC.lineWidth = 6;
	tmpC.stroke();

	tmpC.beginPath();
	tmpC.moveTo(0,0);
	tmpC.lineTo(canvasWidth,canvasHeight);

	tmpC.moveTo(canvasWidth,0);
	tmpC.lineTo(0,canvasHeight);

	tmpC.moveTo(canvasWidth*0.5,0);
	tmpC.lineTo(canvasWidth*0.5,canvasHeight);

	tmpC.moveTo(0,canvasHeight*0.5);
	tmpC.lineTo(canvasWidth,canvasHeight*0.5);

	tmpC.lineWidth = 1;
	tmpC.stroke();

	tmpC.restore();
};

Write.prototype.catchWrite = function() {
	var self = this;
	self.dom.onmousedown = function(event){
		event.preventDefault();
		self.beginStroke({x:event.clientX,y:event.clientY});
	}

	self.dom.onmouseup = function(event){
		event.preventDefault();
		self.endStroke();
	}

	self.dom.onmousemove = function(event){
		event.preventDefault();
		if(self.isMouseDown){
			self.moveStroke({x:event.clientX,y:event.clientY})
		}
	}

	self.dom.onmouseout = function(event){
		event.preventDefault();
		self.endStroke();
	}

	self.dom.addEventListener("touchstart",function(event){
		event.preventDefault();
		var touch = event.touches[0];
		self.beginStroke({x:touch.pageX,y:touch.pageY});
	});

	self.dom.addEventListener("touchend",function(event){
		event.preventDefault();
		self.endStroke();
	});

	self.dom.addEventListener("touchmove",function(event){
		event.preventDefault();
		if(self.isMouseDown){
			var touch = event.touches[0];
			self.moveStroke({x:touch.pageX,y:touch.pageY});
		}
	});
};

Write.prototype.catchClear = function() {
	var self = this;
	this.clearbtn.onclick = function(){
		self.context.clearRect(0,0,canvasWidth,canvasHeight);
		self.drawGrid();
	}
};

Write.prototype.catchChangeColor = function() {
	var self = this;
	$("#"+self.controller+" ."+self.colorbtn).click(function(){
		$("#"+self.controller+" ."+self.colorbtn).removeClass("color_btn_selected");
		$(this).addClass("color_btn_selected");
		self.strokeColor = $(this).css("background-color");
	});
};

Write.prototype.beginStroke = function(point) {
	this.isMouseDown = true;
	this.lastLocation = this.windowToCanvas(point.x,point.y);
	this.lastTimeStamp = new Date().getTime();
};

Write.prototype.endStroke = function() {
	this.isMouseDown = false;
 };

Write.prototype.moveStroke = function(point) {
	var tmpC = this.context;
	var currentLocation = this.windowToCanvas(point.x,point.y);
	var currentTimeStamp = new Date().getTime();
	var duringTime = currentTimeStamp - this.lastTimeStamp;
	var distance = this.calDistance(currentLocation,this.lastLocation);
	var lineWidth = this.calLineWidth(distance,duringTime);

	// drawing
	tmpC.beginPath();
	tmpC.moveTo(this.lastLocation.x,this.lastLocation.y);
	tmpC.lineTo(currentLocation.x,currentLocation.y);
	tmpC.strokeStyle = this.strokeColor;
	tmpC.lineWidth = lineWidth;
	tmpC.lineCap = "round";	// 连接直线之间的缺口，使线条更平滑
	tmpC.lineJoin = "round";	// 连接直线之间的缺口，使线条更平滑
	tmpC.stroke();

	this.lastLocation = currentLocation;
	this.lastTimeStamp = currentTimeStamp;
	this.lastLineWidth = lineWidth;
};

// 坐标系转换
Write.prototype.windowToCanvas = function(x,y) {
	var bbox = this.dom.getBoundingClientRect();
	return {x:Math.round(x-bbox.left),y:Math.round(y-bbox.top)};
};

// 计算两点之间的距离
Write.prototype.calDistance = function(loc1,loc2) {
	return Math.sqrt((loc2.x-loc1.x)*(loc2.x-loc1.x)+(loc2.y-loc1.y)*(loc2.y-loc1.y));
};

// 计算两点之间的移动速度
Write.prototype.calLineWidth = function(distance,time) {
	var v = distance / time;
	var resLineWidth = 0;

	if(v<=minV){
		resLineWidth = maxLineWidth;
	}else if(v>=maxV){
		resLineWidth = minLineWidth;
	}else{
		resLineWidth = maxLineWidth-(v-minV)/(maxV-minV)*(maxLineWidth-minLineWidth);
	}

	if(this.lastLineWidth == -1){
		return resLineWidth;
	}

	return this.lastLineWidth*2/3 + resLineWidth/3;
};