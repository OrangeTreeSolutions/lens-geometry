"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const index_1 = require("../lib/index");
describe("Test TangentLine", () => {
    const circleA = new index_1.Circle(8, 3);
    describe("Test Circle (r=8,w=3)", () => {
        it("should start at 0,0", () => {
            chai_1.expect(circleA.startx).equals(0);
            chai_1.expect(circleA.startz).equals(0);
        });
        it("should end at 3,0.584", () => {
            chai_1.expect(circleA.endx).equals(3);
            chai_1.expect(circleA.endz).closeTo(0.584, 0.001);
        });
    });
    const circleB = new index_1.Circle(8, 3);
    circleB.translateToX(1);
    circleB.translateToZ(0);
    describe("Test Circle (r=8,w=3) with the sample segment tranlated to 1,0", () => {
        it("should start at 1, 0", () => {
            chai_1.expect(circleB.startx).equals(1);
            chai_1.expect(circleB.startz).equals(0);
        });
        it("should end at 4, 1.009", () => {
            chai_1.expect(circleB.endx).equals(4);
            chai_1.expect(circleB.endz).closeTo(1.009, 0.001);
        });
    });
});
//# sourceMappingURL=test.Circle.js.map