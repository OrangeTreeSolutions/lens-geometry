import { LensProfile } from "./LensProfile";
export declare class SimpleCornea {
    flatMeridian: LensProfile;
    steepMeridian: LensProfile;
    private diameter;
    private flatApicalCurvature;
    private steepApicalCurvature;
    private flatEccentricity;
    private steepEccentricity;
    private isToric;
    constructor(diameter: number, flatApicalCurvature: number, flatEccentricity: number, steepApicalCurvature?: number, steepEccentricity?: number);
    /**
     * sagFlat
     *
     * return Sag along the flat meridian at x
     *
     * @param {number}      x distance from center
     *
     * @return {number}     sag
     */
    sagFlat(x: number): number;
    /**
     * sagSteep
     *
     * return Sag along the flat meridian at x
     *
     * @param {number}      x distance from center
     *
     * @return {number}     sag
     */
    sagSteep(x: number): number;
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
    generatePointsFlat(sx: number, ex: number, step: number): Array<{
        x: number;
        z: number;
    }>;
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
    generatePointsSteep(sx: number, ex: number, step: number): Array<{
        x: number;
        z: number;
    }>;
}
