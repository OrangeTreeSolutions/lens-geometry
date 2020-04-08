/**
 * LensCurve class
 *
 * Class representing curve segments used to construct lens profiles.
 */
export declare abstract class LensCurve {
    private _startx;
    private _startz;
    private _endx;
    private _width;
    get startx(): number;
    get startz(): number;
    get endx(): number;
    get endz(): number;
    get width(): number;
    constructor(width: number, startx?: number, startz?: number);
    /**
     * resize
     *
     * Change the width of a curve
     *
     * **internal** use only
     *
     * @param {number} newWidth new curve width
     */
    resize(newWidth: number): void;
    /**
     * translateToX
     *
     * Set the curve starting X point
     *
     * **internal** use only
     *
     * @param {number}      newStartZ height
     */
    translateToX(newStartX: number): void;
    /**
     * translateToZ
     *
     * Set the curve starting Z point.
     *
     * **internal** use only
     *
     * @param {number}      newStartZ height
     */
    translateToZ(newStartZ: number): void;
    /**
     * height
     *
     * Compute the height of the curve at a particular point.
     *
     * **warning** the individual curves do not do bounds checking on x; it is up to you to
     * make sure you are asking for values on the defined area.
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
