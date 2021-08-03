let webGLCanvas = document.getElementById("WebGL-canvas");
let webGLContext = webGLCanvas.getContext("2d");
webGLCanvas.width = 1024;
webGLCanvas.height = 1024;
let cellScale = 8;
let numCells = 128;
// webGLContext.fillStyle = "blue";
// webGLContext.fillRect(0, 0, webGLCanvas.width, webGLCanvas.height);
// drawgrid(webGLContext);

// function drawgrid(ctx2d) {
//     for (var col = 0; col < webGLCanvas.width; col += cellScale) {
//         for (var row = 0; row < webGLCanvas.height; row += cellScale) {
//             ctx2d.strokeRect(col, row, cellScale, cellScale);
//         }
//     }
// }

// function index(row, column) {
//     return column + (row * numCells);
// }



function main() {
    let fluidView = new FluidView(128, .001, 1, 1, webGLContext, cellScale);
    fluidView.render();

    webGLCanvas.addEventListener('mousemove', e => {
        fluidView.hover(e.offsetX, e.offsetY);
        fluidView.render();
    });
}

main();

// webGLCanvas.onmouseover = e => {
//     ctx2d.strokeRect(col.offset, row, 8, 8);
// };
