"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LensCurve_1 = require("../LensCurve");
const utilities_1 = require("../utilities");
class Circle extends LensCurve_1.LensCurve {
    /**
     * Circle constructor
     *
     * The Circle curve is a curve segment sampled from a circle that is always centered on the x-axis. If you
     * translate the circle left or right, you are not moving the circle itself; you are just changing the arc being sampled. This curve type is
     * frequently used for spherical base curves (startx=0) and shepherical peripheral curves (startx > 0).
     *
     * @param radius radius of a circle centered on the x axis (x=0).
     * @param width  width of the curve segment to sample.
     */
    constructor(radius, width) {
        super(width);
        this.zOffset = 0;
        this.radius = radius;
        this.recalculateInternalParameters();
    }
    height(x) {
        let height = utilities_1.CircularSag(x, this.radius);
        height = this.startz + height - this.zOffset;
        return height;
    }
    recalculateInternalParameters() {
        this.zOffset = this.startx === 0 ? 0 : utilities_1.CircularSag(this.startx, this.radius);
    }
}
exports.Circle = Circle;
//# sourceMappingURL=Circle.js.map