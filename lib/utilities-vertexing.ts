import { ceil, floor, round } from "lodash-es";
/**
 * vertexCorrection
 * @param {number} sphere    sphere power in diopters
 * @param {number} vertex    vertex distance in mm
 * @returns {number} power after vertex distance correction; rounded to 1/8th Diopter at 2 decimals
 */
export function vertexCorrection(sphere: number, vertex: number): number {
    // vertex the power
    const p = (Math.abs(sphere) > 4) ? (sphere / (1 - (vertex / 1000) * sphere)) : sphere;
    return roundToEighthDiopter(p);
}

/**
 * RoundToEighth Diopter
 * @param {number} diopter  power to round in diopters
 * @returns {number} power rounded to 1/8th diopter in 2 decimals
 */
export function roundToEighthDiopter(diopter: number): number {
    const precision = 2;
    let value = Math.round(diopter * 8) / 8;

    // Precision Trimming
    // this makes sure that 0.9999942 is 1.000, and 0.00000000023 is 0.000 (assuming precision is 2)
    value = round(value, precision + 1);

    // Precision Truncation
    // this takes 1/8th diopter steps for example (0.125 and makes them 0.12)
    value = (value >= 0) ? floor(value, precision) : ceil(value, precision);
    return value;
}
