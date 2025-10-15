import { expect } from "chai";
import { LensCurve, TangentConvexTorus } from "../lib/index";

describe("Test TangentConvexTorus", () => {

    const torusA = new TangentConvexTorus(0, 8, 3);
    // note a tangentConvexTorus at 0,0 with tan of 0 is an upside down Circle curve
    describe("Test TangentConvexTorus resting on the horizontal at 0,0)", () => {
        it("should start at 0,0", () => {
            expect(torusA.startx).equals(0);
            expect(torusA.startz).equals(0);
        });
        it("should end at 3,-0.584", () => {
            expect(torusA.endx).equals(3);
            expect(torusA.endz).closeTo(-0.584, 0.001);
        });
        it("should have a tangent of 0 at 0", () => {
            expect(torusA.getTangentAt(0)).equals(0);
        });
        it("should have a tangent near 22 at 3", () => {
            // the tangent is negative; because relative to a circle at the same position its upside down
            expect(torusA.getTangentAt(3)).closeTo(-22, 0.1);
        });
    });

    // translating horizontally should, be the same shape, and not affect the z values
    const torusB = new TangentConvexTorus(0, 8, 3);
    torusB.translateToX(1);
    torusB.translateToZ(0);
    describe("Test TangentConvexTorus translated to 1,0", () => {
        it("should start at 1, 0", () => {
            expect(torusB.startx).equals(1);
            expect(torusB.startz).equals(0);
        });
        it("should end at 4, -0.584", () => {
            expect(torusB.endx).equals(4);
            expect(torusB.endz).closeTo(-0.584, 0.001);
        });
    });

    // translating horizontally + vertically should be the same shape, just offset
    const torusC = new TangentConvexTorus(0, 8, 3);
    torusC.translateToX(2);
    torusC.translateToZ(0.5);
    describe("Test TangentConvexTorus translated to 1,0", () => {
        it("should start at 1, 0", () => {
            expect(torusC.startx).equals(2);
            expect(torusC.startz).equals(0.5);
        });
        it("should end at 4, -0.584", () => {
            expect(torusC.endx).equals(5);
            expect(torusC.endz).closeTo(-0.084, 0.001);
        });
    });

    const torusD = new TangentConvexTorus(33, 8, 0.6);
    torusD.translateToX(4.7);
    torusD.translateToZ(1.564);
    describe("Test TangentConvexTorus translated, with a tangent 33 (validated in focalpoints)  ", () => {
        it("should start at 4.7, 1.564", () => {
            expect(torusD.startx).closeTo(4.700, 0.001);
            expect(torusD.startz).closeTo(1.564, 0.001);
        });
        it("should end at 5.3, 1.918", () => {
            expect(torusD.endx).closeTo(5.300, 0.001);
            expect(torusD.endz).closeTo(1.918, 0.001);
        });
        it("should have a tangent at the startX (x=4.7) at what we specified it should be", () => {
            expect(torusD.getTangentAt(4.7)).closeTo(33, 0.01);
        });
        it("should flatten (lower tangent) as we move out from the startX (x=5.0)", () => {
            expect(torusD.getTangentAt(5)).closeTo(30.5, 0.1);
        });
    });

    const torusE = LensCurve.fromDescriptor(torusA.getCurveDescriptor());
    // creating from torusA
    describe("Test TangentConvexTorus fromDescriptor resting on the horizontal at 0,0)", () => {
        it("should start at 0,0", () => {
            expect(torusE.startx).equals(0);
            expect(torusE.startz).equals(0);
        });
        it("should end at 3,-0.584", () => {
            expect(torusE.endx).equals(3);
            expect(torusE.endz).closeTo(-0.584, 0.001);
        });
        it("should identify as a TangentConvexTorus", () => {
            expect(torusE.getClassName()).equals("TangentConvexTorus");
        });
        it("should return the original descriptor", () => {
            expect(torusE.getCurveDescriptor().name).equals("TangentConvexTorus");
            expect(torusE.getCurveDescriptor().width).equals(3);
            expect(torusE.getCurveDescriptor().radius).equals(8);
            expect(torusE.getCurveDescriptor().tangent).equals(0);
        });
    });
});
