let webGLCanvas = document.getElementById("WebGL-canvas");
let webGLContext = webGLCanvas.getContext("2d");
webGLCanvas.width = 1024;
webGLCanvas.height = 1024;
let cellScale = 8;
let numCells = 128;


function main() {
    let fluidView = new FluidView(128, .001, 1, 1, webGLContext, webGLCanvas, cellScale);
    fluidView.render();

    webGLCanvas.addEventListener('mousemove', e => {
        fluidView.hover(e.offsetX, e.offsetY);
    });

}

main();
