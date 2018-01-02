if(window == window.parent) {
    sessionStorage.jump = "diary/index.html";
    alert(sessionStorage.getItem('jump'));
    location.href = "../index.html";
}
    
