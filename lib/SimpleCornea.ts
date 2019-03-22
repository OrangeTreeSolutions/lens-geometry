import { Conic } from "./curves/Conic";
import { LensProfile} from "./LensProfile";
import { shapeFromE} from "./utilities";

export class SimpleCornea {

    public flatMeridian: LensProfile = new LensProfile();
    public steepMeridian: LensProfile = new LensProfile();

    private diameter: number;
    private flatApicalCurvature: number;
    private steepApicalCurvature: number;
    private flatEccentricity: number;
    private steepEccentricity: number;
    private isToric: boolean;

    constructor(diameter: number, flatApicalCurvature: number, flatEccentricity: number, steepApicalCurvature?: number, steepEccentricity?: number) {
        this.diameter = diameter;
        this.flatApicalCurvature = flatApicalCurvature;
        this.flatEccentricity = flatEccentricity;
        this.steepApicalCurvature = steepApicalCurvature || flatApicalCurvature;
        this.steepEccentricity = steepEccentricity || flatEccentricity;
        this.isToric = !((steepApicalCurvature === undefined) && (steepEccentricity === undefined));

        const radius = diameter / 2;

        const flatShape = shapeFromE(this.flatEccentricity);
        const corneaFlat = new Conic(this.flatApicalCurvature, flatShape, radius);
        this.flatMeridian.addCurve(corneaFlat);

        if (this.isToric) {
            const steepShape = shapeFromE(this.steepEccentricity);
            const corneaSteep = new Conic(this.steepApicalCurvature, steepShape, radius);
            this.steepMeridian = new LensProfile();
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
    public generatePointsSteep(sx: number, ex: number, step: number): Array<{ x: number, z: number }> {
        return this.steepMeridian.generatePoints(sx, ex, step);
    }
}
