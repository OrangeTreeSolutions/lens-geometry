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
 * getInputD
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
    const r = Math.hypot(a.x, a.y - cy);
    return r;
}


/**
 * solveEllipseRadiusOnYAxis
 *
 * @param {number} s    sag height of the arc (sag difference from start to end)
 * @param {number} p    conic shape factor p (p = 1-e^2)
 * @param {number} u    chord of the start point (start X)
 * @param {number} v    chord of the end point (end X)
 *
 * Solve for the R0 of an ellipse given a chord length, central sag, shape parameter p
 */
export function solveConicR0ForArcSag(s: number, p: number, u: number, v: number) {

    // how to use:
    // s is the desired sag height of the arc (height at v - height at u)
    // p is the shape factor (function of eccentricity for ellipse, p=1 for a circle)
    // u = start x of the aspheric arc in the lens geometry
    // v = end x of the aspheric arc in the lens geometry

    // goal: solve the aspheric radius (r0) for an arc segment that starts at chord u, and ends at chord v, and has a sag of s, given shape factor p

    // derivation:
    // given bakers conic formula
    // y^2 = prx - px^2
    //
    // solve for x (x is sag)
    // x =  (r +/- sqrt(r^2 - py^2))/p

    // we're interested in the negative root (smaller x); the larger is on the opposite side of the ellipse; therefore:
    // x = (r - sqrt(r^2 - py^2))/p

    // we have u, and v which are the 2 chords: the y's in the expression above. we also have p,
    // so we can write 2 expressions for corresponding x_1 and x_2

    // x_1 = (r - sqrt(r^2 - pu^2))/p
    // x_2 = (r - sqrt(r^2 - pv^2))/p

    // we don't know what either x_1 or x_2 are, but we know the sag between them is s therefore:
    // x_2 = x_1 + s

    // then we can rewrite the 2nd equation for x_2 in terms of x_1 as:
    // x_1     = ((r - sqrt(r^2 - pv^2))/p) - s

    // we now have both equations with the same right hand side

    // x_1     = (r - sqrt(r^2 - pu^2))/p
    // x_1     = ((r - sqrt(r^2 - pv^2))/p) - s

    // equate them
    // (r - sqrt(r^2 - pu^2) = ((r-sqrt(r^2))/p) - s

    // and solve for r
    // r = sqrt( p^2s^4 + 2ps^2u^2 + 2ps^2v^2 + u^4 - 2u^2v^2 + v^4 ) / 2s

    // PS - I also factored the two common 2ps^2* terms to 2ps^2(u^2+v^2) in the implementation

    // precomute exponents:
    const s2 = s ** 2;
    const p2 = p ** 2;
    const u2 = u ** 2;
    const v2 = v ** 2;

    const s4 = s ** 4;
    const u4 = u ** 4;
    const v4 = v ** 4;

    // evluate r0
    const r0 = Math.sqrt(p2 * s4 + 2 * p * s2 * (u2 + v2) + u4 - 2 * u2 * v2 + v4) / (2 * s);

    return r0;
}

/**
 * solveEllipseRadiusOnYAxis
 *
 * @param {number} s    sag height of the arc (sag difference from start to end)
 * @param {number} u    chord of the start point (start X)
 * @param {number} v    chord of the end point (end X)
 *
 * Solve for the R of a circle given a chord length, central sag
 */
export function solveCircleRForArcSag(s: number, u: number, v: number) {

    // how to use:
    // s is the arc sag you want
    // u = startX of the aspheric arc in the lens geometry
    // v = endX of the aspheric arc in the lens geometry

    // we want to solve the aspheric radius (r0) for an arc segment that starts at chord u, and ends at chord v, and has sag of s, given shape factor p

    // derivation:
    // see general solveConicR0ForArcSag; we just simplify for p=1

    // precomute exponents:
    const s2 = s ** 2;
    const u2 = u ** 2;
    const v2 = v ** 2;

    const s4 = s ** 4;
    const u4 = u ** 4;
    const v4 = v ** 4;

    // evluate r
    const r0 = Math.sqrt(s4 + 2 * s2 * (u2 + v2) + u4 - 2 * u2 * v2 + v4) / (2 * s);

    return r0;
}
