var cvs = document.getElementById("cvs");
var context = cvs.getContext("2d");

var tm;
var H = 10000, W = 10000;
var AMAX_N = 100005;
var MAX_N = 100000;
var idx = 200; // 総数
var data = new Array(AMAX_N);
var starx = new Array(10000), stary = new Array(10000);
var drag = false;
var dragx, dragy;
var offsetx = 0, offsety = 0;
var mousex, mousey;
var px = new Array(AMAX_N), py = new Array(AMAX_N);
var lp = 0;
var imupsp = new Image();
imupsp.src = "speed.png";

var upspx = new Array(1000), upspy = new Array(1000);
var upsp_idx = 100;
var upsp_width = 50, upsp_height = 50;
var upsp_queue = new Array();
var upsp_used = new Array(1000);

var imitem = new Image();
imitem.src = "Nowmanzaw.png";

var itemx = new Array(204), itemy = new Array(204);
var item_used = new Array(204);
var item_idx = 50;
var item_width = 140, item_height = 140;
var item_queue = new Array(300); 
var max_point = document.cookie.split('; ')[0].split('=')[1];

var clear_flag  = false;
var start_flag  = false;
var result_flag = false;
var result_moment = false;

var run = false;
var tim = 0;
var start;

var vec = [39, 38, 37, 40];
var mx  = [ 1,  0, -1,  0];
var my  = [ 0, -1,  0,  1];

var point = 0;
//もはやクラスではない。
var Object = function(x, y, size)
{
    this.x = x;
    this.y = y;
    this.size = size;
}

function init()
{
    speed = 1, stats = 5;
    point = 0;
    offsetx = 0, offsety = 0;
    for(var i = 0; i < idx + 1; i++) {
        if(i < idx) data[i] = new Object(Math.random() * (W - 20) + 10, Math.random() * (H - 20) + 10, 2 + Math.random() * 50);
        else data[i] = new Object(50, 50, 10);
        px[i] = 0, py[i] = 0;
    }

    for(var i = 0; i < 500; i++) {
        starx[i] = Math.random() * W;
        stary[i] = Math.random() * H;
    }

    for(var i = upsp_idx; i < 1000; i++) upsp_used[i] = false;

    for(var i = 0; i < upsp_idx; i++) {
        upspx[i] = Math.random() * (W - upsp_width);
        upspy[i] = Math.random() * (H - upsp_height);
        upsp_used[i] = true;
    }

    for(var i = item_idx; i < 204; i++) item_used[i] = false;

    for(var i = 0; i < item_idx; i++) {
        itemx[i] = Math.random() * (W - item_width);
        itemy[i] = Math.random() * (H - item_height);
        item_used[i] = true;
    }

    upsp_queue.push(upsp_idx);
    item_queue.push(item_idx);

} 

function Main()
{
    var now = performance.now();

    if(result_flag == true) {
        context.fillStyle = "rgb(40, 40, 40)";
        context.fillRect(0, 0, 800, 650);
        context.font = "72px Consolas";
        context.textAlign = "center";
        context.fillStyle = "rgb(255, 128, 0)";
        context.strokeStyle = "#FFFFFF";
        context.fillText("Point = " + point, 400, 325);
        context.strokeText("Point = " + point, 400, 325);
        context.fillStyle = "#FFFFFF";
        context.font = "40px Consolas";
        context.fillText("Thank you for playing!!", 400, 435);
        context.fillText("Press the space key with the title!", 400, 575);
        if(max_point < point) max_point = point;
        if(result_moment == true) {
            var expire = new Date();
            expire.setTime( expire.getTime() + 1000 * 3600 * 24 * 10);
            document.cookie = 'data=' + encodeURIComponent(max_point) + '; expires=' + expire.toUTCString();
            result_moment = false;
        }
    } else if(start_flag == false) {
        context.font = "72px Consolas";
        context.textAlign = "center"; 
        context.fillStyle = "rgb(40, 40, 40)";
        context.fillRect(0, 0, 800, 650);

        context.fillStyle = "rgb(255, 255, 0)";
        for(var i = 0; i < 10; i++) {
            context.beginPath();
            context.arc(Math.random() * 800, Math.random() * 650, 2, 0, Math.PI * 2, false);
            context.fill();
        }
        context.strokeStyle = "rgb(255, 255, 255)";
        context.fillStyle = "rgb(0, 0, 128)";
        context.fillText("Power of Gravity!!", 400, 270);
        context.strokeText("Power of Gravity!!", 400, 270);
        context.font = "30px Consolas";
        context.fillStyle = "rgb(255, 255, 255)";
        context.fillText("Press the space key with the start!", 400, 400);
        context.fillText("Max Point = " + max_point, 400, 530);
    } else {
        var rest = 300 - (now - start) / 1000;
        context.font = "20px consolas";
        context.textAlign = "start";
        //視点操作
        if(drag == true) offsetx = dragx - mousex, offsety = dragy - mousey;
        else offsetx = data[idx].x - 400, offsety = data[idx].y - 300;
        
        //描画
        context.fillStyle = "rgb(0, 192, 0)";
        context.fillRect(0, 600, 800, 50);
        context.fillStyle = "rgb(40, 40, 40)";
        context.fillRect(0, 0, 800, 600);

        context.strokeStyle = "#FFFFFF";
        context.strokeRect(-1 - offsetx, -1 - offsety, W + 2, H + 2);

        context.fillStyle = "rgb(255, 255, 0)";
        for(var i = 0; i < 500; i++) {
            context.beginPath();
            context.arc(starx[i] - offsetx, stary[i] - offsety, 2, 0, Math.PI * 2, false);
            context.fill();
        }

        for(var i = 0; i < upsp_idx; i++) {
            if(upsp_used[i] == true) {
                context.drawImage(imupsp, upspx[i] - offsetx, upspy[i] - offsety, 50, 50);
            }
        }

        for(var i = 0; i < item_idx; i++) {
            if(item_used[i] == true) {
                context.drawImage(imitem, itemx[i] - offsetx, itemy[i] - offsety, 140, 140);
            }
        }

        for(var i = 0; i < idx + 1; i++) {
            context.fillStyle = "rgb("+parseInt(Math.random()*256)+", "+parseInt(Math.random()*256)+", "+parseInt(Math.random()*256)+")";
            if(i == idx) context.fillStyle = "rgb(255, 159, 159)";
            context.beginPath();
            context.arc(data[i].x - offsetx, data[i].y - offsety, data[i].size, 0, Math.PI * 2, false);
            context.fill();
        }

        if(stats != 5) {
            px[idx] += mx[stats] * speed * 0.05
            py[idx] += my[stats] * speed * 0.05;
        }

        context.fillStyle = "black";
        context.fillText("Accelalation  Lv." + speed, 100, 620);
        context.fillText("Speed         =  " + parseInt(Math.sqrt(px[idx] * px[idx] + py[idx] * py[idx]) * 1000) / 1000, 100, 640);
        context.fillText("Point = " + point, 500, 640);
        context.fillText(("0" + parseInt(rest / 60)).slice(-2) + ":" + ("0" + parseInt(rest % 60)).slice(-2), 735, 640);

        if(now - start > 300000) {
            result_flag = true;
            result_moment = true;
            start_flag  = false;
        }
        if(now - tim > 10000) {
            // item
            if(item_queue.length > 0) {
                var val = item_queue.shift();
                if(item_queue.length == 0) {
                    if(item_idx <= 200) {
                        item_idx++;
                        item_queue.push(item_idx);
                    }
                }

                item_used[val] = true;
                itemx[val] = Math.random() * (W - item_width);
                itemy[val] = Math.random() * (H - item_height);
            } 
            // upsp
            if(upsp_queue.length > 0) {
                val = upsp_queue.shift();
                if(upsp_queue.length == 0) {
                    if(upsp_idx <= 500) { 
                        upsp_idx++;
                        upsp_queue.push(upsp_idx);
                    }
                }

                upsp_used[val] = true;
                upspx[val] = Math.random() * (W - upsp_width);
                upspy[val] = Math.random() * (H - upsp_height);
            } 
            tim = now;
        }

        //処理（何の？）
        for(var i = 0; i < idx + 1; i++) {
            for(var j = 0; j < idx + 1; j++) {
                var len;
                if(data[i].x != data[j].x || data[i].y != data[j].y) {
                    len = Math.sqrt(Math.pow(data[i].x - data[j].x, 2.0) + Math.pow(data[i].y - data[j].y, 2.0));
                    px[j] += (data[i].x - data[j].x) / len * data[i].size * data[j].size / len / len * 3;
                    py[j] += (data[i].y - data[j].y) / len * data[i].size * data[j].size / len / len * 3;
                    if(px[j] > 15) px[j] = 15;
                    if(py[j] > 15) py[j] = 15;
                    if(px[j] < -15) px[j] = -15;
                    if(py[j] < -15) py[j] = -15;
                }
            }
        }

        for(var i = 0; i < idx + 1; i++) {
            data[i].x += px[i];
            data[i].y += py[i];
            for(var j = 0; j < idx + 1; j++) {
                if(i == j) continue;
                if((Math.pow(data[i].x - data[j].x, 2.0) + Math.pow(data[i].y - data[j].y, 2.0)) < data[j].size * data[j].size) {
                    px[i] = -px[i], py[i] = -py[i];
                    data[i].x += px[i], data[i].y += py[i]; break;
                }
            }
            if(data[i].x > W - data[i].size || data[i].x < data[i].size) px[i] = -px[i], data[i].x += px[i];
            if(data[i].y > H - data[i].size || data[i].y < data[i].size) py[i] = -py[i], data[i].y += py[i];
        }

        for(var i = 0; i < upsp_idx; i++) {
            if(upsp_used[i] == true) {
                if(upspx[i] <= data[idx].x && data[idx].x <= (upspx[i] + upsp_width) && 
                        upspy[i] <= data[idx].y && data[idx].y <= (upspy[i] + upsp_height)) {
                    speed++;
                    upsp_queue.push(i);
                    upsp_used[i] = false;
                }
            }
        }

        for(var i = 0; i < item_idx; i++) {
            if(item_used[i] == true) {
                if(itemx[i] <= data[idx].x && data[idx].x <= (itemx[i] + item_width) &&
                        itemy[i] <= data[idx].y && data[idx].y <= (itemy[i] + item_height)) {
                    point++;
                    item_queue.push(i);
                    item_used[i] = false;
                }
            }
        }
    }
}

if(max_point == undefined) max_point = 0;
init();
tm = setInterval("Main()", 16.7);

window.onmousedown = function(event)
{
    if(drag == false) {
        drag = true;
        dragx = event.pageX + offsetx - cvs.offsetLeft;
        dragy = event.pageY + offsety - cvs.offsetTop;
    }
}

window.onmouseup = function(event)
{
    if(drag == true) drag = false;
}

window.onmousemove = function(event)
{
    mousex = event.pageX - cvs.offsetLeft;
    mousey = event.pageY - cvs.offsetTop;
}

window.onkeydown = function(event)
{
    if(event.keyCode == 27) {
        if(start_flag == true) {
            start_flag = false;
            result_flag = true;
            result_moment = true;
        }
    }
    if(event.keyCode == 32) {
        if(result_flag == true) {
            init();
            result_flag = false;
        } else {
            start = performance.now();
            start_flag = true; 
        }
    } 
    for(var i = 0; i < 4; i++) {
        if(event.keyCode == vec[i]) {
            stats = i;
        }
    }
}

window.onkeyup = function(event)
{
    stats = 5;
}
    
