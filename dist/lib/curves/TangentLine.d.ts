import { LensCurve } from "../LensCurve";
export declare class TangentLine extends LensCurve {
    private angle;
    private gradient;
    /**
     * TangentLine constructor
     *
     * create a line 'curve' tangent to the specified angle, with specified width. The angle is relative to the
     * horizontal. The typical use is to create a descending line at given angle.
     *
     * @param angle [0..90) angle in degrees relative to the horizontal (a horizontal line is 0 degrees, )
     * @param width horizontal width of the line 'curve'
     */
    constructor(angle: number, width: number);
    height(x: number): number;
    protected recalculateInternalParameters(): void;
}
