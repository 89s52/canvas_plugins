var canvasWidth = 600;
var canvasHeight = canvasWidth;
var isMouseDown = false;

var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

canvas.width = canvasWidth;
canvas.height = canvasHeight;


drawGrid();


canvas.onmousedown = function(event){
	event.preventDefault();
	isMouseDown = true;
}

canvas.onmouseup = function(event){
	event.preventDefault();
	isMouseDown = false;
}

canvas.onmousemove = function(event){
	event.preventDefault();
	isMouseDown = true;
}

canvas.onmouseout = function(event){
	event.preventDefault();
	if(isMouseDown){
		// drawing
		
	}
}


// 绘制米字格
function drawGrid(){
	context.save();

	// 先绘制四条边
	context.strokeStyle = "rgb(255,0,0)";
	context.beginPath();
	context.moveTo(3,3);
	context.lineTo(canvasWidth-3,3);
	context.lineTo(canvasWidth-3,canvasHeight-3);
	context.lineTo(3,canvasHeight-3);
	context.closePath();	// 使用closePath()表示这是一个闭合的路径
	context.lineWidth = 6;
	context.stroke();

	context.beginPath();
	context.moveTo(0,0);
	context.lineTo(canvasWidth,canvasHeight);

	context.moveTo(canvasWidth,0);
	context.lineTo(0,canvasHeight);

	context.moveTo(canvasWidth*0.5,0);
	context.lineTo(canvasWidth*0.5,canvasHeight);

	context.moveTo(0,canvasHeight*0.5);
	context.lineTo(canvasWidth,canvasHeight*0.5);

	context.lineWidth = 1;
	context.stroke();

	context.restore();
}