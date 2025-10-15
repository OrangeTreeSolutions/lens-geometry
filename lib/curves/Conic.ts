import { ICurveDescriptor } from "../ICurveDescriptor";
import { LensCurve } from "../LensCurve";
import { conicSag, toDegrees } from "../utilities";

export class Conic extends LensCurve {
    private radius: number;
    private shapeFactor: number;
    private zOffset = 0;

    /**
     * Conic constructor
     *
     * The Conic curve is a curve segment sampled from a conic specified with r and p that is always centered
     * on the y-axis. If you translate the conic left or right, you are not moving the conic itself; you are just
     * changing the arc being sampled. The curve is translated vertically so that height is zero at startx.
     * This curve type is frequently used for aspheric base curves (startx=0) and aspheric peripheral curves
     * (startx > 0).
     *
     * @param radius radius of a circle centered on the y axis (x=0).
     * @param width  width of the curve segment to sample.
     */
    constructor(radius: number, shapeFactor: number, width: number) {
        super(width);
        this.radius = radius;
        this.shapeFactor = shapeFactor;
        this.recalculateInternalParameters();
    }

    public height(x: number): number {
        let height: number = conicSag(x, this.radius, this.shapeFactor);
        height = height - this.zOffset + this.startz;
        return height;
    }

    protected recalculateInternalParameters(): void {
        this.zOffset = this.startx === 0 ? 0 : conicSag(this.startx, this.radius, this.shapeFactor);
    }

    public getClassName(): string {
        return "Conic";
    }

    public getCurveDescriptor(): ICurveDescriptor {
        return { name: this.getClassName(), width: this.width, radius: this.radius, shape: this.shapeFactor };
    }

    public getTangentAt(x: number): number {
        // given r (radius) and p (shape)
        // the slope of the ellipse is the 1st derivative
        // slope = (x) / (sqrt(r^2 - px^2))

        // the slope can be converted to an angle
        // atan(slope)
        const slope = x / (Math.sqrt(this.radius ** 2 - this.shapeFactor * (x ** 2)));
        return toDegrees(Math.atan(slope));
    }
}
