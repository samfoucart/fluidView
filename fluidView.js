class FluidView {
    constructor(size, dt, diffusion, viscosity, ctx, canvas, cellScale) {
        this.N = size;
        this.dt = dt;
        this.diffusion = diffusion;
        this.viscosity = viscosity;

        this.s = new Array(this.N * this.N);
        this.density = new Array(this.N * this.N);

        this.Vx = new Array(this.N * this.N);
        this.Vy = new Array(this.N * this.N);

        this.Vx0 = new Array(this.N * this.N);
        this.Vy0 = new Array(this.N * this.N);

        this.ctx = ctx;
        this.canvas = canvas;

        this.cellScale = cellScale;

        this.activeY = -1;
        this.activeX = -1;

        this.render = this.render.bind(this);
    }

    render() {
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(0, 0, this.N * this.cellScale, this.N * this.cellScale);
        for (var col = 0; col < this.N * this.cellScale; col += this.cellScale) {
            for (var row = 0; row < this.N * this.cellScale; row += this.cellScale) {
                if (row == this.activeY && col == this.activeX) {
                    this.ctx.fillStyle = "black";
                    this.ctx.fillRect(col, row, this.cellScale, this.cellScale);
                } else {
                    let brightness = FluidView.lerp(0, 255, this.density[this.index(row, col)]);
                    this.ctx.fillStyle = 'rgb(' + brightness + ', ' + brightness + ', ' + brightness + ')';
                    this.ctx.strokeRect(col, row, this.cellScale, this.cellScale);
                }
            }
        }
        requestAnimationFrame(this.render);
    }

    hover(x, y) {
        this.activeY = Math.floor(y / this.cellScale) * this.cellScale;
        this.activeX = Math.floor(x / this.cellScale) * this.cellScale;
    }

    static lerp(a, b, alpha) {
        return a + (alpha * (b - a));
    }

    index(row, column) {
        return column + (row * this.N);
    }

};