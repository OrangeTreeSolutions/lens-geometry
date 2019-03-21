"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LensCurve_1 = require("../LensCurve");
const utilities_1 = require("../utilities");
class TangentConvexTorus extends LensCurve_1.LensCurve {
    /**
     * TangentConvexTorus constructor
     *
     * Create a segment of a circle with specified width, where the circle has specified radius, and is tangent
     * to the specified angle at startX. If the tangent line is thought of as a descending line, the circle is positioned above
     * it and is therefore a convex curve on a lens profile. It's called a torus because if you rotated the circle around the lens
     * axis you would get a torus. Typically used as a peripheral curve for edge lift, connecting smoothly from the previous zone.
     *
     * @param angle [0..90) angle in degrees relative to the horizontal (where a horizontal line is 0 degrees)
     * @param width horizontal width of the circle 'curve'
     */
    constructor(tangent, radius, width) {
        super(width);
        this.xOffset = 0;
        this.zOffset = 0;
        this.radius = radius;
        this.tangent = tangent;
        this.recalculateInternalParameters();
    }
    height(x) {
        let height = -utilities_1.circularSag(x - this.xOffset, this.radius);
        height = height - this.zOffset + this.startz;
        return height;
    }
    recalculateInternalParameters() {
        // originally was cos(90-tangent) but that's equivalent to cos(tangent)
        // torus x is negative relative to the axis of the circle used for the torus
        // and the sag itself is negative because we're looking at the bottom of the circle
        const torusx = this.radius * Math.sin(utilities_1.toRadians(this.tangent));
        this.zOffset = -utilities_1.circularSag(-torusx, this.radius);
        // finally translate relative to startX
        this.xOffset = this.startx + torusx;
    }
}
exports.TangentConvexTorus = TangentConvexTorus;
//# sourceMappingURL=TangentConvexTorus.js.map