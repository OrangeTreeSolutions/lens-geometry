import { LensCurve } from "../LensCurve";
export declare class Conic extends LensCurve {
    private radius;
    private shapeFactor;
    private zOffset;
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
    constructor(radius: number, shapeFactor: number, width: number);
    height(x: number): number;
    protected recalculateInternalParameters(): void;
}
