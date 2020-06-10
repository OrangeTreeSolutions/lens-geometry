/**
 * ToRadians
 * @param {number}      degrees
 * @return {number}     radians
 */
export function toRadians(degrees: number): number {
    return degrees * Math.PI / 180;
}

/**
 * ToDegrees
 * @param {number}      radians
 * @return {number}     degrees
 */
export function toDegrees(radians: number): number {
    return radians * 180 / Math.PI;
}

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
export function conicSag(x: number, r0: number, p: number): number {
    const sag = (r0 - Math.sqrt(r0 ** 2 - (p * x ** 2))) / p;
    return sag;
}

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
export function circularSag(x: number, radius: number): number {
    // Circular Sag
    // degenerate Baker's Equation for circles (p = 1)
    const sag = radius - Math.sqrt(radius ** 2 - x ** 2);
    return sag;
}

/**
 * shapeFromR0AndXY
 *
 * Solve the Shape parameter p of an ellipse given {x,y} points, and the apical radius.
 *
 * Compute using Baker's Equation for Conic section
 * given r0, {x, y}
 * ref: Contact Lens Optics and Lens Design -- DW Douthwaite pp92-93.
 *
 * @param {number}   r0  apical radius
 * @param {number}   x   sag
 * @param {number}   y   semi-chord
 *
 * @return {number} shape parameter p
 */
export function shapeFromR0AndXY(r0: number, x: number, y: number): number {
    const p = ((2 * r0 * x) - (y ** 2)) / (x ** 2);
    return p;
}

/**
 * shapeFromEcc
 *
 * Compute the conic shape factor p from eccentricity
 *
 * @param {number}      e          eccentricity
 *
 * @return {number}     shape factor p
 */
export function shapeFromEcc(e: number): number {
    return 1 - e ** 2;
}

/**
 * eccFromShape
 *
 * Compute the conic eccentricity from conic shape factor p.
 * for p <= 1. If p > 1 (oblate ellipse) you can't compute e this way.
 *
 * @param {number}      p shape factor p
 *
 * @return {number}     eccentricity
 */
export function eccFromShape(p: number): number {
    return Math.sqrt(1 - p);
}

// UNTESTED
//
// /**
//  * ParabolicSag
//  *
//  * Compute the sag height of a parabola at a particular semi chord.
//  *
//  * @param {number}      x          semi chord.
//  * @param {number}      radius     radius.
//  *
//  * @return {number}     sag height.
//  */
// function ParabolicSag(x: number, radius: number): number {
//     // Parabolic Sag
//     // degenerate Baker's Equation for parabola (p = 0)
//     const sag = x ** 2 / (2 * radius);
//     return sag;
// }

/**
 * convertDTomm
 *
 * convert diopters to millimeters
 *
 * @param {number}      diopters (D)
 *
 * @return {number}     millimeters (mm)
 */
export function convertDTomm(diopters: number): number {
    return 337.5 / diopters;
}

/**
 * convertmmToD
 *
 * convert millimeters to Diopters
 *
 * @param {number}      millimeters (mm)
 *
 * @return {number}     diopters (D)
 */
export function convertmmToD(millimeters: number): number {
    return 337.5 / millimeters;
}

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
export function getInputmm(mmOrD: number): number {
    if (mmOrD < 20) {
        return mmOrD;
    }
    else {
        return convertDTomm(mmOrD);
    }
}

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
export function getInputD(mmOrD: number): number {
    if (mmOrD < 20) {
        return convertmmToD(mmOrD);
    }
    else {
        return mmOrD;
    }
}

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
export function solveCircleRadiusOnYAxis(a: { x: number, y: number }, b: { x: number, y: number }): number {
    const cy = (a.x ** 2 - b.x ** 2 - b.y ** 2 + a.y ** 2) / (2 * (a.y - b.y));
    const r = Math.sqrt((a.x ** 2) + ((a.y - cy) ** 2));
    return r;
}
