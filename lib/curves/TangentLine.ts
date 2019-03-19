import {LensCurve} from "../LensCurve";
import {ToRadians} from "../utilities";

export class TangentLine extends LensCurve {
    private angle: number;      // from Horizontal in Degrees
    private gradient: number;   // line slope

    /**
     * TangentLine constructor
     *
     * create a line 'curve' tangent to the specified angle, with specified width. The angle is relative to the
     * horizontal. The typical use is to create a descending line at given angle.
     *
     * @param angle [0..90) angle in degrees relative to the horizontal (a horizontal line is 0 degrees, )
     * @param width horizontal width of the line 'curve'
     */
    constructor(angle: number, width: number) {
        super(width);
        if (angle < 0 || angle >= 90) {
            throw new Error("Angle out of Range");
        }
        this.angle = angle;
        this.gradient = Math.tan(ToRadians(this.angle));
    }

    public height(x: number): number {
        const zoneX = (x - this.startx);
        const lineSag = (zoneX) * this.gradient;
        return this.startz + lineSag;
    }

    protected recalculateInternalParameters(): void {
        // do nothing
    }
}
