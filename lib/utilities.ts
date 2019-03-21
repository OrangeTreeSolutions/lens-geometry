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
 * ShapeFromE
 *
 * Compute the conic shape factor p from eccentricity
 *
 * @param {number}      e          eccentricity
 *
 * @return {number}     shape factor p
 */
export function shapeFromE(e: number) {
    return  1 - e ** 2;
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
