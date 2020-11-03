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
        it("should identify as a circle", () => {
            expect(circleA.getClassName()).equals("Circle");
        });
        it('should have a tangent of 0 at 0', () => {
            expect(circleA.getTangentAt(0)).equals(0);
        });
        it('should have a tangent near 22 at 3', () => {
            expect(circleA.getTangentAt(3)).closeTo(22, 0.1);
        });
        it("should return the correct descriptor", () => {
            expect(circleA.getCurveDescriptor().name).equals("Circle");
            expect(circleA.getCurveDescriptor().width).equals(3);
            expect(circleA.getCurveDescriptor().radius).equals(8);
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

    const circleC = LensCurve.fromDescriptor(circleA.getCurveDescriptor());
    describe("Test Circle (r=8,w=3)", () => {
        it("should start at 0,0", () => {
            expect(circleC.startx).equals(0);
            expect(circleC.startz).equals(0);
        });
        it("should end at 3,0.584", () => {
            expect(circleC.endx).equals(3);
            expect(circleC.endz).closeTo(0.584, 0.001);
        });
        it("should identify as a circle", () => {
            expect(circleC.getClassName()).equals("Circle");
        });
        it("should return the original descriptor", () => {
            expect(circleC.getCurveDescriptor().name).equals("Circle");
            expect(circleC.getCurveDescriptor().width).equals(3);
            expect(circleC.getCurveDescriptor().radius).equals(8);
        });
    });
});
