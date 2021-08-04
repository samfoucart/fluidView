class FluidView {
    constructor(size, dt, diffusion, viscosity, ctx, canvas, cellScale) {
        this.N = size;
        this.dt = dt;
        this.diffusion = diffusion;
        this.viscosity = viscosity;

        this.s = new Array(this.N * this.N).fill(0);
        this.density = new Float32Array(this.N * this.N);

        this.Vx = new Array(this.N * this.N).fill(0);
        this.Vy = new Array(this.N * this.N).fill(0);

        this.Vx0 = new Array(this.N * this.N).fill(0);
        this.Vy0 = new Array(this.N * this.N).fill(0);

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
                    let brightness = FluidView.lerp(255, 0, this.density[this.indexCanvas(row, col)]);
                    this.reduceDencity(col, row, .005);
                    this.ctx.fillStyle = 'rgb(' + brightness + ', ' + brightness + ', ' + brightness + ')';
                    this.ctx.fillRect(col, row, this.cellScale, this.cellScale);
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

    addDensity(x, y, amount) {
        let old = this.density[this.indexCanvas(y, x)];
        this.density[this.indexCanvas(y, x)] = Math.min(1.0, old + amount);
    }

    reduceDencity(x, y, amount) {
        let old = this.density[this.indexCanvas(y, x)];
        this.density[this.indexCanvas(y, x)] = Math.max(0.0, old - amount);
    }

    static lerp(a, b, alpha) {
        return a + (alpha * (b - a));
    }

    index(row, column) {
        return column + (row * this.N);
    }

    indexCanvas(row, column) {
        return Math.floor(column / this.cellScale) + (Math.floor(row / this.cellScale) * this.N);
    }

};