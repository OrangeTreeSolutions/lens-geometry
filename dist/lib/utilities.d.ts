/**
 * ToRadians
 * @param {number}      degrees
 * @return {number}     radians
 */
export declare function ToRadians(degrees: number): number;
/**
 * ToDegrees
 * @param {number}      radians
 * @return {number}     degrees
 */
export declare function ToDegrees(radians: number): number;
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
export declare function ConicSag(x: number, r0: number, p: number): number;
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
export declare function CircularSag(x: number, radius: number): number;
/**
 * ShapeFromE
 *
 * Compute the conic shape factor p from eccentricity
 *
 * @param {number}      e          eccentricity
 *
 * @return {number}     shape factor p
 */
export declare function ShapeFromE(e: number): number;
