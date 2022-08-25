type vector2d = {
    x: number,
    y: number,
}

export class FluidSolverView {
    private size: number;
    private timeStep: number;
    private diffusionConstant: number;
    private viscosity: number;
    private gaussSeidelIterations: number;

    private sourceDensity: number[];
    private density: number[];

    private sourceVelocity: vector2d[];
    private velocity: vector2d[];

    private activeCell: vector2d;
    private cellScale: number;

    private webGLCanvas: HTMLCanvasElement | null;
    private webGLContext: CanvasRenderingContext2D | null;


    constructor(webGLCanvas: HTMLCanvasElement | null, webGLContext: CanvasRenderingContext2D | null) {
        this.size = 64;
        this.timeStep = 1;
        this.diffusionConstant = 1;
        this.viscosity = 1;
        this.gaussSeidelIterations = 20;

        this.sourceDensity = [];
        this.density = [];
        this.sourceVelocity = [];
        this.velocity = [];

        this.activeCell = {x: -1, y: -1};
        this.cellScale = 1;

        //this.webGLCanvas = document.getElementById("WebGL-canvas") as HTMLCanvasElement;
        this.webGLCanvas = webGLCanvas;

        //this.webGLContext = this.webGLCanvas.getContext("2d");
        this.webGLContext = webGLContext;

        this.render.bind(this);
    }

    render(): void {
        if (this.webGLContext == null) {
            return;
        }
        this.webGLContext.fillStyle = "white";
        this.webGLContext.fillRect(0, 0, this.size * this.cellScale, this.size * this.cellScale);
        for (let col: number = 0; col < this.size; col++) {
            for (let row: number = 0; row < this.size; row++) {
                if (row == this.activeCell.y && col == this.activeCell.x) {
                    this.webGLContext.fillStyle = "black";
                    this.webGLContext.fillRect(col * this.cellScale, row * this.cellScale, this.cellScale, this.cellScale);
                } else {
                    const brightness = FluidSolverView.lerp(255, 0, this.density[this.index(row, col, this.size)]);
                    this.webGLContext.fillStyle = `rgb(${brightness}, ${brightness}, ${brightness})`;
                    this.webGLContext.fillRect(col * this.size, row * this.size, this.cellScale, this.cellScale);
                    this.webGLContext.strokeRect(col * this.size, row * this.size, this.cellScale, this.cellScale);
                }
            }
        }
        this.updateFluid();
        requestAnimationFrame(this.render);
    }

    updateFluid() {
        let nextDensity: number[] = [];
        this.diffuse(this.size, this.density, nextDensity, this.diffusionConstant, this.timeStep, this.gaussSeidelIterations);
        this.density = nextDensity;
    }
    
    // 
    diffuse(size: number, current: number[], next: number[], diffusionConstant: number, timeStep: number, iterations: number): void {
        // const a: number = diffusionConstant * timeStep * size * size;
        const a: number = diffusionConstant;

        this.zeroArray(next, size);

        for (let iteration: number = 0; iteration < iterations; iteration++) {
            for (let i: number = 0; i < size; i++) {
                for (let j: number = 0; j < size; j++) {
                    let averageNext = (this.withBounding(i, j, next, size, DirectionType.TOP) +
                        this.withBounding(i, j, next, size, DirectionType.BOTTOM) +
                        this.withBounding(i, j, next, size, DirectionType.LEFT) +
                        this.withBounding(i, j, next, size, DirectionType.RIGHT)) / 4;

                    next[this.index(i, j, size)] = (current[this.index(i, j, size)] + (a * averageNext)) / (1 + a);
                }
            }
            this.setBoundary();
        }
    }

    private withBounding(i: number, j: number, values: number[], size: number, directionType: DirectionType): number {
        switch (directionType) {
            case DirectionType.TOP:
                if (i - 1 < 0) {
                    return 0;
                } else {
                    return values[this.index(i - 1, j, size)];
                }

            case DirectionType.BOTTOM:
                if (i + 1 >= size) {
                    return 0;
                } else {
                    return values[this.index(i + 1, j, size)];
                }

            case DirectionType.LEFT:
                if (j - 1 < 0) {
                    return 0;
                } else {
                    return values[this.index(i, j - 1, size)];
                }

            case DirectionType.RIGHT:
                if (j + 1 >= size) {
                    return 0;
                } else {
                    return values[this.index(i, j + 1, size)]
                }
        
            default:
                return 0;
        }
    }

    private setBoundary(): void {
        return;
    }

    public zeroArray(values: number[], size: number): void {
        for (let i: number = 0; i < size; i++) {
            for (let j: number = 0; j < size; j++) {
                values[this.index(i, j, size)] = 0;
            }
        }
    }

    private index(i: number, j: number, size: number): number {
        return j + (i * size);
    }

    static lerp(a: number, b: number, alpha: number) {
        return a + (alpha * (b - a));
    }
}

enum DirectionType {
    TOP,
    BOTTOM,
    LEFT,
    RIGHT
}