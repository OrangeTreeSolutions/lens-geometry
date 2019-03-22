"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Conic_1 = require("./curves/Conic");
const LensProfile_1 = require("./LensProfile");
const utilities_1 = require("./utilities");
class SimpleCornea {
    constructor(diameter, flatApicalCurvature, flatEccentricity, steepApicalCurvature, steepEccentricity) {
        this.flatMeridian = new LensProfile_1.LensProfile();
        this.steepMeridian = new LensProfile_1.LensProfile();
        this.diameter = diameter;
        this.flatApicalCurvature = flatApicalCurvature;
        this.flatEccentricity = flatEccentricity;
        this.steepApicalCurvature = steepApicalCurvature || flatApicalCurvature;
        this.steepEccentricity = steepEccentricity || flatEccentricity;
        this.isToric = !((steepApicalCurvature === undefined) && (steepEccentricity === undefined));
        const radius = diameter / 2;
        const flatShape = utilities_1.shapeFromE(this.flatEccentricity);
        const corneaFlat = new Conic_1.Conic(this.flatApicalCurvature, flatShape, radius);
        this.flatMeridian.addCurve(corneaFlat);
        if (this.isToric) {
            const steepShape = utilities_1.shapeFromE(this.steepEccentricity);
            const corneaSteep = new Conic_1.Conic(this.steepApicalCurvature, steepShape, radius);
            this.steepMeridian = new LensProfile_1.LensProfile();
            this.steepMeridian.addCurve(corneaSteep);
        }
    }
    /**
     * sagFlat
     *
     * return Sag along the flat meridian at x
     *
     * @param {number}      x distance from center
     *
     * @return {number}     sag
     */
    sagFlat(x) {
        return this.flatMeridian.sag(x);
    }
    /**
     * sagSteep
     *
     * return Sag along the flat meridian at x
     *
     * @param {number}      x distance from center
     *
     * @return {number}     sag
     */
    sagSteep(x) {
        return this.steepMeridian.sag(x);
    }
    /**
     * generatePointsFlat
     *
     * generate a 2D array of points along the flat meridian from startx to endx at the given interval
     *
     * @param {number}      sx start x distance from centre
     * @param {number}      ex endx distance from centre
     * @param {number}      step x interval
     *
     * @return {number}     Array<{ X: number, z: number}>
     */
    generatePointsFlat(sx, ex, step) {
        return this.flatMeridian.generatePoints(sx, ex, step);
    }
    /**
     * generatePointsSteep
     *
     * generate a 2D array of points along the steep meridian from startx to endx at the given interval
     *
     * @param {number}      sx start x distance from centre
     * @param {number}      ex endx distance from centre
     * @param {number}      step x interval
     *
     * @return {number}     sag
     */
    generatePointsSteep(sx, ex, step) {
        return this.steepMeridian.generatePoints(sx, ex, step);
    }
}
exports.SimpleCornea = SimpleCornea;
//# sourceMappingURL=SimpleCornea.js.map