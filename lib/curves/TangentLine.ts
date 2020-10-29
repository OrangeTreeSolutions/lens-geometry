import { ICurveDescriptor } from "../ICurveDescriptor";
import { LensCurve } from "../LensCurve";
import { toRadians } from "../utilities";

export class TangentLine extends LensCurve {
    private tangent: number;    // from Horizontal in Degrees
    private gradient: number;   // line slope

    /**
     * TangentLine constructor
     *
     * create a line 'curve' tangent to the specified angle, with specified width. The angle is relative to the
     * horizontal. The typical use is to create a descending line at given angle.
     *
     * @param tangent [0..90) angle in degrees relative to the horizontal (a horizontal line is 0 degrees, )
     * @param width horizontal width of the line 'curve'
     */
    constructor(tangent: number, width: number) {
        super(width);
        if (tangent < 0 || tangent >= 90) {
            throw new Error("Tangent Angle out of Range");
        }
        this.tangent = tangent;
        this.gradient = Math.tan(toRadians(this.tangent));
    }

    public height(x: number): number {
        const zoneX = (x - this.startx);
        const lineSag = (zoneX) * this.gradient;
        return this.startz + lineSag;
    }

    protected recalculateInternalParameters(): void {
        // do nothing
    }

    public getClassName(): string {
        return "TangentLine";
    }

    public getCurveDescriptor(): ICurveDescriptor {
        return { name: this.getClassName(), width: this.width, tangent: this.tangent };
    }
}
