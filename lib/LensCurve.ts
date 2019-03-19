export abstract class LensCurve {

    // each curve must have height(0) = 0
    // then for each curve, we translate it relative to the origin
    // for several curve shapes, we want the selected curve segment relative to the lens axis origin (e.g. typical circular or conic)

    private _startx: number;
    private _startz: number;
    private _endx: number;
    private _width: number;

    get startx() { return this._startx; }
    get startz() { return this._startz; }
    get endx() { return this._endx; }
    get endz() { return this.height(this._endx); }
    get width() { return this._width; }

    constructor(startx: number, width: number, zoneHeightOffset: number) {
        this._startx = startx;
        this._width = width;
        this._endx = this.startx + this.width;
        this._startz = zoneHeightOffset;
    }

    /**
     * resize
     *
     * Change the width of a curve
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
     * Set the curve starting Z point
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
