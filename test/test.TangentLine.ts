import { expect } from "chai";

import { LensCurve, TangentLine } from "../lib/index";

describe("Test TangentLine", () => {

    const tanline0 = new TangentLine(0, 3);
    describe("Test TangentLine at 0 degrees", () => {
        it("should start at 0,0", () => {
            expect(tanline0.startx).equals(0);
            expect(tanline0.startz).equals(0);
        });
        it("should end at 3,0", () => {
            expect(tanline0.endx).equals(3);
            expect(tanline0.endz).equals(0);
        });
    });

    const tanline15 = new TangentLine(15, 3);
    describe("Test TangentLine at 15 degrees", () => {
        it("should start at 0,0", () => {
            expect(tanline15.startx).equals(0);
            expect(tanline15.startz).equals(0);
        });
        it("should end at 3, 0.8038", () => {
            expect(tanline15.endx).equals(3);
            expect(tanline15.endz).closeTo(0.8038, 0.0001);
        });
        it("should pass through 1.5, 0.4019", () => {
            expect(tanline15.height(1.5)).closeTo(0.4019, 0.0001);
        });
    });

    const tanline15tr = new TangentLine(15, 3);
    tanline15tr.translateToX(1);
    tanline15tr.translateToZ(3);
    describe("Test TangentLine at 15 degrees translated to (1,3)", () => {
        it("should start at 1,3", () => {
            expect(tanline15tr.startx).equals(1);
            expect(tanline15tr.startz).equals(3);
        });
        it("should end at 4, 3.8038", () => {
            expect(tanline15tr.endx).equals(4);
            expect(tanline15tr.endz).closeTo(3.8038, 0.0001);
        });
        it("should pass through 2.5, 3.4019", () => {
            expect(tanline15tr.height(2.5)).closeTo(3.4019, 0.0001);
        });
    });

    const tanlineB = LensCurve.fromDescriptor(tanline0.getCurveDescriptor());
    describe("Test TangentLine Descriptor", () => {
        it("should start at 0,0", () => {
            expect(tanlineB.startx).equals(0);
            expect(tanlineB.startz).equals(0);
        });
        it("should end at 3,0", () => {
            expect(tanlineB.endx).equals(3);
            expect(tanlineB.endz).equals(0);
        });
        it("should identify as a TangentLine", () => {
            expect(tanlineB.getClassName()).equals("TangentLine");
        });
        it("should return the original descriptor", () => {
            expect(tanlineB.getCurveDescriptor().name).equals("TangentLine");
            expect(tanlineB.getCurveDescriptor().width).equals(3);
            expect(tanlineB.getCurveDescriptor().tangent).equals(0);
        });
    });

});
