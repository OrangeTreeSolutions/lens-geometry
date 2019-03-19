import { LensCurve } from "../LensCurve";
export declare class TangentConvexTorus extends LensCurve {
    private radius;
    private tangent;
    private xOffset;
    private zOffset;
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
    constructor(tangent: number, radius: number, width: number);
    height(x: number): number;
    protected recalculateInternalParameters(): void;
}
