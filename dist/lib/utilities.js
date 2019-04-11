"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * ToRadians
 * @param {number}      degrees
 * @return {number}     radians
 */
function toRadians(degrees) {
    return degrees * Math.PI / 180;
}
exports.toRadians = toRadians;
/**
 * ToDegrees
 * @param {number}      radians
 * @return {number}     degrees
 */
function toDegrees(radians) {
    return radians * 180 / Math.PI;
}
exports.toDegrees = toDegrees;
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
function conicSag(x, r0, p) {
    const sag = (r0 - Math.sqrt(r0 ** 2 - (p * x ** 2))) / p;
    return sag;
}
exports.conicSag = conicSag;
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
function circularSag(x, radius) {
    // Circular Sag
    // degenerate Baker's Equation for circles (p = 1)
    const sag = radius - Math.sqrt(radius ** 2 - x ** 2);
    return sag;
}
exports.circularSag = circularSag;
/**
 * shapeFromEcc
 *
 * Compute the conic shape factor p from eccentricity
 *
 * @param {number}      e          eccentricity
 *
 * @return {number}     shape factor p
 */
function shapeFromEcc(e) {
    return 1 - e ** 2;
}
exports.shapeFromEcc = shapeFromEcc;
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
function eccFromShape(p) {
    return Math.sqrt(1 - p);
}
exports.eccFromShape = eccFromShape;
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
function convertDTomm(diopters) {
    return 337.5 / diopters;
}
exports.convertDTomm = convertDTomm;
/**
 * convertmmToD
 *
 * convert millimeters to Diopters
 *
 * @param {number}      millimeters (mm)
 *
 * @return {number}     diopters (D)
 */
function convertmmToD(millimeters) {
    return 337.5 / millimeters;
}
exports.convertmmToD = convertmmToD;
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
function getInputmm(mmOrD) {
    if (mmOrD < 20) {
        return mmOrD;
    }
    else {
        return convertDTomm(mmOrD);
    }
}
exports.getInputmm = getInputmm;
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
function getInputD(mmOrD) {
    if (mmOrD < 20) {
        return convertmmToD(mmOrD);
    }
    else {
        return mmOrD;
    }
}
exports.getInputD = getInputD;
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
function solveCircleRadiusOnYAxis(a, b) {
    const cy = (a.x ** 2 - b.x ** 2 - b.y ** 2 + a.y ** 2) / (2 * (a.y - b.y));
    const r = Math.sqrt((a.x ** 2) + ((a.y - cy) ** 2));
    return r;
}
exports.solveCircleRadiusOnYAxis = solveCircleRadiusOnYAxis;
//# sourceMappingURL=utilities.js.map