var canvasWidth = Math.min(600,window.innerWidth-20);
var canvasHeight = canvasWidth;
var maxLineWidth = 30,minLineWidth = 1,maxV = 10,minV = 0.1;

// 设置线条颜色
var strokeColor = "black";

// 判断鼠标是否在画布内，且鼠标左键按下
var isMouseDown = false;

// 记录移动中，两个点中间的时间,计算鼠标移动速度，进而计算线条宽度：速度快线条细，速度慢线条粗
var lastTimeStamp = 0;

// 记录上一次鼠标移动的位置
var lastLocation = {x:0,y:0};

// 记录上一次线条宽度 目的是防止线条宽度突变使得字的轨迹不平滑
var lastLineWidth = -1;

var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

canvas.width = canvasWidth;
canvas.height = canvasHeight;

drawGrid();

var clearbtn = document.getElementById("clear_btn");
clearbtn.onclick = function(){
	context.clearRect(0,0,canvasWidth,canvasHeight);
	drawGrid();
}
$("#controller").css("width",canvasHeight+"px");
$(".color_btn").click(function(){
	$(".color_btn").removeClass("color_btn_selected");
	$(this).addClass("color_btn_selected");
	strokeColor = $(this).css("background-color");
})

canvas.onmousedown = function(event){
	event.preventDefault();
	beginStroke({x:event.clientX,y:event.clientY});
}

canvas.onmouseup = function(event){
	event.preventDefault();
	endStroke();
}

canvas.onmousemove = function(event){
	event.preventDefault();
	if(isMouseDown){
		moveStroke({x:event.clientX,y:event.clientY})
	}
}

canvas.onmouseout = function(event){
	event.preventDefault();
	endStroke();
}

canvas.addEventListener("touchstart",function(event){
	event.preventDefault();
	var touch = event.touches[0];
	beginStroke({x:touch.pageX,y:touch.pageY});
});

canvas.addEventListener("touchend",function(event){
	event.preventDefault();
	endStroke();
});

canvas.addEventListener("touchmove",function(event){
	event.preventDefault();
	if(isMouseDown){
		var touch = event.touches[0];
		moveStroke({x:touch.pageX,y:touch.pageY});
	}
});

function beginStroke(point){
	isMouseDown = true;
	lastLocation = windowToCanvas(point.x,point.y);
	lastTimeStamp = new Date().getTime();
}

function endStroke(){
	isMouseDown = false;
}

function moveStroke(point){
	var currentLocation = windowToCanvas(point.x,point.y);
	var currentTimeStamp = new Date().getTime();
	var duringTime = currentTimeStamp - lastTimeStamp;
	var distance = calDistance(currentLocation,lastLocation);
	var lineWidth = calLineWidth(distance,duringTime);

	// drawing
	context.beginPath();
	context.moveTo(lastLocation.x,lastLocation.y);
	context.lineTo(currentLocation.x,currentLocation.y);
	context.strokeStyle = strokeColor;
	context.lineWidth = lineWidth;
	context.lineCap = "round";	// 连接直线之间的缺口，使线条更平滑
	context.lineJoin = "round";	// 连接直线之间的缺口，使线条更平滑
	context.stroke();

	lastLocation = currentLocation;
	lastTimeStamp = currentTimeStamp;
	lastLineWidth = lineWidth;
}




// 坐标系转换
function windowToCanvas(x,y){
	var bbox = canvas.getBoundingClientRect();
	return {x:Math.round(x-bbox.left),y:Math.round(y-bbox.top)};
}

// 计算两点之间的距离
function calDistance(loc1,loc2){
	return Math.sqrt((loc2.x-loc1.x)*(loc2.x-loc1.x)+(loc2.y-loc1.y)*(loc2.y-loc1.y));
}


// 计算两点之间的移动速度
function calLineWidth(distance,time){
	var v = distance / time;

	var resLineWidth = 0;
	if(v<=minV){
		resLineWidth = maxLineWidth;
	}else if(v>=maxV){
		resLineWidth = minLineWidth;
	}else{
		resLineWidth = maxLineWidth-(v-minV)/(maxV-minV)*(maxLineWidth-minLineWidth);
	}

	if(lastLineWidth == -1){
		return resLineWidth;
	}

	return lastLineWidth*2/3 + resLineWidth/3;
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