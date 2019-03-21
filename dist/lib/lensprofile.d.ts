import { LensCurve } from "./index";
export declare class LensProfile {
    private static epsilon;
    private curveList;
    /**
     * curveNumber
     *
     * Return index of curve segment that x falls into. If x is on a curve
     * boundary it will return the inner curve.
     *
     * @return {number}     curve index
     */
    curveNumber(x: number): number;
    /**
     * profileWidth
     *
     * Return width of profile ( 2 x profileWidth = lens diameter )
     *
     * @return {number}     profile width
     */
    profileWidth(): number;
    /**
     * sag
     *
     * Return sag at distance x from centre
     *
     * @param {number}      x distance from centre
     *
     * @return {number}     sag (or height) at x
     */
    sag(x: number): number;
    /**
     * addCurve
     *
     * Adds a curve to the profile. The curve is added to the end. The new curves starting offsets are updated to
     * join it to the previous curve. The first curve is added at offset (0,0).
     *
     * @param {LensCurve} newCurve      new curve to add
     *
     */
    addCurve(newCurve: LensCurve): void;
    /**
     *  generatePoints
     *
     *  Returns an array of 2d points sampling the lens profile from startX to endX
     *
     * @param {number} sx                       startx point
     * @param {number} ex                       endsx point
     * @param {number} step                     x step size
     *
     * @return {Array<{x: number, y:number}>   surface points
     */
    generatePoints(sx: number, ex: number, step: number): Array<{
        x: number;
        y: number;
    }>;
    /**
     *  getZoneEndXs
     *
     *  Returns array of each curve's endx value
     *
     *  @return {number[]}   array of endx values
     */
    getZoneEndXs(): number[];
    /**
     * sag
     *
     * Return the last curve in the profile or null
     *
     * @return {LensCurve | null}     distance from centre
     */
    private finalZone;
}
