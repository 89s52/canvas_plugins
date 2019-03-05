var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var img = new Image();
var slider = document.getElementById("scale-range");


window.onload = function(){
	canvas.width = 1152;
	canvas.height = 768;

	img.src = "./timg.jpeg";
	img.onload = function(){
		var scale = slider.value;
		drawImageByScale( scale );

		slider.onmousemove = function(){
			var scaleCh = slider.value;
			drawImageByScale(scaleCh);
		}

		// context.drawImage(img,0,0,canvas.width,canvas.height);	// 充满整个画布
	}
}

function drawImageByScale( scale ){
	var imgWidth = 1152*scale;
	var imgHeight = 768*scale;
	var dx = canvas.width/2 - imgWidth/2;
	var dy = canvas.height/2 - imgHeight/2;

	// 先清空画布
	context.clearRect(0,0,canvas.width,canvas.height);

	// 再重新绘制画布
	context.drawImage(img,dx,dy,imgWidth,imgHeight);
}