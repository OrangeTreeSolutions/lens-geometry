import { LensCurve } from "../LensCurve";
import { circularSag, toRadians } from "../utilities";

export class TangentConvexTorus extends LensCurve {
    private radius: number;         // radius of torus in mm
    private tangent: number;        // tangent angle in degrees
    private xOffset: number = 0;
    private zOffset: number = 0;

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
    constructor(tangent: number, radius: number, width: number) {
        super(width);
        this.radius = radius;
        this.tangent = tangent;
        this.recalculateInternalParameters();

    }

    public height(x: number): number {
        let height: number = -circularSag(x - this.xOffset, this.radius);
        height = height - this.zOffset + this.startz;
        return height;
    }

    protected recalculateInternalParameters(): void {
        // originally was cos(90-tangent) but that's equivalent to cos(tangent)
        // torus x is negative relative to the axis of the circle used for the torus
        // and the sag itself is negative because we're looking at the bottom of the circle
        const torusx = this.radius * Math.sin(toRadians(this.tangent));
        this.zOffset = -circularSag(-torusx, this.radius);

        // finally translate relative to startX
        this.xOffset = this.startx + torusx;
    }
}
