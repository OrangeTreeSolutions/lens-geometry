/**
 * LensCurve class
 *
 * Class representing curve segments used to construct lens profiles.
 */
export abstract class LensCurve {

    // Note: each curve must have height(startX) = startZ

    private _startx: number;
    private _startz: number;
    private _endx: number;
    private _width: number;

    get startx() { return this._startx; }
    get startz() { return this._startz; }
    get endx() { return this._endx; }
    get endz() { return this.height(this._endx); }
    get width() { return this._width; }

    constructor(width: number, startx?: number, startz?: number) {
        this._startx = startx || 0;
        this._startz = startz || 0;
        this._width = width;
        this._endx = this.startx + this.width;
    }

    /**
     * resize
     *
     * Change the width of a curve
     *
     * **internal** use only
     *
     * @param {number} newWidth new curve width
     */
    public resize(newWidth: number) {
        this._width = newWidth;
        this._endx = this._startx + this._width;
        this.recalculateInternalParameters();
    }

    /**
     * translateToX
     *
     * Set the curve starting X point
     *
     * **internal** use only
     *
     * @param {number}      newStartZ height
     */
    public translateToX(newStartX: number) {
        this._startx = newStartX;
        this._endx = this._startx + this._width;
        this.recalculateInternalParameters();
    }

    /**
     * translateToZ
     *
     * Set the curve starting Z point.
     *
     * **internal** use only
     *
     * @param {number}      newStartZ height
     */
    public translateToZ(newStartZ: number) {
        this._startz = newStartZ;
        this.recalculateInternalParameters();
    }

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
    public abstract height(x: number): number;

    /**
     * recalculateInternalParameters
     *
     * When the curve position or width is changed, some curve types need to recalulcate internal parameters
     */
    protected abstract recalculateInternalParameters(): void;  // this should be called whenever the startx/endx/width/ parameters are adjusted
}
