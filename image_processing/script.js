var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var slider = document.getElementById("scale-range");
var watermarkCanvas = document.getElementById("watermark-canvas");
var watermarkContext = watermarkCanvas.getContext("2d");

window.onload = function(){
	canvas.width = 1152;
	canvas.height = 768;

	var img = new Image();
	img.src = "./timg.jpeg";
	img.onload = function(){
		var scale = slider.value;
		drawImageByScale(img, scale );

		slider.onmousemove = function(){
			var scaleCh = slider.value;
			drawImageByScale(img,scaleCh);
		}

		// context.drawImage(img,0,0,canvas.width,canvas.height);	// 充满整个画布

	}
	// set watermark canvas
	watermarkCanvas.width = 360;
	watermarkCanvas.height = 100;
	watermarkContext.font = "bold 50px Arial";
	watermarkContext.fillStyle = "rgba(255,255,255,0.5)";
	watermarkContext.textBaleline = "middle";
	watermarkContext.fillText("== LilyLaw ==",20,50);
}

function drawImageByScale( img,scale ){
	var imgWidth = 1152*scale;
	var imgHeight = 768*scale;
	var dx = canvas.width/2 - imgWidth/2;
	var dy = canvas.height/2 - imgHeight/2;

	// 先清空画布
	context.clearRect(0,0,canvas.width,canvas.height);

	// 再重新绘制画布
	context.drawImage(img,dx,dy,imgWidth,imgHeight);
	context.drawImage(watermarkCanvas,canvas.width - watermarkCanvas.width,
									  canvas.height - watermarkCanvas.height);
}