"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * ToRadians
 * @param {number}      degrees
 * @return {number}     radians
 */
function ToRadians(degrees) {
    return degrees * Math.PI / 180;
}
exports.ToRadians = ToRadians;
/**
 * ToDegrees
 * @param {number}      radians
 * @return {number}     degrees
 */
function ToDegrees(radians) {
    return radians * 180 / Math.PI;
}
exports.ToDegrees = ToDegrees;
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
function ConicSag(x, r0, p) {
    const sag = (r0 - Math.sqrt(r0 ** 2 - (p * x ** 2))) / p;
    return sag;
}
exports.ConicSag = ConicSag;
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
function CircularSag(x, radius) {
    // Circular Sag
    // degenerate Baker's Equation for circles (p = 1)
    const sag = radius - Math.sqrt(radius ** 2 - x ** 2);
    return sag;
}
exports.CircularSag = CircularSag;
/**
 * ShapeFromE
 *
 * Compute the conic shape factor p from eccentricity
 *
 * @param {number}      e          eccentricity
 *
 * @return {number}     shape factor p
 */
function ShapeFromE(e) {
    return 1 - e ** 2;
}
exports.ShapeFromE = ShapeFromE;
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
//# sourceMappingURL=utilities.js.map