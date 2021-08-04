let webGLCanvas = document.getElementById("WebGL-canvas");
let webGLContext = webGLCanvas.getContext("2d");
webGLCanvas.width = 1024;
webGLCanvas.height = 1024;
let cellScale = 8;
let numCells = 64;


function main() {
    let fluidView = new FluidView(numCells, .001, .001, .1, webGLContext, webGLCanvas, cellScale);
    fluidView.render();

    var mouseDown = false;
    var mouseDownX = 0;
    var mouseDownY = 0;
    var mouseDownTime = 0;

    webGLCanvas.addEventListener('mousemove', e => {
        fluidView.hover(e.offsetX, e.offsetY);
        if (mouseDown) {
            fluidView.addDensity(e.offsetX, e.offsetY, .1);
            let d = new Date();
            fluidView.addVelocity(e.offsetX, mouseDownX, e.offsetY, mouseDownY, d.getMilliseconds() - mouseDownTime);
        }
    });

    webGLCanvas.addEventListener('mousedown', e => {
        fluidView.addDensity(e.offsetX, e.offsetY, .75);
        mouseDown = true;
        mouseDownX = e.offsetX;
        mouseDownY = e.offsetY;
        let d = new Date();
        mouseDownTime = d.getMilliseconds();
        //fluidView.addDensity(e.offsetX - (fluidView.cellScale), e.offsetY, 1);
        //fluidView.addDensity(e.offsetX + (fluidView.cellScale), e.offsetY, 1);
        //fluidView.addDensity(e.offsetX, e.offsetY + (fluidView.cellScale), 1);
        //fluidView.addDensity(e.offsetX, e.offsetY - (fluidView.cellScale), 1);
    });

    webGLCanvas.addEventListener('mouseup', e => {
        mouseDown = false;
    });
}

main();
