function main() {
    let webGLCanvas = document.getElementById("WebGL-canvas") as HTMLCanvasElement;
    let webGLContext = webGLCanvas.getContext("2d");
    if (!webGLContext) {
        return;
    }
    webGLCanvas.width = 1024;
    webGLCanvas.height = 1024;
    let cellScale = 8;
    let numCells = 64;

    let fluidView = new FluidSolverView(webGLCanvas, webGLContext);
    fluidView.render();
}

type vector2d = {
    x: number,
    y: number,
}

type index2d = {
    i: number,
    j: number
}

class FluidSolverView {
    private size: number;
    private timeStep: number;
    private diffusionConstant: number;
    private viscosity: number;
    private gaussSeidelIterations: number;

    private sourceDensity: number[];
    private density: number[];

    private sourceVelocity: vector2d[];
    private velocity: vector2d[];

    private activeCell: index2d;
    private cellScale: number;

    private webGLCanvas: HTMLCanvasElement | null;
    private webGLContext: CanvasRenderingContext2D | null;

    private lastFrameTime: number;
    private frameTime: number;

    constructor(webGLCanvas: HTMLCanvasElement | null, webGLContext: CanvasRenderingContext2D | null) {
        this.size = 10;
        this.timeStep = 1;
        this.diffusionConstant = 1 / 2;
        this.viscosity = 1;
        this.gaussSeidelIterations = 20;

        this.sourceDensity = [];
        this.zeroArray(this.sourceDensity, this.size);
        this.density = [];
        this.zeroArray(this.density, this.size);
        // this.density = [1, 3, 5, 3, 1, 1, 3, 5, 3, 1,
        //                 3, 5, 7, 5, 3, 3, 5, 7, 5, 3,
        //                 5, 7, 9, 7, 5, 5, 7, 9, 7, 5,
        //                 3, 5, 7, 5, 3, 3, 5, 7, 5, 3,
        //                 1, 3, 5, 3, 1, 1, 3, 5, 3, 1,
        //                 1, 3, 5, 3, 1, 1, 3, 5, 3, 1,
        //                 3, 5, 7, 5, 3, 3, 5, 7, 5, 3,
        //                 5, 7, 9, 7, 5, 5, 7, 9, 7, 5,
        //                 3, 5, 7, 5, 3, 3, 5, 7, 5, 3,
        //                 1, 3, 5, 3, 1, 1, 3, 5, 3, 1,];

        this.density = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 10, 10, 0, 0, 0, 0,
                        0, 0, 0, 0, 10, 10, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,   ];

        this.sourceVelocity = [];
        this.zeroVectorArray(this.sourceVelocity, this.size);
        this.velocity = [];
        this.zeroVectorArray(this.velocity, this.size);
        // this.velocity[0] = {x: 15, y: 15};
        // this.velocity[1] = {x: -15, y: 15};
        // this.velocity[2] = {x: 15, y: -15};
        // this.velocity[3] = {x: -15, y: -15};
        this.rightVectorArray(this.velocity, this.size);

        this.activeCell = {i: -1, j: -1};
        this.cellScale = 64;

        //this.webGLCanvas = document.getElementById("WebGL-canvas") as HTMLCanvasElement;
        this.webGLCanvas = webGLCanvas;

        //this.webGLContext = this.webGLCanvas.getContext("2d");
        this.webGLContext = webGLContext;

        if (this.webGLCanvas && this.webGLContext) {
            this.mouseMove = this.mouseMove.bind(this);
            this.webGLCanvas.addEventListener('mousemove', this.mouseMove);
        }

        this.lastFrameTime = Date.now();
        this.frameTime = 1 / 60;
        this.render = this.render.bind(this);
    }

    render(): void {
        const now: number = Date.now();
        if (now - this.lastFrameTime > this.frameTime * 1000) {
            //console.log(`fps: ${1000 / (now - this.lastFrameTime)}`);
            this.timeStep = (now - this.lastFrameTime) / 1000;
            this.lastFrameTime = now;

            if (!this || !this.webGLContext) {
                console.log(`webglcontext null or undefined`);
                return;
            }

            this.webGLContext.fillStyle = "white";
            this.webGLContext.fillRect(0, 0, this.size * this.cellScale, this.size * this.cellScale);
            for (let col: number = 0; col < this.size; col++) {
                for (let row: number = 0; row < this.size; row++) {
                    if (row == this.activeCell.i && col == this.activeCell.j) {
                        this.webGLContext.fillStyle = "black";
                        this.webGLContext.fillRect(col * this.cellScale, row * this.cellScale, this.cellScale, this.cellScale);
                    } else {
                        // Draw Density
                        //const brightness = FluidSolverView.lerp(255, 0, this.density[this.index(row, col, this.size)]);
                        const brightness = Math.max(Math.min(this.density[this.index(row, col, this.size)], 255), 0);
                        //const brightness = this.density[this.index(row, col, this.size)];
                        this.webGLContext.fillStyle = `rgb(${255 - (brightness * 20)}, ${255 - (brightness * 5)}, ${255 - brightness})`;
                        this.webGLContext.fillRect(col * this.cellScale, row * this.cellScale, this.cellScale, this.cellScale);
                        this.webGLContext.strokeRect(col * this.cellScale, row * this.cellScale, this.cellScale, this.cellScale);

                        // Draw Velocity
                        const center: vector2d = {x: (col * this.cellScale) + (this.cellScale / 2), y: (row * this.cellScale) + (this.cellScale / 2)};
                        const norm: number = Math.sqrt(Math.pow(this.velocity[this.index(row, col, this.size)].x, 2) + Math.pow(this.velocity[this.index(row, col, this.size)].y, 2));
                        
                        let normedVelocity: vector2d;
                        if (norm < .0000001 && norm > -.0000001) {
                            normedVelocity = {x: 0, y: 0}
                        } else {
                            normedVelocity = {
                                x: this.velocity[this.index(row, col, this.size)].x / norm,
                                y: this.velocity[this.index(row, col, this.size)].y / norm
                            }
                        }

                        const endPoint: vector2d = {
                            x: center.x + (normedVelocity.x * this.cellScale / 4),
                            y: center.y + (normedVelocity.y * this.cellScale / 4)
                        }

                        this.webGLContext.beginPath();
                        this.webGLContext.moveTo(center.x, center.y);
                        this.webGLContext.lineTo(endPoint.x, endPoint.y);
                        this.webGLContext.stroke();
                    }
                }
            }
            this.updateFluid(this.timeStep);
        }
        requestAnimationFrame(this.render);
    }

    updateFluid(timeStep: number) {
        let nextDensity: number[] = [];
        this.diffuse(this.size, this.density, nextDensity, this.diffusionConstant, timeStep, this.gaussSeidelIterations);
        this.density = nextDensity;
        nextDensity = new Array<number>();
        this.advect(this.size, this.density, nextDensity, this.velocity, timeStep);
        this.density = nextDensity;
    }
    
    diffuse(size: number, current: number[], next: number[], diffusionConstant: number, timeStep: number, iterations: number): void {
        // const a: number = diffusionConstant * timeStep * size * size;
        const a: number = diffusionConstant * timeStep;

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

    advect(size: number, current: number[], next: number[], velocity: vector2d[], timeStep: number): void {
        this.zeroArray(next, size);

        for (let i: number = 0; i < size; i++) {
            for (let j: number = 0; j < size; j++) {
                // let f = (x,y) - dt*v[x,y]
                let rewind: vector2d = {
                    x: j - (timeStep * velocity[this.index(i, j, size)].x), 
                    y: i - (timeStep * velocity[this.index(i, j, size)].y)
                };

                // Bounds Checking
                if (rewind.x < 0) {
                    rewind.x = 0;
                }

                if (rewind.y < 0) {
                    rewind.y = 0;
                }

                if (rewind.x > this.size - 2) {
                    rewind.x = this.size - 2;
                }

                if (rewind.y > this.size - 2) {
                    rewind.y = this.size - 2;
                }

                // Get the locations of the 4 density cells
                const rewindLeft: number = Math.floor(rewind.x);
                const rewindRight: number = rewindLeft + 1;
                const rewindTop: number = Math.floor(rewind.y);
                const rewindBottom: number = rewindTop + 1;

                // Get the fractional distance between the density cells for linearly interpolating between densities
                const xLerpAmount: number = rewind.x - rewindLeft;
                const yLerpAmount: number = rewind.y - rewindTop;

                // Linearly interpolate between densities based off of how close the expected rewound point is to each density
                const topLerp: number = FluidSolverView.lerp(current[this.index(rewindTop, rewindLeft, size)], 
                    current[this.index(rewindTop, rewindRight, size)], 
                    xLerpAmount);

                const bottomLerp: number = FluidSolverView.lerp(current[this.index(rewindBottom, rewindLeft, size)], 
                    current[this.index(rewindBottom, rewindRight, size)], 
                    xLerpAmount);

                const result: number = FluidSolverView.lerp(topLerp, bottomLerp, yLerpAmount);
                
                next[this.index(i, j, size)] = result;
            }
        }
        this.setBoundary()
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

    public zeroVectorArray(values: vector2d[], size: number): void {
        for (let i: number = 0; i < size; i++) {
            for (let j: number = 0; j < size; j++) {
                values[this.index(i, j, size)] = {x: 0, y: 0}
            }
        }
    }

    public rightVectorArray(values: vector2d[], size: number): void {
        for (let i: number = 0; i < size; i++) {
            for (let j: number = 0; j < size; j++) {
                //values[this.index(i, j, size)] = {x: Math.abs(j - (size / 2)) * 5, y: Math.abs(i - (size / 2)) * 5}
                values[this.index(i, j, size)] = {x: -.5, y: -1};
            }
        }
    }

    public mouseMove(event: MouseEvent): void {
        //console.log(`x: ${event.offsetX}, y: ${event.offsetY}`);
        const location = this.toIndex(event);
        this.activeCell.i = location.i;
        this.activeCell.j = location.j;
    }

    public toIndex(event: MouseEvent): index2d {
        const i = Math.floor(event.offsetY / this.cellScale);
        const j = Math.floor(event.offsetX / this.cellScale);
        return {i, j};
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

main();