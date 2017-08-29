var cvs = document.getElementById("cvs");
var context = cvs.getContext("2d");
var a = [ 39, 38, 37, 40 ];
var mx = [ 1, 0, -1, 0 ];
var my = [ 0, -1, 0, 1 ];

var p = 0;
var past = 0;
var tm;
var px = 0, py = 0, nx = 0, ny = 0;
var img = new Image();
img.src = "yoga.png";

function main()
{
    context.font = "50px Consolas";
    context.textAlign = "start";
    context.textBaseLine = "top";

    context.moveTo(0, 0);
    
    tm = setInterval("draw()", 8.37);
}

function draw()
{
    var now;
    
    now = performance.now();
    if(p == 0) {
        context.beginPath();
        context.moveTo(px, py);
    } 
    if(now - past > 33.3) {
        if(p != 0) {
            context.clearRect(0, 0, 800, 600);
            context.lineTo(px, py);
            context.stroke();
            context.fillText("pos   = " + px + " " + py, 100, 100);
            context.fillText("mouse = " + nx + " " + ny, 100, 200);
        }
        context.drawImage(img, px, py);
        context.fill();
        past = now;
    }
    p++;
    if(p == 200) p = 0;
} 



img.onload = function()
{
    main();
}


window.onkeydown = function(event)
{
    if(event.keyCode == 27) {
       clearInterval(tm); 
    }
    for(var i = 0; i < 4; i++) {
        if(event.keyCode == a[i]) {
            px += mx[i] * 50, py += my[i] * 50;
        }
    }
}

window.onmousemove = function(event)
{
    ny = event.pageY - cvs.offsetLeft, nx = event.pageX - cvs.offsetTop;
}

window.onmousedown = function(event)
{
    alert((event.pageX - cvs.offsetLeft) + "," + (event.pageY - cvs.offsetTop)); 
}


