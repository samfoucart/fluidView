class FluidView {
    constructor(size, dt, diffusion, viscosity, ctx, canvas, cellScale) {
        this.N = size;
        this.dt = dt;
        this.diffusion = diffusion;
        this.viscosity = viscosity;

        this.s = new Float32Array(this.N * this.N);
        this.density = new Float32Array(this.N * this.N);

        this.Vx = new Float32Array(this.N * this.N);
        this.Vy = new Float32Array(this.N * this.N);

        this.Vx0 = new Float32Array(this.N * this.N);
        this.Vy0 = new Float32Array(this.N * this.N);

        this.ctx = ctx;
        this.canvas = canvas;

        this.cellScale = cellScale;

        this.activeY = -1;
        this.activeX = -1;

        this.render = this.render.bind(this);

        this.iterations = 20;
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
                    //this.reduceDencity(col, row, .005);
                    this.ctx.fillStyle = 'rgb(' + brightness + ', ' + brightness + ', ' + brightness + ')';
                    this.ctx.fillRect(col, row, this.cellScale, this.cellScale);
                    this.ctx.strokeRect(col, row, this.cellScale, this.cellScale);
                }
            }
        }
        this.updateFluid();
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

    updateFluid() {
        // TRY SWITCHING THE Vx0 AND Vx AND density AND s TO SEE WHAT HAPPENS
        // I THINK THE AUTHOR ACCIDENTALLY WROTE IT BACKWARDS
        this.diffuse(1, this.Vx0, this.Vx, this.viscosity, this.dt, this.iterations);
        this.diffuse(2, this.Vy0, this.Vy, this.viscosity, this.dt, this.iterations);

        this.project(this.Vx0, this.Vy0, this.Vx, this.Vy);

        this.advect(1, this.Vx, this.Vx0, this.Vx0, this.Vy0, this.dt);
        this.advect(2, this.Vy, this.Vy0, this.Vx0, this.Vy0, this.dt);

        this.project(this.Vx0, this.Vy0, this.Vx, this.Vy);

        this.diffuse(0, this.s, this.density, this.diffusion, this.dt, this.iterations);
        this.advect(0, this.density, this.s, this.Vx, this.Vy, this.dt)
    }

    diffuse (b, x, x0, diffusion, dt, iter) {
        let a = dt * diffusion * (this.N ) * (this.N);

        for (var k = 0; k < iter; ++k) {
            for (var i = 1; i < this.N - 1; ++i) {
                for (var j = 1; j < this.N - 1; ++j) {
                    x[this.index(i, j)] = (x0[this.index(i, j)] + (a * (
                                x[this.index(i-1, j)] +
                                x[this.index(i+1, j)] + 
                                x[this.index(i, j-1)] + 
                                x[this.index(i, j+1)])) / (1+4*a));
                }
            }
            //setbnd
        }
    }

    advect(b, d, d0, u, v, dt) {
        let dt0 = dt*this.N;
        for (var i = 1; i < this.N - 1; ++i ) {
            for (var j = 1; j < this.N - 1; ++j) {
                let x = i - (dt0 * u[this.index(i, j)]);
                let y = j - (dt0 * u[this.index(i, j)]);

                if (x < 0.5) {
                    x = 0.5;
                }
                if (x > this.N + .5) {
                    x = this.N + .5;
                }
                let i0 = Math.floor(x);
                let i1 = i0 + 1;
    
                if (y < .5) {
                    y = .5;
                }
                if (y > this.N + .5) {
                    y = this.N + .5;
                }
                let j0 = Math.floor(y);
                let j1 = j0 + 1;
    
                let s1 = x - i0;
                let s0 = 1 - s1;
                let t1 = y - j0;
                let t0 = 1 - t1;
    
                d[this.index(i, j)] = s0 * (t0 * d0[this.index(i0, j0)]  +
                                            t1 * d0[this.index(i0, j1)]) +
                                      s1 * (t0 * d0[this.index(i1, j0)]  +
                                            t1 * d0[this.index(i1, j1)]);    
            }
        }
        //set_bnd
    }

    project(u, v, p, div) {
        let h = 1.0 / this.N;
        for (var i = 1; i < this.N - 1; ++i) {
            for (var j = 1; j < this.N - 1; ++j) {
                div[this.index(i, j)] = -.5 * h * (u[this.index(i + 1, j)] - 
                                                    u[this.index(i - 1, j)] + 
                                                    v[this.index(i, j + 1)] - 
                                                    v[this.index(i, j - 1)]);

                p[this.index(i, j)] = 0;
            }
        }
        //setbnd

        for (var k = 0; k < this.iter; ++k) {
            for (var i = 1; i < this.N - 1; ++i) {
                for (var j = 1; j < this.N - 1; ++j) {
                    p[this.index(i, j)] = (div[this.index(i, j)] + (
                                p[this.index(i-1, j)] +
                                p[this.index(i+1, j)] + 
                                p[this.index(i, j-1)] + 
                                p[this.index(i, j+1)]) / 4);
                }
            }
            //setbnd
        }

        for (var i = 1; i < this.N - 1; ++i) {
            for (var j = 1; j < this.N - 1; ++j) {
                u[this.index(i, j)] = u[this.index(i, j)] - (.5 * (p[this.index(i+1, j)] - p[this.index(i-1, j)]) / h);
                u[this.index(i, j)] = u[this.index(i, j)] - (.5 * (p[this.index(i, j+1)] - p[this.index(i, j-1)]) / h);
            }
        }

        //setbnd
    }

};