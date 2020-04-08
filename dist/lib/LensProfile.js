"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class LensProfile {
    constructor() {
        this.curveList = [];
    }
    /**
     * curveNumber
     *
     * Return index of curve segment that x falls into. If x is on a curve
     * boundary it will return the inner curve.
     *
     * @return {number}     curve index
     */
    curveNumber(x) {
        let zone = null;
        // what zone to poll
        for (let i = 0; i < this.curveList.length; i++) {
            if (x <= this.curveList[i].endx + LensProfile.epsilon) {
                zone = i;
                break;
            }
        }
        if (zone === null) {
            throw new Error("out of lens profile bounds");
        }
        else {
            return zone;
        }
    }
    /**
     * profileWidth
     *
     * Return width of profile ( 2 x profileWidth = lens diameter )
     *
     * @return {number}     profile width
     */
    profileWidth() {
        const finalZone = this.finalZone();
        if (finalZone) {
            return finalZone.endx;
        }
        else {
            return 0;
        }
    }
    /**
     * sag
     *
     * Return sag at distance x from centre
     *
     * @param {number}      x distance from centre
     *
     * @return {number}     sag (or height) at x
     */
    sag(x) {
        // return the sag at x
        // get curve to poll
        const curve = this.curveList[this.curveNumber(x)];
        // poll zone height
        const sag = curve.height(x);
        return sag;
    }
    /**
     * addCurve
     *
     * Adds a curve to the profile. The curve is added to the end. The new curves starting offsets are updated to
     * join it to the previous curve. The first curve is added at offset (0,0).
     *
     * @param {LensCurve} newCurve      new curve to add
     *
     */
    addCurve(newCurve) {
        const previousCurve = this.finalZone();
        if (previousCurve) {
            newCurve.translateToX(previousCurve.endx);
            newCurve.translateToZ(this.sag(previousCurve.endx));
        }
        else {
            newCurve.translateToX(0);
            newCurve.translateToZ(0);
        }
        // newCurve.endx = newCurve.startx + newCurve.width; -- handled by the set accessors now
        // newZone.recalculateInternalParameters(); -- handled by the set accessors now
        this.curveList.push(newCurve);
    }
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
    generatePoints(sx, ex, step) {
        const data = [];
        for (let i = sx; i <= ex; i += step) {
            data.push({ x: i, z: this.sag(i) });
        }
        return data;
    }
    /**
     *  getZoneEndXs
     *
     *  Returns array of each curve's endx value
     *
     *  @return {number[]}   array of endx values
     */
    getZoneEndXs() {
        const result = [];
        for (const c of this.curveList) {
            result.push(c.endx);
        }
        return result;
    }
    /**
     * sag
     *
     * Return the last curve in the profile or null
     *
     * @return {LensCurve | null}     distance from centre
     */
    finalZone() {
        return (this.curveList.length) ? this.curveList[this.curveList.length - 1] : null;
    }
}
exports.LensProfile = LensProfile;
LensProfile.epsilon = 0.00001;
//# sourceMappingURL=LensProfile.js.map