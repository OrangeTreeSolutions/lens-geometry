import { expect } from "chai";

import { Circle, LensCurve } from "../lib/index";

describe("Test Circle", () => {

    const circleA = new Circle(8, 3);
    describe("Test Circle (r=8,w=3)", () => {
        it("should start at 0,0", () => {
            expect(circleA.startx).equals(0);
            expect(circleA.startz).equals(0);
        });
        it("should end at 3,0.584", () => {
            expect(circleA.endx).equals(3);
            expect(circleA.endz).closeTo(0.584, 0.001);
        });
    });

    const circleB = new Circle(8, 3);
    circleB.translateToX(1);
    circleB.translateToZ(0);
    describe("Test Circle (r=8,w=3) with the sample segment tranlated to 1,0", () => {
        it("should start at 1, 0", () => {
            expect(circleB.startx).equals(1);
            expect(circleB.startz).equals(0);
        });
        it("should end at 4, 1.009", () => {
            expect(circleB.endx).equals(4);
            expect(circleB.endz).closeTo(1.009, 0.001);
        });
    });
});
