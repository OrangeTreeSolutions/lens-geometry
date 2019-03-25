/**
 * ToRadians
 * @param {number}      degrees
 * @return {number}     radians
 */
export declare function toRadians(degrees: number): number;
/**
 * ToDegrees
 * @param {number}      radians
 * @return {number}     degrees
 */
export declare function toDegrees(radians: number): number;
/**
 * ConicSag
 *
 * Compute the sag height of a conic section at a particular semi chord.
 *
 * Compute using Baker's Equation for Conic section
 * given semichord x, apical curvature r0, and shape factor p
 * ref: Contact Lens Optics and Lens Design -- DW Douthwaite pp92-93.
 *
 * @param {number}      x       semi chord.
 * @param {number}      r0      apical curvature (radius).
 * @param {number}      p       shape factor p.
 *
 * @return {number}     sag height.
 */
export declare function conicSag(x: number, r0: number, p: number): number;
/**
 * CircularSag
 *
 * Compute the sag height of a circle at a particular semi chord.
 *
 * @param {number}      x          semi chord.
 * @param {number}      radius     radius.
 *
 * @return {number}     sag height.
 */
export declare function circularSag(x: number, radius: number): number;
/**
 * ShapeFromE
 *
 * Compute the conic shape factor p from eccentricity
 *
 * @param {number}      e          eccentricity
 *
 * @return {number}     shape factor p
 */
export declare function shapeFromE(e: number): number;
/**
 * convertDTomm
 *
 * convert diopters to millimeters
 *
 * @param {number}      diopters (D)
 *
 * @return {number}     millimeters (mm)
 */
export declare function convertDTomm(diopters: number): number;
/**
 * convertmmToD
 *
 * convert millimeters to Diopters
 *
 * @param {number}      millimeters (mm)
 *
 * @return {number}     diopters (D)
 */
export declare function convertmmToD(millimeters: number): number;
/**
 * getInputmm
 *
 * utility to get mm from an input that takes both mm and D inputs
 *
 * if the input < 20 then it is assumed to be in mm; otherwise it is assumed to be in D and converted to mm.
 *
 * @param {number}      mmOrD value in mm or D
 *
 * @return {number}     millimeters (mm)
 */
export declare function getInputmm(mmOrD: number): number;
/**
 * getInputmm
 *
 * utility to get D from an input that takes both mm and D inputs
 *
 * if the input < 20 then it is assumed to be in mm and converted to D; otherwise it is assumed to be in D.
 *
 * @param {number}      mmOrD value in mm or D
 *
 * @return {number}     diopters (D)
 */
export declare function getInputD(mmOrD: number): number;
/**
 * solveCircleRadiusOnYAxis
 *
 * Solve the Radius of a circle given two points; with the assumption the circle center c is on the y axis.
 *
 * @param {point}   a   (x,y) coordinate of point a
 * @param {point}   b   (x,y) coordinate of point b
 *
 * @return {number} radius of circle centered on the y axis (0,cy) passing through points a and b.
 */
export declare function solveCircleRadiusOnYAxis(a: {
    x: number;
    y: number;
}, b: {
    x: number;
    y: number;
}): number;
