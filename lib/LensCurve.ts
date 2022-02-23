import { Circle, Conic, shapeFromEcc, TangentConvexTorus, TangentLine } from ".";
import { ICurveDescriptor } from "./ICurveDescriptor";
import * as _ from "lodash";

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
        this._endx = _.round(this.startx + this.width, 4);
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
        this._endx = _.round(this._startx + this._width, 4);
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
     * getTangentAt
     *
     * Compute the tangent of the curve at a particular point.
     *
     * @param {number}      x distance to sample
     * @return {number}     tangent value
     */
    public abstract getTangentAt(x: number): number;

    /**
     * recalculateInternalParameters
     *
     * When the curve position or width is changed, some curve types need to recalulcate internal parameters
     */
    protected abstract recalculateInternalParameters(): void;  // this should be called whenever the startx/endx/width/ parameters are adjusted

    /**
     * getClassName
     *
     * Returns the class name as a string
     *
     * @return {string}     class name
     */
    public abstract getClassName(): string;


    /**
     * getCurveDescriptor
     *
     * Return a simple object that describes the curve
     *
     * @return {ICurveDescriptor}     curve descriptor object
     */
    public abstract getCurveDescriptor(): ICurveDescriptor;

    /**
     * fromDescriptor
     *
     * Return a lens curve from a ICurveDescriptor
     *
     * @return {LensCurve}          curve described by descriptor
     */
    public static fromDescriptor(descriptor: ICurveDescriptor): LensCurve {
        const p = descriptor;
        if (p.name === "Circle") {
            if (p.radius === undefined) {
                throw new Error("Missing Radius");
            }
            return new Circle(p.radius, p.width);
        }
        if (p.name === "Conic") {
            if (p.radius === undefined) {
                throw new Error("Missing Radius");
            }
            if (p.shape === undefined && p.ecc === undefined) {
                throw new Error("Missing Shape or Ecc");
            }
            if (p.shape) {
                return new Conic(p.radius, p.shape, p.width);
            }
            if (p.ecc) {
                return new Conic(p.radius, shapeFromEcc(p.ecc), p.width);
            }
        }
        if (p.name === "TangentConvexTorus") {
            if (p.tangent === undefined) {
                throw new Error("Missing Tangent");
            }
            if (p.radius === undefined) {
                throw new Error("Missing Radius");
            }
            return new TangentConvexTorus(p.tangent, p.radius, p.width);
        }
        if (p.name === "TangentLine") {
            if (p.tangent === undefined) {
                throw new Error("Missing Tangent");
            }
            return new TangentLine(p.tangent, p.width);
        }

        throw new Error("Invalid Descriptor");
    }
}
