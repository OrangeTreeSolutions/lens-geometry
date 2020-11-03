import { ICurveDescriptor } from "../ICurveDescriptor";
import { LensCurve } from "../LensCurve";
import { circularSag, toDegrees } from "../utilities";

export class Circle extends LensCurve {
    private radius: number;
    private zOffset: number = 0;

    /**
     * Circle constructor
     *
     * The Circle curve is a curve segment sampled from a circle that is always centered on the x-axis. If you translate the
     * circle left or right, you are not moving the circle itself; you are just changing the arc being sampled. The curve is
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

    public getClassName(): string {
        return "Circle";
    }

    public getCurveDescriptor(): ICurveDescriptor {
        return { name: this.getClassName(), width: this.width, radius: this.radius };
    }

    public getTangentAt(x: number): number {
        // because the circle is always centered on the x-axis (at 0) we can take x directly
        // and form a trivial triangle, such that x is the one side, and r is the hypotenuse
        // and the tangent angle is the arcsine
        return toDegrees(Math.asin(x / this.radius));
    }
}
