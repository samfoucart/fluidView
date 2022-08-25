import { FluidSolverView } from "./newFluidSolver";

test('Zero Array', () => {
    let testArray: number[] = [];
    let size: number = 5;
    let fluidView: FluidSolverView = new FluidSolverView(null, null);
    fluidView.zeroArray(testArray, size);

    for (let i: number = 0; i < size * size; i++) {
        expect(testArray[i]).toEqual(0);
    }
});

test('Diffuse single point', () => {
    let currentDensity: number[] = [0, 0, 0, 0, 0,
                                    0, 0, 0, 0, 0,
                                    0, 0, 1, 0, 0,
                                    0, 0, 0, 0, 0,
                                    0, 0, 0, 0, 0,];

    

    let nextDensity: number[] = [];

    let size: number = 5;
    let fluidView: FluidSolverView = new FluidSolverView(null, null);

    fluidView.zeroArray(nextDensity, size);

    fluidView.diffuse(size, currentDensity, nextDensity, 1, 1, 100);
});

test('Diffuse complex array', () => {
    let currentDensity: number[] = [1, 3, 5, 3, 1,
                                    3, 5, 7, 5, 3,
                                    5, 7, 9, 7, 5,
                                    3, 5, 7, 5, 3,
                                    1, 3, 5, 3, 1,];

    let expectedDensity: number[] = [1.2204, 3.0196, 4.5136, 3.4387, 1.658,
                                    2.7433, 4.7646,	6.2114, 4.8248, 2.8055,
                                    3.9614,	6.1424,	7.5885,	6.1424,	3.9614,
                                    2.8055,	4.8248,	6.2114,	4.7646,	2.7433,
                                    1.658,	3.4387,	4.5136,	3.0196,	1.2204,];

    let nextDensity: number[] = [];

    let size: number = 5;
    let fluidView: FluidSolverView = new FluidSolverView(null, null);

    fluidView.zeroArray(nextDensity, size);

    fluidView.diffuse(size, currentDensity, nextDensity, 1, 1, 10000);

    for (let i: number = 0; i < size * size; i++) {
        expect(expectedDensity[i] - nextDensity[i]).toBeCloseTo(0, 0);
    }
});