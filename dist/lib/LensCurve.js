"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * LensCurve class
 *
 * Class representing curve segments used to construct lens profiles.
 */
class LensCurve {
    get startx() { return this._startx; }
    get startz() { return this._startz; }
    get endx() { return this._endx; }
    get endz() { return this.height(this._endx); }
    get width() { return this._width; }
    constructor(width, startx, startz) {
        this._startx = startx || 0;
        this._startz = startz || 0;
        this._width = width;
        this._endx = this.startx + this.width;
    }
    /**
     * resize
     *
     * Change the width of a curve
     *
     * **internal** use only
     *
     * @param {number} newWidth new curve width
     */
    resize(newWidth) {
        this._width = newWidth;
        this._endx = this._startx + this._width;
        this.recalculateInternalParameters();
    }
    /**
     * translateToX
     *
     * Set the curve starting X point
     *
     * **internal** use only
     *
     * @param {number}      newStartZ height
     */
    translateToX(newStartX) {
        this._startx = newStartX;
        this._endx = this._startx + this._width;
        this.recalculateInternalParameters();
    }
    /**
     * translateToZ
     *
     * Set the curve starting Z point.
     *
     * **internal** use only
     *
     * @param {number}      newStartZ height
     */
    translateToZ(newStartZ) {
        this._startz = newStartZ;
        this.recalculateInternalParameters();
    }
}
exports.LensCurve = LensCurve;
//# sourceMappingURL=LensCurve.js.map