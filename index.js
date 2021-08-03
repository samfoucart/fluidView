let webGLCanvas = document.getElementById("WebGL-canvas");
let webGLContext = webGLCanvas.getContext("2d");
webGLCanvas.width = 1024;
webGLCanvas.height = 1024;
let cellScale = 8;
let numCells = 128;
webGLContext.fillStyle = "blue";
webGLContext.fillRect(0, 0, webGLCanvas.width, webGLCanvas.height);
drawgrid(webGLContext);

function drawgrid(ctx2d) {
    for (var col = 0; col < webGLCanvas.width; col += cellScale) {
        for (var row = 0; row < webGLCanvas.height; row += cellScale) {
            ctx2d.strokeRect(col, row, cellScale, cellScale);
        }
    }
}

function index(row, column) {
    return column + (row * numCells);
}

webGLCanvas.addEventListener('mousemove', e => {
    webGLContext.fillStyle = "red";
    let row = Math.floor(e.offsetY / cellScale) * cellScale;
    let col = Math.floor(e.offsetX / cellScale) * cellScale;
    webGLContext.fillRect(col, row, cellScale, cellScale);
});

function main() {
    let fluidView = new FluidView(128, .001, 1, 1);
}

// webGLCanvas.onmouseover = e => {
//     ctx2d.strokeRect(col.offset, row, 8, 8);
// };
