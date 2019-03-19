export declare abstract class LensCurve {
    private _startx;
    private _endx;
    private _width;
    private _zoneHeightOffset;
    readonly startx: number;
    readonly endx: number;
    readonly width: number;
    readonly zoneHeightOffset: number;
    constructor(startx: number, width: number, zoneHeightOffset: number);
    /**
     * resize
     *
     * Change the width of a curve
     *
     * @param {number} newWidth new curve width
     */
    resize(newWidth: number): void;
    /**
     * translateToX
     *
     * Set the curve starting X point
     *
     * @param {number}      newStartZ height
     */
    translateToX(newStartX: number): void;
    /**
     * translateToZ
     *
     * Set the curve starting Z point
     *
     * @param {number}      newStartZ height
     */
    translateToZ(newStartZ: number): void;
    /**
     * height
     *
     * Compute the height of the curve at a particular point.
     *
     * @param {number}      x distance from lens center
     *
     * @return {number}     sag height.
     */
    abstract height(x: number): number;
    /**
     * recalculateInternalParameters
     *
     * When the curve position or width is changed, some curve types need to recalulcate internal parameters
     */
    protected abstract recalculateInternalParameters(): void;
}
