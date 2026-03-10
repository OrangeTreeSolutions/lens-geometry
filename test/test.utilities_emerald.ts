/* eslint-disable no-console */
import { expect } from "chai";
import { round } from "lodash-es";
import { circularSag, solveCircleRadiusOnYAxis } from "../lib/index";


// ****************************************
// ports of emerald functions from emerald source code
// we ultimately do not end up using them

/**
* calcCarrierCurve
*/
function CalcCarrierCurve(zoneIn: number, zoneOut: number, sagZ: number): number {
    const zoneW = zoneOut - zoneIn;                                                            // width between zonein and out
    const zoneH = Math.sqrt(zoneW ** 2 + sagZ ** 2);                           // pythagoras - zone width, and sag
    const zoneU = (zoneH * (zoneIn + (zoneW / 2))) / sagZ;
    const carrier = Math.sqrt((zoneU ** 2) + ((zoneH / 2) ** 2));

    return carrier;
}

/**
*
*/
function CalcReverseCurve(BCW: number, BC: number, AC1: number, RCW: number, FlatPush: number, RCAR: number): number {
    try {
        const xA1 = BCW;                                                                               // x1 coordinate (x at end of base curve)
        const zA1 = -1 * (BC - Math.sqrt((BC ** 2) - (BCW ** 2)));                         // z1 sag of base curve at x1
        const xA2 = BCW + RCW;                                                                         // x2 coordinate (x at end of reverse curve)
        const zA2 = -1 * (AC1 - Math.sqrt((AC1 ** 2) - ((BCW + RCW) ** 2))) + FlatPush;    // sag of alignment curve projected to end of reverse curve + "flat push"
        // I expect this is the 'start z' of alignment curve 1

        const xA3 = (xA1 + xA2) / 2;                                                                   // midpoint of reverse curve
        const zA3 = (zA1 + zA2) / 2;                                                                   // midpoint of reverse curve
        const m = -1 * (xA1 - xA2) / (zA1 - zA2);                                                      // slope of line perpendicular to line connecting reverse curve
        const zA4 = zA3 - m * xA3;                                                                     // (y=mx+b) --
        const RC = Math.sqrt((xA1 ** 2) + ((zA1 - zA4) ** 2)) + RCAR;                      // reverse curve  + "adjustment" value
        // suspect we can call our own solve2point circle alg on x1,z1 / x2,z2

        return RC;
    }
    catch {
        return Number.NaN;
    }
}

/**
*
* @param FlatK -- flat K input
* @param BCD   -- base curve diameter ==>  (BOZD)
* @param irw1  -- intermediate radius width 1 => reverse curve with (RCW)
* @param Par   -- base curve radius apparently
* @returns
*/
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function GetEmeraldPush(FlatK: number, BCD: number, irw1: number, Par: number): number {
    const pushFactor = 0.0245;                                                              // magic number? source?
    let pushFull = 0;                                                                       // start at zero
    const cornRad = 337.5 / FlatK;                                                          // flatk in mm
    const zone1 = BCD / 2;                                                                  // base curve end x (rc start x)
    const zone2 = zone1 + irw1;                                                             // reverse curve end x (ac1 start x)
    const sag1 = Par - Math.sqrt((Par ** 2) - (zone1 ** 2));                                // sag of base curve at base curve end x
    let sag2 = cornRad - Math.sqrt((cornRad ** 2) - (zone2 ** 2));                          // sag of cornea at reverse curve end x
    let sagFC = sag2 - sag1;                                                                // sagFC -- difference in the 2 above sags
    const surfCorn = 2 * 3.14159 * cornRad * sag2;                                          // surface area of a cylinder the height of cornea sag at the end of the reverse curve, with the radius of the cornea
    const surfPar = 2 * 3.14159 * Par * sag1;                                               // surface area of a cylinder the height of the sag of the base curve, with the radius of the base curve
    const surfGoal = surfCorn - surfPar;                                                    // goal "surface area" is the difference between these two surface areas

    let xFC = CalcCarrierCurve(zone1, zone2, sagFC);                                        // radius of a curve that would connect the base curve end to the cornea at the end of reverse curve (ie this could be a reverse curve with 0 apical clearance)
    let sag3 = xFC - Math.sqrt((xFC ** 2) - (zone1 ** 2));                                  // sag of xFC at base curve end x
    let sag4 = xFC - Math.sqrt((xFC ** 2) - (zone2 ** 2));                                  // sag of xFC at rc end x
    let surfFC = (2 * 3.14159 * xFC * sag4) - (2 * 3.14159 * xFC * sag3);                   // surface area difference between two cylinders with the xfc radius and

    const pushOffset = 0.001;                                                              // loop step size / apical clearance step

    while (surfFC > surfGoal) {                                                             // presumably surfFC starts out greater than the surfgoal and each iteration reduces it.
        pushFull += pushOffset;                                                             // based on the below, and that this is only incremented here, but not used this is an apical clearance accumulator
        sag2 -= pushOffset;                                                                 // reduce the sag at the end of rc end x (in principle using this to compute the RC would mean this effectively increases apical clearance by 1 micron each loop)
        sagFC = sag2 - sag1;                                                                // sag 2 is dropping (getting closer to sag1) so the difference is dropping, and sagFC is therefore dropping too

        xFC = CalcCarrierCurve(zone1, zone2, sagFC);                                        // this and the next 4 steps repeat the lines above; each loop,

        // essentially we're accumulating apical clearance, calculating a new reverse curve, calculating the lateral cylinder surface area of that curvature over the delta sag from the base until it meets our goal


        sag3 = xFC - Math.sqrt((xFC ** 2) - (zone1 ** 2));
        sag4 = xFC - Math.sqrt((xFC ** 2) - (zone2 ** 2));
        surfFC = (2 * 3.14159 * xFC * sag4) - (2 * 3.14159 * xFC * sag3);
    }

    return pushFull - pushFactor;                                                          // and then it returns pushFull (apical clearance, but less a constant push_factor

    // why are we looking for a particular lateral cylindrical surface area (maybe its a proxy for volume or pressure?)
    // and when we find it, why do we subtract "push_factor" ??
}

// WIDTH FUNCTIONS FROM EMERALD CODE
/// <summary>
/// Method: GetRCWidth.
/// </summary>
/// <param name="OAD"></param>
/// <param name="POZ"></param>
/// <returns></returns>

function GetRCWidth(OAD: number, POZ: number): number {
    if (OAD <= 9.6 && POZ == 5.0) { return 0.4; }
    if (OAD <= 9.6 && POZ == 5.2) { return 0.4; }
    if (OAD <= 9.6 && POZ == 5.4) { return 0.4; }
    if (OAD <= 9.6 && POZ == 5.6) { return 0.4; }
    if (OAD <= 9.6 && POZ == 5.8) { return 0.4; }
    if (OAD <= 9.6 && POZ == 6) { return 0.4; }
    if (OAD <= 9.6 && POZ == 6.2) { return 0.4; }
    if (OAD <= 9.6 && POZ == 6.4) { return 0.4; }
    if (OAD <= 9.6 && POZ == 6.5) { return 0.4; }
    if (OAD <= 9.6 && POZ == 6.6) { return 0.4; }
    if (OAD > 9.6 && OAD <= 9.8 && POZ == 5.0) { return 0.5; }
    if (OAD > 9.6 && OAD <= 9.8 && POZ == 5.2) { return 0.4; }
    if (OAD > 9.6 && OAD <= 9.8 && POZ == 5.4) { return 0.4; }
    if (OAD > 9.6 && OAD <= 9.8 && POZ == 5.6) { return 0.4; }
    if (OAD > 9.6 && OAD <= 9.8 && POZ == 5.8) { return 0.4; }
    if (OAD > 9.6 && OAD <= 9.8 && POZ == 6) { return 0.4; }
    if (OAD > 9.6 && OAD <= 9.8 && POZ == 6.2) { return 0.4; }
    if (OAD > 9.6 && OAD <= 9.8 && POZ == 6.4) { return 0.4; }
    if (OAD > 9.6 && OAD <= 9.8 && POZ == 6.5) { return 0.4; }
    if (OAD > 9.6 && OAD <= 9.8 && POZ == 6.6) { return 0.4; }

    if (OAD > 9.8 && OAD <= 9.9 && POZ == 5.0) { return 0.6; }      // 9.8 widths don't add up
    if (OAD > 9.8 && OAD <= 9.9 && POZ == 5.2) { return 0.5; }
    if (OAD > 9.8 && OAD <= 9.9 && POZ == 5.4) { return 0.5; }
    if (OAD > 9.8 && OAD <= 9.9 && POZ == 5.6) { return 0.5; }
    if (OAD > 9.8 && OAD <= 9.9 && POZ == 5.8) { return 0.5; }
    if (OAD > 9.8 && OAD <= 9.9 && POZ == 6) { return 0.5; }
    if (OAD > 9.8 && OAD <= 9.9 && POZ == 6.2) { return 0.5; }
    if (OAD > 9.8 && OAD <= 9.9 && POZ == 6.4) { return 0.5; }
    if (OAD > 9.8 && OAD <= 9.9 && POZ == 6.5) { return 0.5; }
    if (OAD > 9.8 && OAD <= 9.9 && POZ == 6.6) { return 0.5; }

    if (OAD > 9.9 && OAD <= 10 && POZ == 5.0) { return 0.6; }
    if (OAD > 9.9 && OAD <= 10 && POZ == 5.2) { return 0.5; }
    if (OAD > 9.9 && OAD <= 10 && POZ == 5.4) { return 0.5; }
    if (OAD > 9.9 && OAD <= 10 && POZ == 5.6) { return 0.5; }
    if (OAD > 9.9 && OAD <= 10 && POZ == 5.8) { return 0.5; }
    if (OAD > 9.9 && OAD <= 10 && POZ == 6) { return 0.5; }
    if (OAD > 9.9 && OAD <= 10 && POZ == 6.2) { return 0.5; }
    if (OAD > 9.9 && OAD <= 10 && POZ == 6.4) { return 0.5; }
    if (OAD > 9.9 && OAD <= 10 && POZ == 6.5) { return 0.5; }
    if (OAD > 9.9 && OAD <= 10 && POZ == 6.6) { return 0.5; }

    if (OAD > 10 && OAD <= 10.1 && POZ == 5.0) { return 0.6; }
    if (OAD > 10 && OAD <= 10.1 && POZ == 5.2) { return 0.6; }
    if (OAD > 10 && OAD <= 10.1 && POZ == 5.4) { return 0.5; }
    if (OAD > 10 && OAD <= 10.1 && POZ == 5.6) { return 0.5; }
    if (OAD > 10 && OAD <= 10.1 && POZ == 5.8) { return 0.5; }
    if (OAD > 10 && OAD <= 10.1 && POZ == 6) { return 0.5; }
    if (OAD > 10 && OAD <= 10.1 && POZ == 6.2) { return 0.5; }
    if (OAD > 10 && OAD <= 10.1 && POZ == 6.4) { return 0.5; }
    if (OAD > 10 && OAD <= 10.1 && POZ == 6.5) { return 0.5; }
    if (OAD > 10 && OAD <= 10.1 && POZ == 6.6) { return 0.5; }

    if (OAD > 10.1 && OAD <= 10.2 && POZ == 5.0) { return 0.6; }
    if (OAD > 10.1 && OAD <= 10.2 && POZ == 5.2) { return 0.6; }
    if (OAD > 10.1 && OAD <= 10.2 && POZ == 5.4) { return 0.5; }
    if (OAD > 10.1 && OAD <= 10.2 && POZ == 5.6) { return 0.5; }
    if (OAD > 10.1 && OAD <= 10.2 && POZ == 5.8) { return 0.5; }
    if (OAD > 10.1 && OAD <= 10.2 && POZ == 6) { return 0.5; }
    if (OAD > 10.1 && OAD <= 10.2 && POZ == 6.2) { return 0.5; }
    if (OAD > 10.1 && OAD <= 10.2 && POZ == 6.4) { return 0.5; }
    if (OAD > 10.1 && OAD <= 10.2 && POZ == 6.5) { return 0.5; }
    if (OAD > 10.1 && OAD <= 10.2 && POZ == 6.6) { return 0.5; }

    if (OAD > 10.2 && OAD <= 10.3 && POZ == 5.0) { return 0.6; }
    if (OAD > 10.2 && OAD <= 10.3 && POZ == 5.2) { return 0.6; }
    if (OAD > 10.2 && OAD <= 10.3 && POZ == 5.4) { return 0.6; }
    if (OAD > 10.2 && OAD <= 10.3 && POZ == 5.6) { return 0.5; }
    if (OAD > 10.2 && OAD <= 10.3 && POZ == 5.8) { return 0.5; }
    if (OAD > 10.2 && OAD <= 10.3 && POZ == 6) { return 0.5; }
    if (OAD > 10.2 && OAD <= 10.3 && POZ == 6.2) { return 0.5; }
    if (OAD > 10.2 && OAD <= 10.3 && POZ == 6.4) { return 0.5; }
    if (OAD > 10.2 && OAD <= 10.3 && POZ == 6.5) { return 0.5; }
    if (OAD > 10.2 && OAD <= 10.3 && POZ == 6.6) { return 0.5; }

    if (OAD > 10.3 && OAD <= 10.4 && POZ == 5.0) { return 0.6; }
    if (OAD > 10.3 && OAD <= 10.4 && POZ == 5.2) { return 0.6; }
    if (OAD > 10.3 && OAD <= 10.4 && POZ == 5.4) { return 0.6; }
    if (OAD > 10.3 && OAD <= 10.4 && POZ == 5.6) { return 0.5; }
    if (OAD > 10.3 && OAD <= 10.4 && POZ == 5.8) { return 0.5; }
    if (OAD > 10.3 && OAD <= 10.4 && POZ == 6) { return 0.5; }
    if (OAD > 10.3 && OAD <= 10.4 && POZ == 6.2) { return 0.5; }
    if (OAD > 10.3 && OAD <= 10.4 && POZ == 6.4) { return 0.5; }
    if (OAD > 10.3 && OAD <= 10.4 && POZ == 6.5) { return 0.5; }
    if (OAD > 10.3 && OAD <= 10.4 && POZ == 6.6) { return 0.5; }

    if (OAD > 10.4 && OAD <= 10.5 && POZ == 5.0) { return 0.6; }
    if (OAD > 10.4 && OAD <= 10.5 && POZ == 5.2) { return 0.6; }
    if (OAD > 10.4 && OAD <= 10.5 && POZ == 5.4) { return 0.6; }
    if (OAD > 10.4 && OAD <= 10.5 && POZ == 5.6) { return 0.6; }
    if (OAD > 10.4 && OAD <= 10.5 && POZ == 5.8) { return 0.5; }
    if (OAD > 10.4 && OAD <= 10.5 && POZ == 6) { return 0.5; }
    if (OAD > 10.4 && OAD <= 10.5 && POZ == 6.2) { return 0.5; }
    if (OAD > 10.4 && OAD <= 10.5 && POZ == 6.4) { return 0.5; }
    if (OAD > 10.4 && OAD <= 10.5 && POZ == 6.5) { return 0.5; }
    if (OAD > 10.4 && OAD <= 10.5 && POZ == 6.6) { return 0.5; }

    if (OAD > 10.5 && OAD <= 10.6 && POZ == 5.0) { return 0.6; }
    if (OAD > 10.5 && OAD <= 10.6 && POZ == 5.2) { return 0.6; }
    if (OAD > 10.5 && OAD <= 10.6 && POZ == 5.4) { return 0.6; }
    if (OAD > 10.5 && OAD <= 10.6 && POZ == 5.6) { return 0.6; }
    if (OAD > 10.5 && OAD <= 10.6 && POZ == 5.8) { return 0.5; }
    if (OAD > 10.5 && OAD <= 10.6 && POZ == 6) { return 0.5; }
    if (OAD > 10.5 && OAD <= 10.6 && POZ == 6.2) { return 0.5; }
    if (OAD > 10.5 && OAD <= 10.6 && POZ == 6.4) { return 0.5; }
    if (OAD > 10.5 && OAD <= 10.6 && POZ == 6.5) { return 0.5; }
    if (OAD > 10.5 && OAD <= 10.6 && POZ == 6.6) { return 0.5; }

    if (OAD > 10.6 && OAD <= 10.7 && POZ == 5.0) { return 0.6; }
    if (OAD > 10.6 && OAD <= 10.7 && POZ == 5.2) { return 0.6; }
    if (OAD > 10.6 && OAD <= 10.7 && POZ == 5.4) { return 0.6; }
    if (OAD > 10.6 && OAD <= 10.7 && POZ == 5.6) { return 0.6; }
    if (OAD > 10.6 && OAD <= 10.7 && POZ == 5.8) { return 0.6; }
    if (OAD > 10.6 && OAD <= 10.7 && POZ == 6) { return 0.5; }
    if (OAD > 10.6 && OAD <= 10.7 && POZ == 6.2) { return 0.5; }
    if (OAD > 10.6 && OAD <= 10.7 && POZ == 6.4) { return 0.5; }
    if (OAD > 10.6 && OAD <= 10.7 && POZ == 6.5) { return 0.5; }
    if (OAD > 10.6 && OAD <= 10.7 && POZ == 6.6) { return 0.5; }

    if (OAD > 10.7 && OAD <= 10.8 && POZ == 5.0) { return 0.6; }
    if (OAD > 10.7 && OAD <= 10.8 && POZ == 5.2) { return 0.6; }
    if (OAD > 10.7 && OAD <= 10.8 && POZ == 5.4) { return 0.6; }
    if (OAD > 10.7 && OAD <= 10.8 && POZ == 5.6) { return 0.6; }
    if (OAD > 10.7 && OAD <= 10.8 && POZ == 5.8) { return 0.6; }
    if (OAD > 10.7 && OAD <= 10.8 && POZ == 6) { return 0.5; }
    if (OAD > 10.7 && OAD <= 10.8 && POZ == 6.2) { return 0.5; }
    if (OAD > 10.7 && OAD <= 10.8 && POZ == 6.4) { return 0.5; }
    if (OAD > 10.7 && OAD <= 10.8 && POZ == 6.5) { return 0.5; }
    if (OAD > 10.7 && OAD <= 10.8 && POZ == 6.6) { return 0.5; }

    if (OAD > 10.8 && OAD <= 10.9 && POZ == 5.0) { return 0.6; }
    if (OAD > 10.8 && OAD <= 10.9 && POZ == 5.2) { return 0.6; }
    if (OAD > 10.8 && OAD <= 10.9 && POZ == 5.4) { return 0.6; }
    if (OAD > 10.8 && OAD <= 10.9 && POZ == 5.6) { return 0.6; }
    if (OAD > 10.8 && OAD <= 10.9 && POZ == 5.8) { return 0.6; }
    if (OAD > 10.8 && OAD <= 10.9 && POZ == 6) { return 0.6; }
    if (OAD > 10.8 && OAD <= 10.9 && POZ == 6.2) { return 0.5; }
    if (OAD > 10.8 && OAD <= 10.9 && POZ == 6.4) { return 0.5; }
    if (OAD > 10.8 && OAD <= 10.9 && POZ == 6.5) { return 0.5; }
    if (OAD > 10.8 && OAD <= 10.9 && POZ == 6.6) { return 0.5; }

    if (OAD > 10.9 && OAD <= 11 && POZ == 5.0) { return 0.6; }
    if (OAD > 10.9 && OAD <= 11 && POZ == 5.2) { return 0.6; }
    if (OAD > 10.9 && OAD <= 11 && POZ == 5.4) { return 0.6; }
    if (OAD > 10.9 && OAD <= 11 && POZ == 5.6) { return 0.6; }
    if (OAD > 10.9 && OAD <= 11 && POZ == 5.8) { return 0.6; }
    if (OAD > 10.9 && OAD <= 11 && POZ == 6) { return 0.6; }
    if (OAD > 10.9 && OAD <= 11 && POZ == 6.2) { return 0.5; }
    if (OAD > 10.9 && OAD <= 11 && POZ == 6.4) { return 0.5; }
    if (OAD > 10.9 && OAD <= 11 && POZ == 6.5) { return 0.5; }
    if (OAD > 10.9 && OAD <= 11 && POZ == 6.6) { return 0.5; }

    if (OAD > 11 && OAD <= 11.1 && POZ == 5.0) { return 0.6; }
    if (OAD > 11 && OAD <= 11.1 && POZ == 5.2) { return 0.6; }
    if (OAD > 11 && OAD <= 11.1 && POZ == 5.4) { return 0.6; }
    if (OAD > 11 && OAD <= 11.1 && POZ == 5.6) { return 0.6; }
    if (OAD > 11 && OAD <= 11.1 && POZ == 5.8) { return 0.6; }
    if (OAD > 11 && OAD <= 11.1 && POZ == 6) { return 0.6; }
    if (OAD > 11 && OAD <= 11.1 && POZ == 6.2) { return 0.6; }
    if (OAD > 11 && OAD <= 11.1 && POZ == 6.4) { return 0.5; }
    if (OAD > 11 && OAD <= 11.1 && POZ == 6.5) { return 0.5; }
    if (OAD > 11 && OAD <= 11.1 && POZ == 6.6) { return 0.5; }

    if (OAD > 11.1 && OAD <= 11.2 && POZ == 5.0) { return 0.6; }
    if (OAD > 11.1 && OAD <= 11.2 && POZ == 5.2) { return 0.6; }
    if (OAD > 11.1 && OAD <= 11.2 && POZ == 5.4) { return 0.6; }
    if (OAD > 11.1 && OAD <= 11.2 && POZ == 5.6) { return 0.6; }
    if (OAD > 11.1 && OAD <= 11.2 && POZ == 5.8) { return 0.6; }
    if (OAD > 11.1 && OAD <= 11.2 && POZ == 6) { return 0.6; }
    if (OAD > 11.1 && OAD <= 11.2 && POZ == 6.2) { return 0.6; }
    if (OAD > 11.1 && OAD <= 11.2 && POZ == 6.4) { return 0.5; }
    if (OAD > 11.1 && OAD <= 11.2 && POZ == 6.5) { return 0.5; }
    if (OAD > 11.1 && OAD <= 11.2 && POZ == 6.6) { return 0.5; }

    if (OAD > 11.2 && OAD <= 11.3 && POZ == 5.0) { return 0.6; }
    if (OAD > 11.2 && OAD <= 11.3 && POZ == 5.2) { return 0.6; }
    if (OAD > 11.2 && OAD <= 11.3 && POZ == 5.4) { return 0.6; }
    if (OAD > 11.2 && OAD <= 11.3 && POZ == 5.6) { return 0.6; }
    if (OAD > 11.2 && OAD <= 11.3 && POZ == 5.8) { return 0.6; }
    if (OAD > 11.2 && OAD <= 11.3 && POZ == 6) { return 0.6; }
    if (OAD > 11.2 && OAD <= 11.3 && POZ == 6.2) { return 0.6; }
    if (OAD > 11.2 && OAD <= 11.3 && POZ == 6.4) { return 0.6; }
    if (OAD > 11.2 && OAD <= 11.3 && POZ == 6.5) { return 0.5; }
    if (OAD > 11.2 && OAD <= 11.3 && POZ == 6.6) { return 0.5; }

    if (OAD > 11.3 && OAD <= 11.4 && POZ == 5.0) { return 0.6; }
    if (OAD > 11.3 && OAD <= 11.4 && POZ == 5.2) { return 0.6; }
    if (OAD > 11.3 && OAD <= 11.4 && POZ == 5.4) { return 0.6; }
    if (OAD > 11.3 && OAD <= 11.4 && POZ == 5.6) { return 0.6; }
    if (OAD > 11.3 && OAD <= 11.4 && POZ == 5.8) { return 0.6; }
    if (OAD > 11.3 && OAD <= 11.4 && POZ == 6) { return 0.6; }
    if (OAD > 11.3 && OAD <= 11.4 && POZ == 6.2) { return 0.6; }
    if (OAD > 11.3 && OAD <= 11.4 && POZ == 6.4) { return 0.6; }
    if (OAD > 11.3 && OAD <= 11.4 && POZ == 6.5) { return 0.6; }
    if (OAD > 11.3 && OAD <= 11.4 && POZ == 6.6) { return 0.5; }

    if (OAD > 11.4 && OAD <= 11.5 && POZ == 5.0) { return 0.6; }
    if (OAD > 11.4 && OAD <= 11.5 && POZ == 5.2) { return 0.6; }
    if (OAD > 11.4 && OAD <= 11.5 && POZ == 5.4) { return 0.6; }
    if (OAD > 11.4 && OAD <= 11.5 && POZ == 5.6) { return 0.6; }
    if (OAD > 11.4 && OAD <= 11.5 && POZ == 5.8) { return 0.6; }
    if (OAD > 11.4 && OAD <= 11.5 && POZ == 6) { return 0.6; }
    if (OAD > 11.4 && OAD <= 11.5 && POZ == 6.2) { return 0.6; }
    if (OAD > 11.4 && OAD <= 11.5 && POZ == 6.4) { return 0.6; }
    if (OAD > 11.4 && OAD <= 11.5 && POZ == 6.5) { return 0.6; }
    if (OAD > 11.4 && OAD <= 11.5 && POZ == 6.6) { return 0.6; }

    if (OAD > 11.5 && POZ == 5.0) { return 0.6; }
    if (OAD > 11.5 && POZ == 5.2) { return 0.6; }
    if (OAD > 11.5 && POZ == 5.4) { return 0.6; }
    if (OAD > 11.5 && POZ == 5.6) { return 0.6; }
    if (OAD > 11.5 && POZ == 5.8) { return 0.6; }
    if (OAD > 11.5 && POZ == 6) { return 0.6; }
    if (OAD > 11.5 && POZ == 6.2) { return 0.6; }
    if (OAD > 11.5 && POZ == 6.4) { return 0.6; }
    if (OAD > 11.5 && POZ == 6.5) { return 0.6; }
    if (OAD > 11.5 && POZ == 6.6) { return 0.6; }

    return 0.5;
}

/// <summary>
/// Method: GetAC1Width.
/// </summary>
/// <param name="OAD"></param>
/// <param name="POZ"></param>
/// <returns></returns>
function GetAC1Width(OAD: number, POZ: number): number {
    if (OAD <= 9.8 && POZ == 5.0) { return 0.7; }
    if (OAD <= 9.8 && POZ == 5.2) { return 0.7; }
    if (OAD <= 9.8 && POZ == 5.4) { return 0.7; }
    if (OAD <= 9.8 && POZ == 5.6) { return 0.7; }
    if (OAD <= 9.8 && POZ == 5.8) { return 0.6; }
    if (OAD <= 9.8 && POZ == 6) { return 0.6; }
    if (OAD <= 9.8 && POZ == 6.2) { return 0.5; }
    if (OAD <= 9.8 && POZ == 6.4) { return 0.5; }
    if (OAD <= 9.8 && POZ == 6.5) { return 0.4; }
    if (OAD <= 9.8 && POZ == 6.6) { return 0.4; }
    if (OAD > 9.8 && OAD <= 9.9 && POZ == 5.0) { return 0.75; }
    if (OAD > 9.8 && OAD <= 9.9 && POZ == 5.2) { return 0.7; }
    if (OAD > 9.8 && OAD <= 9.9 && POZ == 5.4) { return 0.7; }
    if (OAD > 9.8 && OAD <= 9.9 && POZ == 5.6) { return 0.7; }
    if (OAD > 9.8 && OAD <= 9.9 && POZ == 5.8) { return 0.65; }
    if (OAD > 9.8 && OAD <= 9.9 && POZ == 6) { return 0.6; }
    if (OAD > 9.8 && OAD <= 9.9 && POZ == 6.2) { return 0.5; }
    if (OAD > 9.8 && OAD <= 9.9 && POZ == 6.4) { return 0.5; }
    if (OAD > 9.8 && OAD <= 9.9 && POZ == 6.5) { return 0.5; }
    if (OAD > 9.8 && OAD <= 9.9 && POZ == 6.6) { return 0.4; }

    if (OAD > 9.9 && OAD <= 10 && POZ == 5.0) { return 0.75; }
    if (OAD > 9.9 && OAD <= 10 && POZ == 5.2) { return 0.7; }
    if (OAD > 9.9 && OAD <= 10 && POZ == 5.4) { return 0.7; }
    if (OAD > 9.9 && OAD <= 10 && POZ == 5.6) { return 0.7; }
    if (OAD > 9.9 && OAD <= 10 && POZ == 5.8) { return 0.7; }
    if (OAD > 9.9 && OAD <= 10 && POZ == 6) { return 0.6; }
    if (OAD > 9.9 && OAD <= 10 && POZ == 6.2) { return 0.6; }
    if (OAD > 9.9 && OAD <= 10 && POZ == 6.4) { return 0.5; }
    if (OAD > 9.9 && OAD <= 10 && POZ == 6.5) { return 0.5; }
    if (OAD > 9.9 && OAD <= 10 && POZ == 6.6) { return 0.5; }

    if (OAD > 10 && OAD <= 10.1 && POZ == 5.0) { return 0.8; }
    if (OAD > 10 && OAD <= 10.1 && POZ == 5.2) { return 0.75; }
    if (OAD > 10 && OAD <= 10.1 && POZ == 5.4) { return 0.7; }
    if (OAD > 10 && OAD <= 10.1 && POZ == 5.6) { return 0.7; }
    if (OAD > 10 && OAD <= 10.1 && POZ == 5.8) { return 0.7; }
    if (OAD > 10 && OAD <= 10.1 && POZ == 6) { return 0.65; }
    if (OAD > 10 && OAD <= 10.1 && POZ == 6.2) { return 0.6; }
    if (OAD > 10 && OAD <= 10.1 && POZ == 6.4) { return 0.5; }
    if (OAD > 10 && OAD <= 10.1 && POZ == 6.5) { return 0.5; }
    if (OAD > 10 && OAD <= 10.1 && POZ == 6.6) { return 0.5; }

    if (OAD > 10.1 && OAD <= 10.2 && POZ == 5.0) { return 0.8; }
    if (OAD > 10.1 && OAD <= 10.2 && POZ == 5.2) { return 0.75; }
    if (OAD > 10.1 && OAD <= 10.2 && POZ == 5.4) { return 0.7; }
    if (OAD > 10.1 && OAD <= 10.2 && POZ == 5.6) { return 0.7; }
    if (OAD > 10.1 && OAD <= 10.2 && POZ == 5.8) { return 0.7; }
    if (OAD > 10.1 && OAD <= 10.2 && POZ == 6) { return 0.7; }
    if (OAD > 10.1 && OAD <= 10.2 && POZ == 6.2) { return 0.6; }
    if (OAD > 10.1 && OAD <= 10.2 && POZ == 6.4) { return 0.6; }
    if (OAD > 10.1 && OAD <= 10.2 && POZ == 6.5) { return 0.5; }
    if (OAD > 10.1 && OAD <= 10.2 && POZ == 6.6) { return 0.5; }

    if (OAD > 10.2 && OAD <= 10.3 && POZ == 5.0) { return 0.8; }
    if (OAD > 10.2 && OAD <= 10.3 && POZ == 5.2) { return 0.8; }
    if (OAD > 10.2 && OAD <= 10.3 && POZ == 5.4) { return 0.75; }
    if (OAD > 10.2 && OAD <= 10.3 && POZ == 5.6) { return 0.7; }
    if (OAD > 10.2 && OAD <= 10.3 && POZ == 5.8) { return 0.7; }
    if (OAD > 10.2 && OAD <= 10.3 && POZ == 6) { return 0.7; }
    if (OAD > 10.2 && OAD <= 10.3 && POZ == 6.2) { return 0.65; }
    if (OAD > 10.2 && OAD <= 10.3 && POZ == 6.4) { return 0.6; }
    if (OAD > 10.2 && OAD <= 10.3 && POZ == 6.5) { return 0.6; }
    if (OAD > 10.2 && OAD <= 10.3 && POZ == 6.6) { return 0.5; }

    if (OAD > 10.3 && OAD <= 10.4 && POZ == 5.0) { return 0.8; }
    if (OAD > 10.3 && OAD <= 10.4 && POZ == 5.2) { return 0.8; }
    if (OAD > 10.3 && OAD <= 10.4 && POZ == 5.4) { return 0.75; }
    if (OAD > 10.3 && OAD <= 10.4 && POZ == 5.6) { return 0.7; }
    if (OAD > 10.3 && OAD <= 10.4 && POZ == 5.8) { return 0.7; }
    if (OAD > 10.3 && OAD <= 10.4 && POZ == 6) { return 0.7; }
    if (OAD > 10.3 && OAD <= 10.4 && POZ == 6.2) { return 0.7; }
    if (OAD > 10.3 && OAD <= 10.4 && POZ == 6.4) { return 0.6; }
    if (OAD > 10.3 && OAD <= 10.4 && POZ == 6.5) { return 0.6; }
    if (OAD > 10.3 && OAD <= 10.4 && POZ == 6.6) { return 0.6; }

    if (OAD > 10.4 && OAD <= 10.5 && POZ == 5.0) { return 0.85; }
    if (OAD > 10.4 && OAD <= 10.5 && POZ == 5.2) { return 0.8; }
    if (OAD > 10.4 && OAD <= 10.5 && POZ == 5.4) { return 0.8; }
    if (OAD > 10.4 && OAD <= 10.5 && POZ == 5.6) { return 0.75; }
    if (OAD > 10.4 && OAD <= 10.5 && POZ == 5.8) { return 0.7; }
    if (OAD > 10.4 && OAD <= 10.5 && POZ == 6) { return 0.7; }
    if (OAD > 10.4 && OAD <= 10.5 && POZ == 6.2) { return 0.7; }
    if (OAD > 10.4 && OAD <= 10.5 && POZ == 6.4) { return 0.65; }
    if (OAD > 10.4 && OAD <= 10.5 && POZ == 6.5) { return 0.6; }
    if (OAD > 10.4 && OAD <= 10.5 && POZ == 6.6) { return 0.6; }

    if (OAD > 10.5 && OAD <= 10.6 && POZ == 5.0) { return 0.85; }
    if (OAD > 10.5 && OAD <= 10.6 && POZ == 5.2) { return 0.8; }
    if (OAD > 10.5 && OAD <= 10.6 && POZ == 5.4) { return 0.8; }
    if (OAD > 10.5 && OAD <= 10.6 && POZ == 5.6) { return 0.75; }
    if (OAD > 10.5 && OAD <= 10.6 && POZ == 5.8) { return 0.7; }
    if (OAD > 10.5 && OAD <= 10.6 && POZ == 6) { return 0.7; }
    if (OAD > 10.5 && OAD <= 10.6 && POZ == 6.2) { return 0.7; }
    if (OAD > 10.5 && OAD <= 10.6 && POZ == 6.4) { return 0.7; }
    if (OAD > 10.5 && OAD <= 10.6 && POZ == 6.5) { return 0.65; }
    if (OAD > 10.5 && OAD <= 10.6 && POZ == 6.6) { return 0.6; }

    if (OAD > 10.6 && OAD <= 10.7 && POZ == 5.0) { return 0.9; }
    if (OAD > 10.6 && OAD <= 10.7 && POZ == 5.2) { return 0.85; }
    if (OAD > 10.6 && OAD <= 10.7 && POZ == 5.4) { return 0.8; }
    if (OAD > 10.6 && OAD <= 10.7 && POZ == 5.6) { return 0.8; }
    if (OAD > 10.6 && OAD <= 10.7 && POZ == 5.8) { return 0.75; }
    if (OAD > 10.6 && OAD <= 10.7 && POZ == 6) { return 0.7; }
    if (OAD > 10.6 && OAD <= 10.7 && POZ == 6.2) { return 0.7; }
    if (OAD > 10.6 && OAD <= 10.7 && POZ == 6.4) { return 0.7; }
    if (OAD > 10.6 && OAD <= 10.7 && POZ == 6.5) { return 0.7; }
    if (OAD > 10.6 && OAD <= 10.7 && POZ == 6.6) { return 0.65; }

    if (OAD > 10.7 && OAD <= 10.8 && POZ == 5.0) { return 0.9; }
    if (OAD > 10.7 && OAD <= 10.8 && POZ == 5.2) { return 0.85; }
    if (OAD > 10.7 && OAD <= 10.8 && POZ == 5.4) { return 0.8; }
    if (OAD > 10.7 && OAD <= 10.8 && POZ == 5.6) { return 0.8; }
    if (OAD > 10.7 && OAD <= 10.8 && POZ == 5.8) { return 0.75; }
    if (OAD > 10.7 && OAD <= 10.8 && POZ == 6) { return 0.7; }
    if (OAD > 10.7 && OAD <= 10.8 && POZ == 6.2) { return 0.7; }
    if (OAD > 10.7 && OAD <= 10.8 && POZ == 6.4) { return 0.7; }
    if (OAD > 10.7 && OAD <= 10.8 && POZ == 6.5) { return 0.7; }
    if (OAD > 10.7 && OAD <= 10.8 && POZ == 6.6) { return 0.7; }

    if (OAD > 10.8 && OAD <= 10.9 && POZ == 5.0) { return 0.95; }
    if (OAD > 10.8 && OAD <= 10.9 && POZ == 5.2) { return 0.9; }
    if (OAD > 10.8 && OAD <= 10.9 && POZ == 5.4) { return 0.85; }
    if (OAD > 10.8 && OAD <= 10.9 && POZ == 5.6) { return 0.8; }
    if (OAD > 10.8 && OAD <= 10.9 && POZ == 5.8) { return 0.8; }
    if (OAD > 10.8 && OAD <= 10.9 && POZ == 6) { return 0.75; }
    if (OAD > 10.8 && OAD <= 10.9 && POZ == 6.2) { return 0.7; }
    if (OAD > 10.8 && OAD <= 10.9 && POZ == 6.4) { return 0.7; }
    if (OAD > 10.8 && OAD <= 10.9 && POZ == 6.5) { return 0.7; }
    if (OAD > 10.8 && OAD <= 10.9 && POZ == 6.6) { return 0.7; }

    if (OAD > 10.9 && OAD <= 11 && POZ == 5.0) { return 0.95; }
    if (OAD > 10.9 && OAD <= 11 && POZ == 5.2) { return 0.9; }
    if (OAD > 10.9 && OAD <= 11 && POZ == 5.4) { return 0.85; }
    if (OAD > 10.9 && OAD <= 11 && POZ == 5.6) { return 0.8; }
    if (OAD > 10.9 && OAD <= 11 && POZ == 5.8) { return 0.8; }
    if (OAD > 10.9 && OAD <= 11 && POZ == 6) { return 0.75; }
    if (OAD > 10.9 && OAD <= 11 && POZ == 6.2) { return 0.7; }
    if (OAD > 10.9 && OAD <= 11 && POZ == 6.4) { return 0.7; }
    if (OAD > 10.9 && OAD <= 11 && POZ == 6.5) { return 0.7; }
    if (OAD > 10.9 && OAD <= 11 && POZ == 6.6) { return 0.7; }

    if (OAD > 11 && OAD <= 11.1 && POZ == 5.0) { return 1; }
    if (OAD > 11 && OAD <= 11.1 && POZ == 5.2) { return 0.95; }
    if (OAD > 11 && OAD <= 11.1 && POZ == 5.4) { return 0.9; }
    if (OAD > 11 && OAD <= 11.1 && POZ == 5.6) { return 0.85; }
    if (OAD > 11 && OAD <= 11.1 && POZ == 5.8) { return 0.8; }
    if (OAD > 11 && OAD <= 11.1 && POZ == 6) { return 0.8; }
    if (OAD > 11 && OAD <= 11.1 && POZ == 6.2) { return 0.75; }
    if (OAD > 11 && OAD <= 11.1 && POZ == 6.4) { return 0.7; }
    if (OAD > 11 && OAD <= 11.1 && POZ == 6.5) { return 0.7; }
    if (OAD > 11 && OAD <= 11.1 && POZ == 6.6) { return 0.7; }

    if (OAD > 11.1 && OAD <= 11.2 && POZ == 5.0) { return 1; }
    if (OAD > 11.1 && OAD <= 11.2 && POZ == 5.2) { return 0.95; }
    if (OAD > 11.1 && OAD <= 11.2 && POZ == 5.4) { return 0.9; }
    if (OAD > 11.1 && OAD <= 11.2 && POZ == 5.6) { return 0.85; }
    if (OAD > 11.1 && OAD <= 11.2 && POZ == 5.8) { return 0.8; }
    if (OAD > 11.1 && OAD <= 11.2 && POZ == 6) { return 0.8; }
    if (OAD > 11.1 && OAD <= 11.2 && POZ == 6.2) { return 0.75; }
    if (OAD > 11.1 && OAD <= 11.2 && POZ == 6.4) { return 0.7; }
    if (OAD > 11.1 && OAD <= 11.2 && POZ == 6.5) { return 0.7; }
    if (OAD > 11.1 && OAD <= 11.2 && POZ == 6.6) { return 0.7; }

    if (OAD > 11.2 && OAD <= 11.3 && POZ == 5.0) { return 1.05; }
    if (OAD > 11.2 && OAD <= 11.3 && POZ == 5.2) { return 1; }
    if (OAD > 11.2 && OAD <= 11.3 && POZ == 5.4) { return 0.95; }
    if (OAD > 11.2 && OAD <= 11.3 && POZ == 5.6) { return 0.9; }
    if (OAD > 11.2 && OAD <= 11.3 && POZ == 5.8) { return 0.85; }
    if (OAD > 11.2 && OAD <= 11.3 && POZ == 6) { return 0.8; }
    if (OAD > 11.2 && OAD <= 11.3 && POZ == 6.2) { return 0.8; }
    if (OAD > 11.2 && OAD <= 11.3 && POZ == 6.4) { return 0.75; }
    if (OAD > 11.2 && OAD <= 11.3 && POZ == 6.5) { return 0.7; }
    if (OAD > 11.2 && OAD <= 11.3 && POZ == 6.6) { return 0.7; }

    if (OAD > 11.3 && OAD <= 11.4 && POZ == 5.0) { return 1.05; }
    if (OAD > 11.3 && OAD <= 11.4 && POZ == 5.2) { return 1; }
    if (OAD > 11.3 && OAD <= 11.4 && POZ == 5.4) { return 0.95; }
    if (OAD > 11.3 && OAD <= 11.4 && POZ == 5.6) { return 0.9; }
    if (OAD > 11.3 && OAD <= 11.4 && POZ == 5.8) { return 0.85; }
    if (OAD > 11.3 && OAD <= 11.4 && POZ == 6) { return 0.8; }
    if (OAD > 11.3 && OAD <= 11.4 && POZ == 6.2) { return 0.8; }
    if (OAD > 11.3 && OAD <= 11.4 && POZ == 6.4) { return 0.75; }
    if (OAD > 11.3 && OAD <= 11.4 && POZ == 6.5) { return 0.75; }
    if (OAD > 11.3 && OAD <= 11.4 && POZ == 6.6) { return 0.7; }

    if (OAD > 11.4 && OAD <= 11.5 && POZ == 5.0) { return 1.1; }
    if (OAD > 11.4 && OAD <= 11.5 && POZ == 5.2) { return 1.05; }
    if (OAD > 11.4 && OAD <= 11.5 && POZ == 5.4) { return 1; }
    if (OAD > 11.4 && OAD <= 11.5 && POZ == 5.6) { return 0.95; }
    if (OAD > 11.4 && OAD <= 11.5 && POZ == 5.8) { return 0.9; }
    if (OAD > 11.4 && OAD <= 11.5 && POZ == 6) { return 0.85; }
    if (OAD > 11.4 && OAD <= 11.5 && POZ == 6.2) { return 0.8; }
    if (OAD > 11.4 && OAD <= 11.5 && POZ == 6.4) { return 0.8; }
    if (OAD > 11.4 && OAD <= 11.5 && POZ == 6.5) { return 0.75; }
    if (OAD > 11.4 && OAD <= 11.5 && POZ == 6.6) { return 0.75; }

    if (OAD > 11.5 && POZ == 5.0) { return 1.1; }
    if (OAD > 11.5 && POZ == 5.2) { return 1.05; }
    if (OAD > 11.5 && POZ == 5.4) { return 1; }
    if (OAD > 11.5 && POZ == 5.6) { return 0.95; }
    if (OAD > 11.5 && POZ == 5.8) { return 0.9; }
    if (OAD > 11.5 && POZ == 6) { return 0.85; }
    if (OAD > 11.5 && POZ == 6.2) { return 0.8; }
    if (OAD > 11.5 && POZ == 6.4) { return 0.8; }
    if (OAD > 11.5 && POZ == 6.5) { return 0.8; }
    if (OAD > 11.5 && POZ == 6.6) { return 0.75; }

    return 0.5;
}


function getAC2Width(OAD: number, POZ: number): number {
    if (OAD <= 9.8 && POZ == 5.0) { return 0.7; }
    if (OAD <= 9.8 && POZ == 5.2) { return 0.6; }
    if (OAD <= 9.8 && POZ == 5.4) { return 0.5; }
    if (OAD <= 9.8 && POZ == 5.6) { return 0.4; }
    if (OAD <= 9.8 && POZ == 5.8) { return 0.4; }
    if (OAD <= 9.8 && POZ == 6) { return 0.4; }
    if (OAD <= 9.8 && POZ == 6.2) { return 0.4; }
    if (OAD <= 9.8 && POZ == 6.4) { return 0.3; }
    if (OAD <= 9.8 && POZ == 6.5) { return 0.35; }
    if (OAD <= 9.8 && POZ == 6.6) { return 0.3; }
    if (OAD > 9.8 && OAD <= 9.9 && POZ == 5.0) { return 0.6; }
    if (OAD > 9.8 && OAD <= 9.9 && POZ == 5.2) { return 0.65; }
    if (OAD > 9.8 && OAD <= 9.9 && POZ == 5.4) { return 0.55; }
    if (OAD > 9.8 && OAD <= 9.9 && POZ == 5.6) { return 0.45; }
    if (OAD > 9.8 && OAD <= 9.9 && POZ == 5.8) { return 0.4; }
    if (OAD > 9.8 && OAD <= 9.9 && POZ == 6) { return 0.45; }
    if (OAD > 9.8 && OAD <= 9.9 && POZ == 6.2) { return 0.45; }
    if (OAD > 9.8 && OAD <= 9.9 && POZ == 6.4) { return 0.35; }
    if (OAD > 9.8 && OAD <= 9.9 && POZ == 6.5) { return 0.3; }
    if (OAD > 9.8 && OAD <= 9.9 && POZ == 6.6) { return 0.35; }

    if (OAD > 9.9 && OAD <= 10 && POZ == 5.0) { return 0.65; }
    if (OAD > 9.9 && OAD <= 10 && POZ == 5.2) { return 0.7; }
    if (OAD > 9.9 && OAD <= 10 && POZ == 5.4) { return 0.6; }
    if (OAD > 9.9 && OAD <= 10 && POZ == 5.6) { return 0.5; }
    if (OAD > 9.9 && OAD <= 10 && POZ == 5.8) { return 0.4; }
    if (OAD > 9.9 && OAD <= 10 && POZ == 6) { return 0.4; }
    if (OAD > 9.9 && OAD <= 10 && POZ == 6.2) { return 0.4; }
    if (OAD > 9.9 && OAD <= 10 && POZ == 6.4) { return 0.4; }
    if (OAD > 9.9 && OAD <= 10 && POZ == 6.5) { return 0.35; }
    if (OAD > 9.9 && OAD <= 10 && POZ == 6.6) { return 0.3; }

    if (OAD > 10 && OAD <= 10.1 && POZ == 5.0) { return 0.65; }
    if (OAD > 10 && OAD <= 10.1 && POZ == 5.2) { return 0.6; }
    if (OAD > 10 && OAD <= 10.1 && POZ == 5.4) { return 0.65; }
    if (OAD > 10 && OAD <= 10.1 && POZ == 5.6) { return 0.55; }
    if (OAD > 10 && OAD <= 10.1 && POZ == 5.8) { return 0.45; }
    if (OAD > 10 && OAD <= 10.1 && POZ == 6) { return 0.4; }
    if (OAD > 10 && OAD <= 10.1 && POZ == 6.2) { return 0.45; }
    if (OAD > 10 && OAD <= 10.1 && POZ == 6.4) { return 0.45; }
    if (OAD > 10 && OAD <= 10.1 && POZ == 6.5) { return 0.4; }
    if (OAD > 10 && OAD <= 10.1 && POZ == 6.6) { return 0.35; }

    if (OAD > 10.1 && OAD <= 10.2 && POZ == 5.0) { return 0.7; }
    if (OAD > 10.1 && OAD <= 10.2 && POZ == 5.2) { return 0.65; }
    if (OAD > 10.1 && OAD <= 10.2 && POZ == 5.4) { return 0.7; }
    if (OAD > 10.1 && OAD <= 10.2 && POZ == 5.6) { return 0.6; }
    if (OAD > 10.1 && OAD <= 10.2 && POZ == 5.8) { return 0.5; }
    if (OAD > 10.1 && OAD <= 10.2 && POZ == 6) { return 0.4; }
    if (OAD > 10.1 && OAD <= 10.2 && POZ == 6.2) { return 0.4; }
    if (OAD > 10.1 && OAD <= 10.2 && POZ == 6.4) { return 0.4; }
    if (OAD > 10.1 && OAD <= 10.2 && POZ == 6.5) { return 0.45; }
    if (OAD > 10.1 && OAD <= 10.2 && POZ == 6.6) { return 0.4; }

    if (OAD > 10.2 && OAD <= 10.3 && POZ == 5.0) { return 0.75; }
    if (OAD > 10.2 && OAD <= 10.3 && POZ == 5.2) { return 0.65; }
    if (OAD > 10.2 && OAD <= 10.3 && POZ == 5.4) { return 0.6; }
    if (OAD > 10.2 && OAD <= 10.3 && POZ == 5.6) { return 0.65; }
    if (OAD > 10.2 && OAD <= 10.3 && POZ == 5.8) { return 0.55; }
    if (OAD > 10.2 && OAD <= 10.3 && POZ == 6) { return 0.45; }
    if (OAD > 10.2 && OAD <= 10.3 && POZ == 6.2) { return 0.4; }
    if (OAD > 10.2 && OAD <= 10.3 && POZ == 6.4) { return 0.45; }
    if (OAD > 10.2 && OAD <= 10.3 && POZ == 6.5) { return 0.4; }
    if (OAD > 10.2 && OAD <= 10.3 && POZ == 6.6) { return 0.45; }

    if (OAD > 10.3 && OAD <= 10.4 && POZ == 5.0) { return 0.8; }
    if (OAD > 10.3 && OAD <= 10.4 && POZ == 5.2) { return 0.7; }
    if (OAD > 10.3 && OAD <= 10.4 && POZ == 5.4) { return 0.65; }
    if (OAD > 10.3 && OAD <= 10.4 && POZ == 5.6) { return 0.7; }
    if (OAD > 10.3 && OAD <= 10.4 && POZ == 5.8) { return 0.6; }
    if (OAD > 10.3 && OAD <= 10.4 && POZ == 6) { return 0.5; }
    if (OAD > 10.3 && OAD <= 10.4 && POZ == 6.2) { return 0.4; }
    if (OAD > 10.3 && OAD <= 10.4 && POZ == 6.4) { return 0.4; }
    if (OAD > 10.3 && OAD <= 10.4 && POZ == 6.5) { return 0.45; }
    if (OAD > 10.3 && OAD <= 10.4 && POZ == 6.6) { return 0.4; }

    if (OAD > 10.4 && OAD <= 10.5 && POZ == 5.0) { return 0.8; }
    if (OAD > 10.4 && OAD <= 10.5 && POZ == 5.2) { return 0.75; }
    if (OAD > 10.4 && OAD <= 10.5 && POZ == 5.4) { return 0.65; }
    if (OAD > 10.4 && OAD <= 10.5 && POZ == 5.6) { return 0.6; }
    if (OAD > 10.4 && OAD <= 10.5 && POZ == 5.8) { return 0.65; }
    if (OAD > 10.4 && OAD <= 10.5 && POZ == 6) { return 0.55; }
    if (OAD > 10.4 && OAD <= 10.5 && POZ == 6.2) { return 0.45; }
    if (OAD > 10.4 && OAD <= 10.5 && POZ == 6.4) { return 0.4; }
    if (OAD > 10.4 && OAD <= 10.5 && POZ == 6.5) { return 0.4; }
    if (OAD > 10.4 && OAD <= 10.5 && POZ == 6.6) { return 0.45; }

    if (OAD > 10.5 && OAD <= 10.6 && POZ == 5.0) { return 0.85; }
    if (OAD > 10.5 && OAD <= 10.6 && POZ == 5.2) { return 0.8; }
    if (OAD > 10.5 && OAD <= 10.6 && POZ == 5.4) { return 0.7; }
    if (OAD > 10.5 && OAD <= 10.6 && POZ == 5.6) { return 0.65; }
    if (OAD > 10.5 && OAD <= 10.6 && POZ == 5.8) { return 0.7; }
    if (OAD > 10.5 && OAD <= 10.6 && POZ == 6) { return 0.6; }
    if (OAD > 10.5 && OAD <= 10.6 && POZ == 6.2) { return 0.5; }
    if (OAD > 10.5 && OAD <= 10.6 && POZ == 6.4) { return 0.4; }
    if (OAD > 10.5 && OAD <= 10.6 && POZ == 6.5) { return 0.4; }
    if (OAD > 10.5 && OAD <= 10.6 && POZ == 6.6) { return 0.4; }

    if (OAD > 10.6 && OAD <= 10.7 && POZ == 5.0) { return 0.85; }
    if (OAD > 10.6 && OAD <= 10.7 && POZ == 5.2) { return 0.8; }
    if (OAD > 10.6 && OAD <= 10.7 && POZ == 5.4) { return 0.75; }
    if (OAD > 10.6 && OAD <= 10.7 && POZ == 5.6) { return 0.65; }
    if (OAD > 10.6 && OAD <= 10.7 && POZ == 5.8) { return 0.6; }
    if (OAD > 10.6 && OAD <= 10.7 && POZ == 6) { return 0.65; }
    if (OAD > 10.6 && OAD <= 10.7 && POZ == 6.2) { return 0.55; }
    if (OAD > 10.6 && OAD <= 10.7 && POZ == 6.4) { return 0.45; }
    if (OAD > 10.6 && OAD <= 10.7 && POZ == 6.5) { return 0.4; }
    if (OAD > 10.6 && OAD <= 10.7 && POZ == 6.6) { return 0.4; }

    if (OAD > 10.7 && OAD <= 10.8 && POZ == 5.0) { return 0.9; }
    if (OAD > 10.7 && OAD <= 10.8 && POZ == 5.2) { return 0.85; }
    if (OAD > 10.7 && OAD <= 10.8 && POZ == 5.4) { return 0.8; }
    if (OAD > 10.7 && OAD <= 10.8 && POZ == 5.6) { return 0.7; }
    if (OAD > 10.7 && OAD <= 10.8 && POZ == 5.8) { return 0.65; }
    if (OAD > 10.7 && OAD <= 10.8 && POZ == 6) { return 0.7; }
    if (OAD > 10.7 && OAD <= 10.8 && POZ == 6.2) { return 0.6; }
    if (OAD > 10.7 && OAD <= 10.8 && POZ == 6.4) { return 0.5; }
    if (OAD > 10.7 && OAD <= 10.8 && POZ == 6.5) { return 0.45; }
    if (OAD > 10.7 && OAD <= 10.8 && POZ == 6.6) { return 0.4; }

    if (OAD > 10.8 && OAD <= 10.9 && POZ == 5.0) { return 0.9; }
    if (OAD > 10.8 && OAD <= 10.9 && POZ == 5.2) { return 0.85; }
    if (OAD > 10.8 && OAD <= 10.9 && POZ == 5.4) { return 0.8; }
    if (OAD > 10.8 && OAD <= 10.9 && POZ == 5.6) { return 0.75; }
    if (OAD > 10.8 && OAD <= 10.9 && POZ == 5.8) { return 0.65; }
    if (OAD > 10.8 && OAD <= 10.9 && POZ == 6) { return 0.6; }
    if (OAD > 10.8 && OAD <= 10.9 && POZ == 6.2) { return 0.65; }
    if (OAD > 10.8 && OAD <= 10.9 && POZ == 6.4) { return 0.55; }
    if (OAD > 10.8 && OAD <= 10.9 && POZ == 6.5) { return 0.5; }
    if (OAD > 10.8 && OAD <= 10.9 && POZ == 6.6) { return 0.45; }

    if (OAD > 10.9 && OAD <= 11 && POZ == 5.0) { return 0.95; }
    if (OAD > 10.9 && OAD <= 11 && POZ == 5.2) { return 0.9; }
    if (OAD > 10.9 && OAD <= 11 && POZ == 5.4) { return 0.85; }
    if (OAD > 10.9 && OAD <= 11 && POZ == 5.6) { return 0.8; }
    if (OAD > 10.9 && OAD <= 11 && POZ == 5.8) { return 0.7; }
    if (OAD > 10.9 && OAD <= 11 && POZ == 6) { return 0.65; }
    if (OAD > 10.9 && OAD <= 11 && POZ == 6.2) { return 0.7; }
    if (OAD > 10.9 && OAD <= 11 && POZ == 6.4) { return 0.6; }
    if (OAD > 10.9 && OAD <= 11 && POZ == 6.5) { return 0.55; }
    if (OAD > 10.9 && OAD <= 11 && POZ == 6.6) { return 0.5; }

    if (OAD > 11 && OAD <= 11.1 && POZ == 5.0) { return 0.95; }
    if (OAD > 11 && OAD <= 11.1 && POZ == 5.2) { return 0.9; }
    if (OAD > 11 && OAD <= 11.1 && POZ == 5.4) { return 0.85; }
    if (OAD > 11 && OAD <= 11.1 && POZ == 5.6) { return 0.8; }
    if (OAD > 11 && OAD <= 11.1 && POZ == 5.8) { return 0.75; }
    if (OAD > 11 && OAD <= 11.1 && POZ == 6) { return 0.65; }
    if (OAD > 11 && OAD <= 11.1 && POZ == 6.2) { return 0.6; }
    if (OAD > 11 && OAD <= 11.1 && POZ == 6.4) { return 0.65; }
    if (OAD > 11 && OAD <= 11.1 && POZ == 6.5) { return 0.6; }
    if (OAD > 11 && OAD <= 11.1 && POZ == 6.6) { return 0.55; }

    if (OAD > 11.1 && OAD <= 11.2 && POZ == 5.0) { return 1; }
    if (OAD > 11.1 && OAD <= 11.2 && POZ == 5.2) { return 0.95; }
    if (OAD > 11.1 && OAD <= 11.2 && POZ == 5.4) { return 0.9; }
    if (OAD > 11.1 && OAD <= 11.2 && POZ == 5.6) { return 0.85; }
    if (OAD > 11.1 && OAD <= 11.2 && POZ == 5.8) { return 0.8; }
    if (OAD > 11.1 && OAD <= 11.2 && POZ == 6) { return 0.7; }
    if (OAD > 11.1 && OAD <= 11.2 && POZ == 6.2) { return 0.65; }
    if (OAD > 11.1 && OAD <= 11.2 && POZ == 6.4) { return 0.7; }
    if (OAD > 11.1 && OAD <= 11.2 && POZ == 6.5) { return 0.65; }
    if (OAD > 11.1 && OAD <= 11.2 && POZ == 6.6) { return 0.6; }

    if (OAD > 11.2 && OAD <= 11.3 && POZ == 5.0) { return 1; }
    if (OAD > 11.2 && OAD <= 11.3 && POZ == 5.2) { return 0.95; }
    if (OAD > 11.2 && OAD <= 11.3 && POZ == 5.4) { return 0.9; }
    if (OAD > 11.2 && OAD <= 11.3 && POZ == 5.6) { return 0.85; }
    if (OAD > 11.2 && OAD <= 11.3 && POZ == 5.8) { return 0.8; }
    if (OAD > 11.2 && OAD <= 11.3 && POZ == 6) { return 0.75; }
    if (OAD > 11.2 && OAD <= 11.3 && POZ == 6.2) { return 0.65; }
    if (OAD > 11.2 && OAD <= 11.3 && POZ == 6.4) { return 0.6; }
    if (OAD > 11.2 && OAD <= 11.3 && POZ == 6.5) { return 0.7; }
    if (OAD > 11.2 && OAD <= 11.3 && POZ == 6.6) { return 0.65; }

    if (OAD > 11.3 && OAD <= 11.4 && POZ == 5.0) { return 1.05; }
    if (OAD > 11.3 && OAD <= 11.4 && POZ == 5.2) { return 1; }
    if (OAD > 11.3 && OAD <= 11.4 && POZ == 5.4) { return 0.95; }
    if (OAD > 11.3 && OAD <= 11.4 && POZ == 5.6) { return 0.9; }
    if (OAD > 11.3 && OAD <= 11.4 && POZ == 5.8) { return 0.85; }
    if (OAD > 11.3 && OAD <= 11.4 && POZ == 6) { return 0.8; }
    if (OAD > 11.3 && OAD <= 11.4 && POZ == 6.2) { return 0.7; }
    if (OAD > 11.3 && OAD <= 11.4 && POZ == 6.4) { return 0.65; }
    if (OAD > 11.3 && OAD <= 11.4 && POZ == 6.5) { return 0.6; }
    if (OAD > 11.3 && OAD <= 11.4 && POZ == 6.6) { return 0.7; }

    if (OAD > 11.4 && OAD <= 11.5 && POZ == 5.0) { return 1.05; }
    if (OAD > 11.4 && OAD <= 11.5 && POZ == 5.2) { return 1; }
    if (OAD > 11.4 && OAD <= 11.5 && POZ == 5.4) { return 0.95; }
    if (OAD > 11.4 && OAD <= 11.5 && POZ == 5.6) { return 0.9; }
    if (OAD > 11.4 && OAD <= 11.5 && POZ == 5.8) { return 0.85; }
    if (OAD > 11.4 && OAD <= 11.5 && POZ == 6) { return 0.8; }
    if (OAD > 11.4 && OAD <= 11.5 && POZ == 6.2) { return 0.75; }
    if (OAD > 11.4 && OAD <= 11.5 && POZ == 6.4) { return 0.65; }
    if (OAD > 11.4 && OAD <= 11.5 && POZ == 6.5) { return 0.65; }
    if (OAD > 11.4 && OAD <= 11.5 && POZ == 6.6) { return 0.6; }

    if (OAD > 11.5 && POZ == 5.0) { return 1.1; }
    if (OAD > 11.5 && POZ == 5.2) { return 1.05; }
    if (OAD > 11.5 && POZ == 5.4) { return 1; }
    if (OAD > 11.5 && POZ == 5.6) { return 0.95; }
    if (OAD > 11.5 && POZ == 5.8) { return 0.9; }
    if (OAD > 11.5 && POZ == 6) { return 0.85; }
    if (OAD > 11.5 && POZ == 6.2) { return 0.8; }
    if (OAD > 11.5 && POZ == 6.4) { return 0.7; }
    if (OAD > 11.5 && POZ == 6.5) { return 0.65; }
    if (OAD > 11.5 && POZ == 6.6) { return 0.65; }

    return 0.5;
}


/// <summary>
/// Method: GetPCWidth.
/// </summary>
/// <param name="OAD"></param>
/// <param name="POZ"></param>
/// <returns></returns>
function GetPCWidth(OAD: number, POZ: number): number {
    if (OAD <= 9.8 && POZ == 5.0) { return 0.5; }
    if (OAD <= 9.8 && POZ == 5.2) { return 0.5; }
    if (OAD <= 9.8 && POZ == 5.4) { return 0.5; }
    if (OAD <= 9.8 && POZ == 5.6) { return 0.5; }
    if (OAD <= 9.8 && POZ == 5.8) { return 0.5; }
    if (OAD <= 9.8 && POZ == 6) { return 0.4; }
    if (OAD <= 9.8 && POZ == 6.2) { return 0.4; }
    if (OAD <= 9.8 && POZ == 6.4) { return 0.4; }
    if (OAD <= 9.8 && POZ == 6.5) { return 0.4; }
    if (OAD <= 9.8 && POZ == 6.6) { return 0.4; }
    if (OAD > 9.8 && OAD <= 9.9 && POZ == 5.0) { return 0.5; }
    if (OAD > 9.8 && OAD <= 9.9 && POZ == 5.2) { return 0.5; }
    if (OAD > 9.8 && OAD <= 9.9 && POZ == 5.4) { return 0.5; }
    if (OAD > 9.8 && OAD <= 9.9 && POZ == 5.6) { return 0.5; }
    if (OAD > 9.8 && OAD <= 9.9 && POZ == 5.8) { return 0.5; }
    if (OAD > 9.8 && OAD <= 9.9 && POZ == 6) { return 0.4; }
    if (OAD > 9.8 && OAD <= 9.9 && POZ == 6.2) { return 0.4; }
    if (OAD > 9.8 && OAD <= 9.9 && POZ == 6.4) { return 0.4; }
    if (OAD > 9.8 && OAD <= 9.9 && POZ == 6.5) { return 0.4; }
    if (OAD > 9.8 && OAD <= 9.9 && POZ == 6.6) { return 0.4; }

    if (OAD > 9.9 && OAD <= 10 && POZ == 5.0) { return 0.5; }
    if (OAD > 9.9 && OAD <= 10 && POZ == 5.2) { return 0.5; }
    if (OAD > 9.9 && OAD <= 10 && POZ == 5.4) { return 0.5; }
    if (OAD > 9.9 && OAD <= 10 && POZ == 5.6) { return 0.5; }
    if (OAD > 9.9 && OAD <= 10 && POZ == 5.8) { return 0.5; }
    if (OAD > 9.9 && OAD <= 10 && POZ == 6) { return 0.5; }
    if (OAD > 9.9 && OAD <= 10 && POZ == 6.2) { return 0.4; }
    if (OAD > 9.9 && OAD <= 10 && POZ == 6.4) { return 0.4; }
    if (OAD > 9.9 && OAD <= 10 && POZ == 6.5) { return 0.4; }
    if (OAD > 9.9 && OAD <= 10 && POZ == 6.6) { return 0.4; }

    if (OAD > 10 && OAD <= 10.1 && POZ == 5.0) { return 0.5; }
    if (OAD > 10 && OAD <= 10.1 && POZ == 5.2) { return 0.5; }
    if (OAD > 10 && OAD <= 10.1 && POZ == 5.4) { return 0.5; }
    if (OAD > 10 && OAD <= 10.1 && POZ == 5.6) { return 0.5; }
    if (OAD > 10 && OAD <= 10.1 && POZ == 5.8) { return 0.5; }
    if (OAD > 10 && OAD <= 10.1 && POZ == 6) { return 0.5; }
    if (OAD > 10 && OAD <= 10.1 && POZ == 6.2) { return 0.4; }
    if (OAD > 10 && OAD <= 10.1 && POZ == 6.4) { return 0.4; }
    if (OAD > 10 && OAD <= 10.1 && POZ == 6.5) { return 0.4; }
    if (OAD > 10 && OAD <= 10.1 && POZ == 6.6) { return 0.4; }

    if (OAD > 10.1 && OAD <= 10.2 && POZ == 5.0) { return 0.5; }
    if (OAD > 10.1 && OAD <= 10.2 && POZ == 5.2) { return 0.5; }
    if (OAD > 10.1 && OAD <= 10.2 && POZ == 5.4) { return 0.5; }
    if (OAD > 10.1 && OAD <= 10.2 && POZ == 5.6) { return 0.5; }
    if (OAD > 10.1 && OAD <= 10.2 && POZ == 5.8) { return 0.5; }
    if (OAD > 10.1 && OAD <= 10.2 && POZ == 6) { return 0.5; }
    if (OAD > 10.1 && OAD <= 10.2 && POZ == 6.2) { return 0.5; }
    if (OAD > 10.1 && OAD <= 10.2 && POZ == 6.4) { return 0.4; }
    if (OAD > 10.1 && OAD <= 10.2 && POZ == 6.5) { return 0.4; }
    if (OAD > 10.1 && OAD <= 10.2 && POZ == 6.6) { return 0.4; }

    if (OAD > 10.2 && OAD <= 10.3 && POZ == 5.0) { return 0.5; }
    if (OAD > 10.2 && OAD <= 10.3 && POZ == 5.2) { return 0.5; }
    if (OAD > 10.2 && OAD <= 10.3 && POZ == 5.4) { return 0.5; }
    if (OAD > 10.2 && OAD <= 10.3 && POZ == 5.6) { return 0.5; }
    if (OAD > 10.2 && OAD <= 10.3 && POZ == 5.8) { return 0.5; }
    if (OAD > 10.2 && OAD <= 10.3 && POZ == 6) { return 0.5; }
    if (OAD > 10.2 && OAD <= 10.3 && POZ == 6.2) { return 0.5; }
    if (OAD > 10.2 && OAD <= 10.3 && POZ == 6.4) { return 0.4; }
    if (OAD > 10.2 && OAD <= 10.3 && POZ == 6.5) { return 0.4; }
    if (OAD > 10.2 && OAD <= 10.3 && POZ == 6.6) { return 0.4; }

    if (OAD > 10.3 && OAD <= 10.4 && POZ == 5.0) { return 0.5; }
    if (OAD > 10.3 && OAD <= 10.4 && POZ == 5.2) { return 0.5; }
    if (OAD > 10.3 && OAD <= 10.4 && POZ == 5.4) { return 0.5; }
    if (OAD > 10.3 && OAD <= 10.4 && POZ == 5.6) { return 0.5; }
    if (OAD > 10.3 && OAD <= 10.4 && POZ == 5.8) { return 0.5; }
    if (OAD > 10.3 && OAD <= 10.4 && POZ == 6) { return 0.5; }
    if (OAD > 10.3 && OAD <= 10.4 && POZ == 6.2) { return 0.5; }
    if (OAD > 10.3 && OAD <= 10.4 && POZ == 6.4) { return 0.5; }
    if (OAD > 10.3 && OAD <= 10.4 && POZ == 6.5) { return 0.4; }
    if (OAD > 10.3 && OAD <= 10.4 && POZ == 6.6) { return 0.4; }

    if (OAD > 10.4 && OAD <= 10.5 && POZ == 5.0) { return 0.5; }
    if (OAD > 10.4 && OAD <= 10.5 && POZ == 5.2) { return 0.5; }
    if (OAD > 10.4 && OAD <= 10.5 && POZ == 5.4) { return 0.5; }
    if (OAD > 10.4 && OAD <= 10.5 && POZ == 5.6) { return 0.5; }
    if (OAD > 10.4 && OAD <= 10.5 && POZ == 5.8) { return 0.5; }
    if (OAD > 10.4 && OAD <= 10.5 && POZ == 6) { return 0.5; }
    if (OAD > 10.4 && OAD <= 10.5 && POZ == 6.2) { return 0.5; }
    if (OAD > 10.4 && OAD <= 10.5 && POZ == 6.4) { return 0.5; }
    if (OAD > 10.4 && OAD <= 10.5 && POZ == 6.5) { return 0.5; }
    if (OAD > 10.4 && OAD <= 10.5 && POZ == 6.6) { return 0.4; }

    if (OAD > 10.5 && OAD <= 10.6 && POZ == 5.0) { return 0.5; }
    if (OAD > 10.5 && OAD <= 10.6 && POZ == 5.2) { return 0.5; }
    if (OAD > 10.5 && OAD <= 10.6 && POZ == 5.4) { return 0.5; }
    if (OAD > 10.5 && OAD <= 10.6 && POZ == 5.6) { return 0.5; }
    if (OAD > 10.5 && OAD <= 10.6 && POZ == 5.8) { return 0.5; }
    if (OAD > 10.5 && OAD <= 10.6 && POZ == 6) { return 0.5; }
    if (OAD > 10.5 && OAD <= 10.6 && POZ == 6.2) { return 0.5; }
    if (OAD > 10.5 && OAD <= 10.6 && POZ == 6.4) { return 0.5; }
    if (OAD > 10.5 && OAD <= 10.6 && POZ == 6.5) { return 0.5; }
    if (OAD > 10.5 && OAD <= 10.6 && POZ == 6.6) { return 0.5; }

    if (OAD > 10.6 && OAD <= 10.7 && POZ == 5.0) { return 0.5; }
    if (OAD > 10.6 && OAD <= 10.7 && POZ == 5.2) { return 0.5; }
    if (OAD > 10.6 && OAD <= 10.7 && POZ == 5.4) { return 0.5; }
    if (OAD > 10.6 && OAD <= 10.7 && POZ == 5.6) { return 0.5; }
    if (OAD > 10.6 && OAD <= 10.7 && POZ == 5.8) { return 0.5; }
    if (OAD > 10.6 && OAD <= 10.7 && POZ == 6) { return 0.5; }
    if (OAD > 10.6 && OAD <= 10.7 && POZ == 6.2) { return 0.5; }
    if (OAD > 10.6 && OAD <= 10.7 && POZ == 6.4) { return 0.5; }
    if (OAD > 10.6 && OAD <= 10.7 && POZ == 6.5) { return 0.5; }
    if (OAD > 10.6 && OAD <= 10.7 && POZ == 6.6) { return 0.5; }

    if (OAD > 10.7 && OAD <= 10.8 && POZ == 5.0) { return 0.5; }
    if (OAD > 10.7 && OAD <= 10.8 && POZ == 5.2) { return 0.5; }
    if (OAD > 10.7 && OAD <= 10.8 && POZ == 5.4) { return 0.5; }
    if (OAD > 10.7 && OAD <= 10.8 && POZ == 5.6) { return 0.5; }
    if (OAD > 10.7 && OAD <= 10.8 && POZ == 5.8) { return 0.5; }
    if (OAD > 10.7 && OAD <= 10.8 && POZ == 6) { return 0.5; }
    if (OAD > 10.7 && OAD <= 10.8 && POZ == 6.2) { return 0.5; }
    if (OAD > 10.7 && OAD <= 10.8 && POZ == 6.4) { return 0.5; }
    if (OAD > 10.7 && OAD <= 10.8 && POZ == 6.5) { return 0.5; }
    if (OAD > 10.7 && OAD <= 10.8 && POZ == 6.6) { return 0.5; }

    if (OAD > 10.8 && OAD <= 10.9 && POZ == 5.0) { return 0.5; }
    if (OAD > 10.8 && OAD <= 10.9 && POZ == 5.2) { return 0.5; }
    if (OAD > 10.8 && OAD <= 10.9 && POZ == 5.4) { return 0.5; }
    if (OAD > 10.8 && OAD <= 10.9 && POZ == 5.6) { return 0.5; }
    if (OAD > 10.8 && OAD <= 10.9 && POZ == 5.8) { return 0.5; }
    if (OAD > 10.8 && OAD <= 10.9 && POZ == 6) { return 0.5; }
    if (OAD > 10.8 && OAD <= 10.9 && POZ == 6.2) { return 0.5; }
    if (OAD > 10.8 && OAD <= 10.9 && POZ == 6.4) { return 0.5; }
    if (OAD > 10.8 && OAD <= 10.9 && POZ == 6.5) { return 0.5; }
    if (OAD > 10.8 && OAD <= 10.9 && POZ == 6.6) { return 0.5; }

    if (OAD > 10.9 && OAD <= 11 && POZ == 5.0) { return 0.5; }
    if (OAD > 10.9 && OAD <= 11 && POZ == 5.2) { return 0.5; }
    if (OAD > 10.9 && OAD <= 11 && POZ == 5.4) { return 0.5; }
    if (OAD > 10.9 && OAD <= 11 && POZ == 5.6) { return 0.5; }
    if (OAD > 10.9 && OAD <= 11 && POZ == 5.8) { return 0.5; }
    if (OAD > 10.9 && OAD <= 11 && POZ == 6) { return 0.5; }
    if (OAD > 10.9 && OAD <= 11 && POZ == 6.2) { return 0.5; }
    if (OAD > 10.9 && OAD <= 11 && POZ == 6.4) { return 0.5; }
    if (OAD > 10.9 && OAD <= 11 && POZ == 6.5) { return 0.5; }
    if (OAD > 10.9 && OAD <= 11 && POZ == 6.6) { return 0.5; }

    if (OAD > 11 && OAD <= 11.1 && POZ == 5.0) { return 0.5; }
    if (OAD > 11 && OAD <= 11.1 && POZ == 5.2) { return 0.5; }
    if (OAD > 11 && OAD <= 11.1 && POZ == 5.4) { return 0.5; }
    if (OAD > 11 && OAD <= 11.1 && POZ == 5.6) { return 0.5; }
    if (OAD > 11 && OAD <= 11.1 && POZ == 5.8) { return 0.5; }
    if (OAD > 11 && OAD <= 11.1 && POZ == 6) { return 0.5; }
    if (OAD > 11 && OAD <= 11.1 && POZ == 6.2) { return 0.5; }
    if (OAD > 11 && OAD <= 11.1 && POZ == 6.4) { return 0.5; }
    if (OAD > 11 && OAD <= 11.1 && POZ == 6.5) { return 0.5; }
    if (OAD > 11 && OAD <= 11.1 && POZ == 6.6) { return 0.5; }

    if (OAD > 11.1 && OAD <= 11.2 && POZ == 5.0) { return 0.5; }
    if (OAD > 11.1 && OAD <= 11.2 && POZ == 5.2) { return 0.5; }
    if (OAD > 11.1 && OAD <= 11.2 && POZ == 5.4) { return 0.5; }
    if (OAD > 11.1 && OAD <= 11.2 && POZ == 5.6) { return 0.5; }
    if (OAD > 11.1 && OAD <= 11.2 && POZ == 5.8) { return 0.5; }
    if (OAD > 11.1 && OAD <= 11.2 && POZ == 6) { return 0.5; }
    if (OAD > 11.1 && OAD <= 11.2 && POZ == 6.2) { return 0.5; }
    if (OAD > 11.1 && OAD <= 11.2 && POZ == 6.4) { return 0.5; }
    if (OAD > 11.1 && OAD <= 11.2 && POZ == 6.5) { return 0.5; }
    if (OAD > 11.1 && OAD <= 11.2 && POZ == 6.6) { return 0.5; }

    if (OAD > 11.2 && OAD <= 11.3 && POZ == 5.0) { return 0.5; }
    if (OAD > 11.2 && OAD <= 11.3 && POZ == 5.2) { return 0.5; }
    if (OAD > 11.2 && OAD <= 11.3 && POZ == 5.4) { return 0.5; }
    if (OAD > 11.2 && OAD <= 11.3 && POZ == 5.6) { return 0.5; }
    if (OAD > 11.2 && OAD <= 11.3 && POZ == 5.8) { return 0.5; }
    if (OAD > 11.2 && OAD <= 11.3 && POZ == 6) { return 0.5; }
    if (OAD > 11.2 && OAD <= 11.3 && POZ == 6.2) { return 0.5; }
    if (OAD > 11.2 && OAD <= 11.3 && POZ == 6.4) { return 0.5; }
    if (OAD > 11.2 && OAD <= 11.3 && POZ == 6.5) { return 0.5; }
    if (OAD > 11.2 && OAD <= 11.3 && POZ == 6.6) { return 0.5; }

    if (OAD > 11.3 && OAD <= 11.4 && POZ == 5.0) { return 0.5; }
    if (OAD > 11.3 && OAD <= 11.4 && POZ == 5.2) { return 0.5; }
    if (OAD > 11.3 && OAD <= 11.4 && POZ == 5.4) { return 0.5; }
    if (OAD > 11.3 && OAD <= 11.4 && POZ == 5.6) { return 0.5; }
    if (OAD > 11.3 && OAD <= 11.4 && POZ == 5.8) { return 0.5; }
    if (OAD > 11.3 && OAD <= 11.4 && POZ == 6) { return 0.5; }
    if (OAD > 11.3 && OAD <= 11.4 && POZ == 6.2) { return 0.5; }
    if (OAD > 11.3 && OAD <= 11.4 && POZ == 6.4) { return 0.5; }
    if (OAD > 11.3 && OAD <= 11.4 && POZ == 6.5) { return 0.5; }
    if (OAD > 11.3 && OAD <= 11.4 && POZ == 6.6) { return 0.5; }

    if (OAD > 11.4 && OAD <= 11.5 && POZ == 5.0) { return 0.5; }
    if (OAD > 11.4 && OAD <= 11.5 && POZ == 5.2) { return 0.5; }
    if (OAD > 11.4 && OAD <= 11.5 && POZ == 5.4) { return 0.5; }
    if (OAD > 11.4 && OAD <= 11.5 && POZ == 5.6) { return 0.5; }
    if (OAD > 11.4 && OAD <= 11.5 && POZ == 5.8) { return 0.5; }
    if (OAD > 11.4 && OAD <= 11.5 && POZ == 6) { return 0.5; }
    if (OAD > 11.4 && OAD <= 11.5 && POZ == 6.2) { return 0.5; }
    if (OAD > 11.4 && OAD <= 11.5 && POZ == 6.4) { return 0.5; }
    if (OAD > 11.4 && OAD <= 11.5 && POZ == 6.5) { return 0.5; }
    if (OAD > 11.4 && OAD <= 11.5 && POZ == 6.6) { return 0.5; }

    if (OAD > 11.5 && POZ == 5.0) { return 0.5; }
    if (OAD > 11.5 && POZ == 5.2) { return 0.5; }
    if (OAD > 11.5 && POZ == 5.4) { return 0.5; }
    if (OAD > 11.5 && POZ == 5.6) { return 0.5; }
    if (OAD > 11.5 && POZ == 5.8) { return 0.5; }
    if (OAD > 11.5 && POZ == 6) { return 0.5; }
    if (OAD > 11.5 && POZ == 6.2) { return 0.5; }
    if (OAD > 11.5 && POZ == 6.4) { return 0.5; }
    if (OAD > 11.5 && POZ == 6.5) { return 0.5; }
    if (OAD > 11.5 && POZ == 6.6) { return 0.5; }

    return 0.5;
}

describe("Test Emerald Utilities", () => {


    // 2 dimensional object with a 4-tuple (e.g emeraldZoneChart[10.2][6.6] returns the [rcw, ac1w, ac2, pcw] for diameter 10.2, oz 6.6)
    interface IEmeraldZoneChart { [oad: number]: { [ozd: number]: [number, number, number, number] } }

    // This was used to generate the rows of the zone chart constant
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function generateChart() {
        const ozlist = [5, 5.2, 5.4, 5.6, 5.8, 6, 6.2, 6.4, 6.5, 6.6];
        const dlist = [9.6, 9.7, 9.8, 9.9, 10, 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7, 10.8, 10.9, 11, 11.1, 11.2, 11.3, 11.4, 11.5];
        for (const d of dlist) {
            const v: string[] = [];
            for (const oz of ozlist) {
                v.push(`${oz}: [${GetRCWidth(d, oz)}, ${GetAC1Width(d, oz)}, ${getAC2Width(d, oz)}, ${GetPCWidth(d, oz)}]`);
            }

            const x = `${d}: { ${v.join(", ")} },`;
            console.log(x);
        }
    }

    // generateChart();

    // this data structure was created using the above generating function:
    const emeraldZoneChart: IEmeraldZoneChart = {
        9.6: { 5: [0.4, 0.7, 0.7, 0.5], 5.2: [0.4, 0.7, 0.6, 0.5], 5.4: [0.4, 0.7, 0.5, 0.5], 5.6: [0.4, 0.7, 0.4, 0.5], 5.8: [0.4, 0.6, 0.4, 0.5], 6: [0.4, 0.6, 0.4, 0.4], 6.2: [0.4, 0.5, 0.4, 0.4], 6.4: [0.4, 0.5, 0.3, 0.4], 6.5: [0.4, 0.4, 0.35, 0.4], 6.6: [0.4, 0.4, 0.3, 0.4] },
        9.7: { 5: [0.5, 0.7, 0.7, 0.5], 5.2: [0.4, 0.7, 0.6, 0.5], 5.4: [0.4, 0.7, 0.5, 0.5], 5.6: [0.4, 0.7, 0.4, 0.5], 5.8: [0.4, 0.6, 0.4, 0.5], 6: [0.4, 0.6, 0.4, 0.4], 6.2: [0.4, 0.5, 0.4, 0.4], 6.4: [0.4, 0.5, 0.3, 0.4], 6.5: [0.4, 0.4, 0.35, 0.4], 6.6: [0.4, 0.4, 0.3, 0.4] },
        9.8: { 5: [0.5, 0.7, 0.7, 0.5], 5.2: [0.4, 0.7, 0.6, 0.5], 5.4: [0.4, 0.7, 0.5, 0.5], 5.6: [0.4, 0.7, 0.4, 0.5], 5.8: [0.4, 0.6, 0.4, 0.5], 6: [0.4, 0.6, 0.4, 0.4], 6.2: [0.4, 0.5, 0.4, 0.4], 6.4: [0.4, 0.5, 0.3, 0.4], 6.5: [0.4, 0.4, 0.35, 0.4], 6.6: [0.4, 0.4, 0.3, 0.4] },
        9.9: { 5: [0.6, 0.75, 0.6, 0.5], 5.2: [0.5, 0.7, 0.65, 0.5], 5.4: [0.5, 0.7, 0.55, 0.5], 5.6: [0.5, 0.7, 0.45, 0.5], 5.8: [0.5, 0.65, 0.4, 0.5], 6: [0.5, 0.6, 0.45, 0.4], 6.2: [0.5, 0.5, 0.45, 0.4], 6.4: [0.5, 0.5, 0.35, 0.4], 6.5: [0.5, 0.5, 0.3, 0.4], 6.6: [0.5, 0.4, 0.35, 0.4] },
        10: { 5: [0.6, 0.75, 0.65, 0.5], 5.2: [0.5, 0.7, 0.7, 0.5], 5.4: [0.5, 0.7, 0.6, 0.5], 5.6: [0.5, 0.7, 0.5, 0.5], 5.8: [0.5, 0.7, 0.4, 0.5], 6: [0.5, 0.6, 0.4, 0.5], 6.2: [0.5, 0.6, 0.4, 0.4], 6.4: [0.5, 0.5, 0.4, 0.4], 6.5: [0.5, 0.5, 0.35, 0.4], 6.6: [0.5, 0.5, 0.3, 0.4] },
        10.1: { 5: [0.6, 0.8, 0.65, 0.5], 5.2: [0.6, 0.75, 0.6, 0.5], 5.4: [0.5, 0.7, 0.65, 0.5], 5.6: [0.5, 0.7, 0.55, 0.5], 5.8: [0.5, 0.7, 0.45, 0.5], 6: [0.5, 0.65, 0.4, 0.5], 6.2: [0.5, 0.6, 0.45, 0.4], 6.4: [0.5, 0.5, 0.45, 0.4], 6.5: [0.5, 0.5, 0.4, 0.4], 6.6: [0.5, 0.5, 0.35, 0.4] },
        10.2: { 5: [0.6, 0.8, 0.7, 0.5], 5.2: [0.6, 0.75, 0.65, 0.5], 5.4: [0.5, 0.7, 0.7, 0.5], 5.6: [0.5, 0.7, 0.6, 0.5], 5.8: [0.5, 0.7, 0.5, 0.5], 6: [0.5, 0.7, 0.4, 0.5], 6.2: [0.5, 0.6, 0.4, 0.5], 6.4: [0.5, 0.6, 0.4, 0.4], 6.5: [0.5, 0.5, 0.45, 0.4], 6.6: [0.5, 0.5, 0.4, 0.4] },
        10.3: { 5: [0.6, 0.8, 0.75, 0.5], 5.2: [0.6, 0.8, 0.65, 0.5], 5.4: [0.6, 0.75, 0.6, 0.5], 5.6: [0.5, 0.7, 0.65, 0.5], 5.8: [0.5, 0.7, 0.55, 0.5], 6: [0.5, 0.7, 0.45, 0.5], 6.2: [0.5, 0.65, 0.4, 0.5], 6.4: [0.5, 0.6, 0.45, 0.4], 6.5: [0.5, 0.6, 0.4, 0.4], 6.6: [0.5, 0.5, 0.45, 0.4] },
        10.4: { 5: [0.6, 0.8, 0.8, 0.5], 5.2: [0.6, 0.8, 0.7, 0.5], 5.4: [0.6, 0.75, 0.65, 0.5], 5.6: [0.5, 0.7, 0.7, 0.5], 5.8: [0.5, 0.7, 0.6, 0.5], 6: [0.5, 0.7, 0.5, 0.5], 6.2: [0.5, 0.7, 0.4, 0.5], 6.4: [0.5, 0.6, 0.4, 0.5], 6.5: [0.5, 0.6, 0.45, 0.4], 6.6: [0.5, 0.6, 0.4, 0.4] },
        10.5: { 5: [0.6, 0.85, 0.8, 0.5], 5.2: [0.6, 0.8, 0.75, 0.5], 5.4: [0.6, 0.8, 0.65, 0.5], 5.6: [0.6, 0.75, 0.6, 0.5], 5.8: [0.5, 0.7, 0.65, 0.5], 6: [0.5, 0.7, 0.55, 0.5], 6.2: [0.5, 0.7, 0.45, 0.5], 6.4: [0.5, 0.65, 0.4, 0.5], 6.5: [0.5, 0.6, 0.4, 0.5], 6.6: [0.5, 0.6, 0.45, 0.4] },
        10.6: { 5: [0.6, 0.85, 0.85, 0.5], 5.2: [0.6, 0.8, 0.8, 0.5], 5.4: [0.6, 0.8, 0.7, 0.5], 5.6: [0.6, 0.75, 0.65, 0.5], 5.8: [0.5, 0.7, 0.7, 0.5], 6: [0.5, 0.7, 0.6, 0.5], 6.2: [0.5, 0.7, 0.5, 0.5], 6.4: [0.5, 0.7, 0.4, 0.5], 6.5: [0.5, 0.65, 0.4, 0.5], 6.6: [0.5, 0.6, 0.4, 0.5] },
        10.7: { 5: [0.6, 0.9, 0.85, 0.5], 5.2: [0.6, 0.85, 0.8, 0.5], 5.4: [0.6, 0.8, 0.75, 0.5], 5.6: [0.6, 0.8, 0.65, 0.5], 5.8: [0.6, 0.75, 0.6, 0.5], 6: [0.5, 0.7, 0.65, 0.5], 6.2: [0.5, 0.7, 0.55, 0.5], 6.4: [0.5, 0.7, 0.45, 0.5], 6.5: [0.5, 0.7, 0.4, 0.5], 6.6: [0.5, 0.65, 0.4, 0.5] },
        10.8: { 5: [0.6, 0.9, 0.9, 0.5], 5.2: [0.6, 0.85, 0.85, 0.5], 5.4: [0.6, 0.8, 0.8, 0.5], 5.6: [0.6, 0.8, 0.7, 0.5], 5.8: [0.6, 0.75, 0.65, 0.5], 6: [0.5, 0.7, 0.7, 0.5], 6.2: [0.5, 0.7, 0.6, 0.5], 6.4: [0.5, 0.7, 0.5, 0.5], 6.5: [0.5, 0.7, 0.45, 0.5], 6.6: [0.5, 0.7, 0.4, 0.5] },
        10.9: { 5: [0.6, 0.95, 0.9, 0.5], 5.2: [0.6, 0.9, 0.85, 0.5], 5.4: [0.6, 0.85, 0.8, 0.5], 5.6: [0.6, 0.8, 0.75, 0.5], 5.8: [0.6, 0.8, 0.65, 0.5], 6: [0.6, 0.75, 0.6, 0.5], 6.2: [0.5, 0.7, 0.65, 0.5], 6.4: [0.5, 0.7, 0.55, 0.5], 6.5: [0.5, 0.7, 0.5, 0.5], 6.6: [0.5, 0.7, 0.45, 0.5] },
        11: { 5: [0.6, 0.95, 0.95, 0.5], 5.2: [0.6, 0.9, 0.9, 0.5], 5.4: [0.6, 0.85, 0.85, 0.5], 5.6: [0.6, 0.8, 0.8, 0.5], 5.8: [0.6, 0.8, 0.7, 0.5], 6: [0.6, 0.75, 0.65, 0.5], 6.2: [0.5, 0.7, 0.7, 0.5], 6.4: [0.5, 0.7, 0.6, 0.5], 6.5: [0.5, 0.7, 0.55, 0.5], 6.6: [0.5, 0.7, 0.5, 0.5] },
        11.1: { 5: [0.6, 1, 0.95, 0.5], 5.2: [0.6, 0.95, 0.9, 0.5], 5.4: [0.6, 0.9, 0.85, 0.5], 5.6: [0.6, 0.85, 0.8, 0.5], 5.8: [0.6, 0.8, 0.75, 0.5], 6: [0.6, 0.8, 0.65, 0.5], 6.2: [0.6, 0.75, 0.6, 0.5], 6.4: [0.5, 0.7, 0.65, 0.5], 6.5: [0.5, 0.7, 0.6, 0.5], 6.6: [0.5, 0.7, 0.55, 0.5] },
        11.2: { 5: [0.6, 1, 1, 0.5], 5.2: [0.6, 0.95, 0.95, 0.5], 5.4: [0.6, 0.9, 0.9, 0.5], 5.6: [0.6, 0.85, 0.85, 0.5], 5.8: [0.6, 0.8, 0.8, 0.5], 6: [0.6, 0.8, 0.7, 0.5], 6.2: [0.6, 0.75, 0.65, 0.5], 6.4: [0.5, 0.7, 0.7, 0.5], 6.5: [0.5, 0.7, 0.65, 0.5], 6.6: [0.5, 0.7, 0.6, 0.5] },
        11.3: { 5: [0.6, 1.05, 1, 0.5], 5.2: [0.6, 1, 0.95, 0.5], 5.4: [0.6, 0.95, 0.9, 0.5], 5.6: [0.6, 0.9, 0.85, 0.5], 5.8: [0.6, 0.85, 0.8, 0.5], 6: [0.6, 0.8, 0.75, 0.5], 6.2: [0.6, 0.8, 0.65, 0.5], 6.4: [0.6, 0.75, 0.6, 0.5], 6.5: [0.5, 0.7, 0.7, 0.5], 6.6: [0.5, 0.7, 0.65, 0.5] },
        11.4: { 5: [0.6, 1.05, 1.05, 0.5], 5.2: [0.6, 1, 1, 0.5], 5.4: [0.6, 0.95, 0.95, 0.5], 5.6: [0.6, 0.9, 0.9, 0.5], 5.8: [0.6, 0.85, 0.85, 0.5], 6: [0.6, 0.8, 0.8, 0.5], 6.2: [0.6, 0.8, 0.7, 0.5], 6.4: [0.6, 0.75, 0.65, 0.5], 6.5: [0.6, 0.75, 0.6, 0.5], 6.6: [0.5, 0.7, 0.7, 0.5] },
        11.5: { 5: [0.6, 1.1, 1.05, 0.5], 5.2: [0.6, 1.05, 1, 0.5], 5.4: [0.6, 1, 0.95, 0.5], 5.6: [0.6, 0.95, 0.9, 0.5], 5.8: [0.6, 0.9, 0.85, 0.5], 6: [0.6, 0.85, 0.8, 0.5], 6.2: [0.6, 0.8, 0.75, 0.5], 6.4: [0.6, 0.8, 0.65, 0.5], 6.5: [0.6, 0.75, 0.65, 0.5], 6.6: [0.6, 0.75, 0.6, 0.5] },
    };

    function chartValidation() {

        const ozlist = [5.0, 5.2, 5.4, 5.6, 5.8, 6, 6.2, 6.4, 6.5, 6.6];
        const dlist = [9.6, 9.7, 9.8, 9.9, 10, 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7, 10.8, 10.9, 11, 11.1, 11.2, 11.3, 11.4, 11.5];

        for (const d of dlist) {
            for (const oz of ozlist) {

                // lookup widths using the original 1000 lines of source code:
                const [oldRcw, oldAc1w, oldAc2w, oldPcw] = [GetRCWidth(d, oz), GetAC1Width(d, oz), getAC2Width(d, oz), GetPCWidth(d, oz)];

                // look up widths uisng the new chart code:
                const [newRcw, newAc1w, newAc2w, newPcw] = emeraldZoneChart[d][oz];

                // validate the old system and the new system results are exactly the same for every input:
                if (oldRcw !== newRcw) throw new Error(`RC mismatch, ${d} ${oz}`);
                if (oldAc1w !== newAc1w) throw new Error(`AC1 mismatch, ${d} ${oz}`);
                if (oldAc2w !== newAc2w) throw new Error(`AC2 mismatch, ${d} ${oz}`);
                if (oldPcw !== newPcw) throw new Error(`PC mismatch, ${d} ${oz}`);

                // validate the chart data is itself valid :
                const testsum = round((newRcw + newAc1w + newAc2w + newPcw) * 2 + oz, 2);



                if (testsum !== d) {
                    console.log(`Chart Data Invalid for d=${d} oz=${oz} : expect ${d} actual ${testsum};  oz:${oz}, rc ${newRcw}, ac1 ${newAc1w}, ac2 ${newAc2w}, pc ${newPcw}`);
                    // throw new Error(`Chart Invalid, ${ d } ${ oz }`);
                }
            }
        }
    }

    // FIXME: Currently this returns errors for 9.7 and 9.8mm diamters due to bugs in Euclid data. Fix when Euclid defines fix
    chartValidation();



    // What follows below is some misc test code to test emerald calcs... leaving it here for now.

    // const flatK = 42;

    // const BCD = 6.2;
    // const BCW = BCD / 2;
    // const rx = -3;
    // const correctionConstant = 1;

    // const IR2 = 337.5 / (flatK);                                                                                    //AC1
    // const IR3 = 337.5 / (flatK - 1.5);                                                                              //AC2
    // const PAR = 337.5 / (flatK + rx - correctionConstant  /*+ _lens.AdjBCR */);                                     //BC

    // const irw1 = 0.5;                                                                                               // RCW

    // const push = (GetEmeraldPush(flatK, BCD, irw1, PAR));

    // const rc = CalcReverseCurve(BCW, PAR, IR2, irw1, push, 0);

    // console.log(push);
    // console.log(`Emerald Classic  ${PAR},  ${rc}, ${IR2}, ${IR3} `);


    // const flatK = 42.19;
    // const BCD = 6.2;
    // const BCW = BCD / 2;
    // const d = 11.2;
    // const rx = -1.5;
    // const correctionConstant = 0.75;

    // const IR2 = 337.5 / (flatK);                                                                                    //AC1
    // const IR3 = 337.5 / (flatK - 1.5);
    // const PC = 11.5;                                                                        //AC2
    // const PAR = 337.5 / (flatK + rx - correctionConstant  /*+ _lens.AdjBCR */);                                     //BC

    // const [irw1, irw2, irw3, irw4] = emeraldZoneChart[d][BCD];                                                      // RCW, AC1W, AC2W, PCW

    // const push = (GetEmeraldPush(flatK, BCD, irw1, PAR));

    // const rc = CalcReverseCurve(BCW, PAR, IR2, irw1, push, 0);
    // //console.log(rc);
    // //console.log(solveCircleRadiusOnYAxis({ x: BCW, y: circularSag(BCW, PAR) }, { x: BCW + irw1, y: circularSag(BCW + irw1, IR2) - push }));

    // const bcRadius = round(PAR, 2);
    // const rcRadius = round(rc, 2);
    // const ac1Radius = round(IR2, 2);
    // const ac2Radius = round(IR3, 2);
    // const pcRadius = round(PC, 2);

    // console.log(push);
    // console.log(`Emerald Shpere  bc ${bcRadius}, rc ${rcRadius}, ac1 ${ac1Radius}, ac2 ${ac2Radius}, pc ${pcRadius}, oz ${BCD}, rcw ${irw1}, ac1w ${irw2}, ac2w ${irw3}, pcw ${irw4} `);

    // const pusht = -0.005 * rx;

    // const toricity = 0.25;
    // const ac1RadiusSteep = round(convertDTomm(flatK + toricity), 2);
    // const ac2RadiusSteep = round(convertDTomm(flatK + toricity - 1.5), 2);
    // const rct = CalcReverseCurve(BCW, PAR, IR2, irw1, pusht, 0);
    // const rctsteep = round(CalcReverseCurve(BCW, PAR, ac1RadiusSteep, irw1, pusht, 0), 2);
    // const rctRadius = round(rct, 2);



    // console.log(pusht);
    // console.log(`Emerald Toric   bc ${bcRadius}, rc ${rctRadius}, ac1 ${ac1Radius}, ac2 ${ac2Radius}, pc ${pcRadius}, oz ${BCD}, rcw ${irw1}, ac1w ${irw2}, ac2w ${irw3}, pcw ${irw4}, steep rc ${rctsteep} steep ac1 ${ac1RadiusSteep}, steep ac2 ${ac2RadiusSteep}`);


    it("should verify standard katt functions are equivalent to emerald functions", () => {
        // carrier curve ==> essentially solve circle:
        // console.log("carrier curve check:");
        // console.log(CalcCarrierCurve(1, 2, 9.91608 - 9.65685));
        // console.log(solveCircleRadiusOnYAxis({ x: 1, y: 9.91608 }, { x: 2, y: 9.65685 }));
        expect(CalcCarrierCurve(1, 2, 9.91608 - 9.65685)).to.be.closeTo(solveCircleRadiusOnYAxis({ x: 1, y: 9.91608 }, { x: 2, y: 9.65685 }), 0.0001);

        // reverse curve ==> essentially solve circle:
        // console.log("reverse curve check");
        // console.log(CalcReverseCurve(3, 9.8, 7.6, 2, 0.12, 0));
        // console.log(solveCircleRadiusOnYAxis({ x: 3, y: circularSag(3, 9.8) }, { x: 3 + 2, y: circularSag(5, 7.6) - 0.12 }));
        expect(CalcReverseCurve(3, 9.8, 7.6, 2, 0.12, 0)).to.be.closeTo(solveCircleRadiusOnYAxis({ x: 3, y: circularSag(3, 9.8) }, { x: 3 + 2, y: circularSag(5, 7.6) - 0.12 }), 0.0001);
    });

});
