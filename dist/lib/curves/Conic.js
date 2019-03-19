"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LensCurve_1 = require("../LensCurve");
const utilities_1 = require("../utilities");
class Conic extends LensCurve_1.LensCurve {
    /**
     * Conic constructor
     *
     * The Conic curve is a curve segment sampled from a conic specified with r and p that is always centered
     * on the x-axis. If you translate the conic left or right, you are not moving the conic itself; you are just
     * changing the arc being sampled. The curve is translated vertically so that height is zero at startx.
     * This curve type is frequently used for aspheric base curves (startx=0) and aspheric peripheral curves
     * (startx > 0).
     *
     * @param radius radius of a circle centered on the x axis (x=0).
     * @param width  width of the curve segment to sample.
     */
    constructor(radius, shapeFactor, width) {
        super(width);
        this.zOffset = 0;
        this.radius = radius;
        this.shapeFactor = shapeFactor;
        this.recalculateInternalParameters();
    }
    height(x) {
        let height = utilities_1.ConicSag(x, this.radius, this.shapeFactor);
        height = height - this.zOffset + this.startz;
        return height;
    }
    recalculateInternalParameters() {
        this.zOffset = this.startx === 0 ? 0 : utilities_1.ConicSag(this.startx, this.radius, this.shapeFactor);
    }
}
exports.Conic = Conic;
//# sourceMappingURL=Conic.js.map