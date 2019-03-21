"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LensCurve_1 = require("../LensCurve");
const utilities_1 = require("../utilities");
class TangentLine extends LensCurve_1.LensCurve {
    /**
     * TangentLine constructor
     *
     * create a line 'curve' tangent to the specified angle, with specified width. The angle is relative to the
     * horizontal. The typical use is to create a descending line at given angle.
     *
     * @param angle [0..90) angle in degrees relative to the horizontal (a horizontal line is 0 degrees, )
     * @param width horizontal width of the line 'curve'
     */
    constructor(angle, width) {
        super(width);
        if (angle < 0 || angle >= 90) {
            throw new Error("Angle out of Range");
        }
        this.angle = angle;
        this.gradient = Math.tan(utilities_1.toRadians(this.angle));
    }
    height(x) {
        const zoneX = (x - this.startx);
        const lineSag = (zoneX) * this.gradient;
        return this.startz + lineSag;
    }
    recalculateInternalParameters() {
        // do nothing
    }
}
exports.TangentLine = TangentLine;
//# sourceMappingURL=TangentLine.js.map