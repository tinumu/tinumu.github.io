
// stroke 線を描く
// fill 塗りつぶす
// js はcanvasの操作をアする
var cvs = document.getElementById("cvs");
var context = cvs.getContext("2d");

context.strokeStyle = "black";
context.lineWidth = 10;
context.lineCap = 'round';
context.beginPath();
context.moveTo(20, 300);
context.lineTo(100, 114);
context.stroke();

context.strokeStyle = "#0000FF";

context.beginPath(); //新たな状態をつくる？
context.lineWidth = 10;
context.lineCap = 'square';
context.moveTo(50, 40);
context.lineTo(400, 300);
context.lineTo(100, 200);
context.closePath();
context.stroke();

context.beginPath();
context.fillStyle = "rgb(30, 40, 50)";
context.fillRect(10, 10, 80, 170); // lineWidthとかのプロパティには影響しない
context.moveTo(230, 230);
context.lineTo(280, 280);
context.lineTo(230, 280);
context.fill();

context.beginPath();
context.strokeStyle = "#114514";
context.lineJoin = 'round';
context.lineWidth = 5;
context.beginPath();
context.arc(300, 300, 50, Math.PI / 2, Math.PI * 1.2, false);
context.closePath();
context.stroke();




