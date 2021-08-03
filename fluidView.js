class FluidView {
    constructor(size, dt, diffusion, viscosity) {
        this.N = size;
        this.dt = dt;
        this.diffusion = diffusion;
        this.viscosity = viscosity;

        this.s = new Array(N * N);
        this.density = new Array(N * N);

        this.Vx = new Array(N * N);
        this.Vy = new Array(N * N);

        this.Vx0 = new Array(N * N);
        this.Vy0 = new Array(N * N);
    }
};