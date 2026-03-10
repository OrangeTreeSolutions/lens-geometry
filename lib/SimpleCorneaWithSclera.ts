import { Conic } from "./curves/Conic";
import { TangentLine } from "./curves/TangentLine";
import { LensProfile } from "./LensProfile";
import { shapeFromEcc } from "./utilities";

export class SimpleCorneaWithSclera {

    public flatMeridian: LensProfile = new LensProfile();
    public steepMeridian: LensProfile = new LensProfile();

    private diameter: number;
    private flatApicalCurvature: number;
    private steepApicalCurvature: number;
    private flatEccentricity: number;
    private steepEccentricity: number;
    private flatScleralAngle: number;
    private steepScleralAngle: number;
    private flatVID: number;
    private steepVID: number;

    constructor(diameter: number, flatApicalCurvature: number, flatEccentricity: number, flatScleralAngle: number, flatVID: number, steepApicalCurvature?: number, steepEccentricity?: number, steepScleralAngle?: number, steepVID?: number) {
        this.diameter = diameter;
        const initVID = (this.diameter <= 12) ? this.diameter : 12;

        this.flatApicalCurvature = flatApicalCurvature;
        this.flatEccentricity = flatEccentricity;
        this.flatScleralAngle = flatScleralAngle || 40;
        this.flatVID = flatVID || initVID;

        this.steepApicalCurvature = steepApicalCurvature || this.flatApicalCurvature;
        this.steepEccentricity = steepEccentricity || this.flatEccentricity;
        this.steepScleralAngle = steepScleralAngle || this.flatScleralAngle;
        this.steepVID = steepVID || this.flatVID;

        const flatShape = shapeFromEcc(this.flatEccentricity);
        const corneaFlat = new Conic(this.flatApicalCurvature, flatShape, this.flatVID);
        const scleraFlat = new TangentLine(this.flatScleralAngle, this.diameter - this.flatVID);

        this.flatMeridian.addCurve(corneaFlat);
        this.flatMeridian.addCurve(scleraFlat);

        const steepShape = shapeFromEcc(this.steepEccentricity);
        const corneaSteep = new Conic(this.steepApicalCurvature, steepShape, this.flatVID);
        const scleraSteep = new TangentLine(this.steepScleralAngle, this.diameter - this.steepVID);
        this.steepMeridian = new LensProfile();
        this.steepMeridian.addCurve(corneaSteep);
        this.steepMeridian.addCurve(scleraSteep);
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
    public sagFlat(x: number) {
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
    public sagSteep(x: number) {
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
    public generatePointsFlat(sx: number, ex: number, step: number): Array<{ x: number, z: number }> {
        return this.flatMeridian.generatePoints(sx, ex, step);
    }

    /**
     * generatePointsFlat
     *
     * generate a 2D array of points along the steep meridian from startx to endx at the given interval
     *
     * @param {number}      sx start x distance from centre
     * @param {number}      ex endx distance from centre
     * @param {number}      step x interval
     *
     * @return {number}     sag
     */
    public generatePointsSteep(sx: number, ex: number, step: number): Array<{ x: number, z: number }> {
        return this.steepMeridian.generatePoints(sx, ex, step);
    }
}
