import { expect } from "chai";

import { roundToEighthDiopter, vertexCorrection } from "../lib/index";

describe("Test Vertexing Utilities", () => {
    describe("roundToEigthDiopter", () => {
        it("should round 0D to 0", () => {
            expect(roundToEighthDiopter(0)).equals(0);
        });
        it("should round 1.1D to 1.12", () => {
            expect(roundToEighthDiopter(1.1)).equals(1.12);
        });
        it("should round 1.15D to 1.12", () => {
            expect(roundToEighthDiopter(1.15)).equals(1.12);
        });
        it("should round 1.2D to 1.25", () => {
            expect(roundToEighthDiopter(1.2)).equals(1.25);
        });
        it("should round -1.1D to -1.12", () => {
            expect(roundToEighthDiopter(-1.1)).equals(-1.12);
        });
        it("should round -1.15D to -1.12", () => {
            expect(roundToEighthDiopter(-1.15)).equals(-1.12);
        });
        it("should round -1.2D to -1.25", () => {
            expect(roundToEighthDiopter(-1.2)).equals(-1.25);
        });
    });

    describe("vertexCorrection", () => {
        it("should correct 0D to 0", () => {
            expect(vertexCorrection(0, 12)).equals(0);
        });
        it("should correct -4.5D to 4.25", () => {
            expect(vertexCorrection(-4.5, 12)).equals(-4.25);
        });
        it("should correct +4.5D to 4.75", () => {
            expect(vertexCorrection(4.5, 12)).equals(4.75);
        });
        it("should correct -10D to 8.37", () => {
            expect(vertexCorrection(-10, 12)).equals(-8.87);
        });
        it("should correct +10D to 11.37", () => {
            expect(vertexCorrection(10, 12)).equals(11.37);
        });
    });
});
