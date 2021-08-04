let webGLCanvas = document.getElementById("WebGL-canvas");
let webGLContext = webGLCanvas.getContext("2d");
webGLCanvas.width = 1024;
webGLCanvas.height = 1024;
let cellScale = 8;
let numCells = 64;


function main() {
    let fluidView = new FluidView(numCells, .001, .01, .1, webGLContext, webGLCanvas, cellScale);
    fluidView.render();

    webGLCanvas.addEventListener('mousemove', e => {
        fluidView.hover(e.offsetX, e.offsetY);
    });

    webGLCanvas.addEventListener('mousedown', e => {
        fluidView.addDensity(e.offsetX, e.offsetY, .1);
        //fluidView.addDensity(e.offsetX - (fluidView.cellScale), e.offsetY, 1);
        //fluidView.addDensity(e.offsetX + (fluidView.cellScale), e.offsetY, 1);
        //fluidView.addDensity(e.offsetX, e.offsetY + (fluidView.cellScale), 1);
        //fluidView.addDensity(e.offsetX, e.offsetY - (fluidView.cellScale), 1);
    })
}

main();
