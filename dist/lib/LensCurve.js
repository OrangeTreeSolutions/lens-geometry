"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class LensCurve {
    get startx() { return this._startx; }
    get endx() { return this._endx; }
    get width() { return this._width; }
    get zoneHeightOffset() { return this._zoneHeightOffset; }
    constructor(startx, width, zoneHeightOffset) {
        this._startx = startx;
        this._width = width;
        this._endx = this.startx + this.width;
        this._zoneHeightOffset = zoneHeightOffset;
    }
    /**
     * resize
     *
     * Change the width of a curve
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
     * Set the curve starting Z point
     *
     * @param {number}      newStartZ height
     */
    translateToZ(newStartZ) {
        this._zoneHeightOffset = newStartZ;
        this.recalculateInternalParameters();
    }
}
exports.LensCurve = LensCurve;
//# sourceMappingURL=LensCurve.js.map