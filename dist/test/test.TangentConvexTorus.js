"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const index_1 = require("../lib/index");
describe("Test TangentConvexTorus", () => {
    const torusA = new index_1.TangentConvexTorus(0, 8, 3);
    // note a tangentConvexTorus at 0,0 with tan of 0 is an upside down Circle curve
    describe("Test TangentConvexTorus resting on the horizontal at 0,0)", () => {
        it("should start at 0,0", () => {
            chai_1.expect(torusA.startx).equals(0);
            chai_1.expect(torusA.startz).equals(0);
        });
        it("should end at 3,-0.584", () => {
            chai_1.expect(torusA.endx).equals(3);
            chai_1.expect(torusA.endz).closeTo(-0.584, 0.001);
        });
    });
    // translating horizontally should, be the same shape, and not affect the z values
    const torusB = new index_1.TangentConvexTorus(0, 8, 3);
    torusB.translateToX(1);
    torusB.translateToZ(0);
    describe("Test TangentConvexTorus translated to 1,0", () => {
        it("should start at 1, 0", () => {
            chai_1.expect(torusB.startx).equals(1);
            chai_1.expect(torusB.startz).equals(0);
        });
        it("should end at 4, -0.584", () => {
            chai_1.expect(torusB.endx).equals(4);
            chai_1.expect(torusB.endz).closeTo(-0.584, 0.001);
        });
    });
    // translating horizontally + vertically should be the same shape, just offset
    const torusC = new index_1.TangentConvexTorus(0, 8, 3);
    torusC.translateToX(2);
    torusC.translateToZ(0.5);
    describe("Test TangentConvexTorus translated to 1,0", () => {
        it("should start at 1, 0", () => {
            chai_1.expect(torusC.startx).equals(2);
            chai_1.expect(torusC.startz).equals(0.5);
        });
        it("should end at 4, -0.584", () => {
            chai_1.expect(torusC.endx).equals(5);
            chai_1.expect(torusC.endz).closeTo(-0.084, 0.001);
        });
    });
    const torusD = new index_1.TangentConvexTorus(33, 8, 0.6);
    torusD.translateToX(4.7);
    torusD.translateToZ(1.564);
    describe("Test TangentConvexTorus translated, with a tangent 33 (validated in focalpoints)  ", () => {
        it("should start at 4.7, 1.564", () => {
            chai_1.expect(torusD.startx).closeTo(4.700, 0.001);
            chai_1.expect(torusD.startz).closeTo(1.564, 0.001);
        });
        it("should end at 5.3, 1.918", () => {
            chai_1.expect(torusD.endx).closeTo(5.300, 0.001);
            chai_1.expect(torusD.endz).closeTo(1.918, 0.001);
        });
    });
});
//# sourceMappingURL=test.TangentConvexTorus.js.map