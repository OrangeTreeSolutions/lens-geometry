import {LensCurve} from "../LensCurve";
import {circularSag} from "../utilities";

export class Circle extends LensCurve {
    private radius: number;
    private zOffset: number = 0;

    /**
     * Circle constructor
     *
     * The Circle curve is a curve segment sampled from a circle that is always centered on the x-axis. If you translate the
     * conic left or right, you are not moving the conic itself; you are just changing the arc being sampled. The curve is
     * translated vertically so that height is zero at startx. This curve type is frequently used for spherical base curves (startx=0)
     * and shepherical peripheral curves (startx > 0).
     *
     * @param radius radius of a circle centered on the x axis (x=0).
     * @param width  width of the curve segment to sample.
     */
    constructor(radius: number, width: number) {
        super(width);
        this.radius = radius;
        this.recalculateInternalParameters();
    }

    public height(x: number): number {
        let height: number = circularSag(x, this.radius);
        height = this.startz + height - this.zOffset;
        return height;
    }

    protected recalculateInternalParameters(): void {
        this.zOffset = this.startx === 0 ? 0 : circularSag(this.startx, this.radius);
    }
}
