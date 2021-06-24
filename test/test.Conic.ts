import { expect } from "chai";

import { Conic, LensCurve, shapeFromEcc } from "../lib/index";

describe("Test Conic", () => {

    const conicA = new Conic(8, shapeFromEcc(0), 3);
    describe("Test 'circular' Conic (r=8, e=0, w=3)", () => {
        it("should start at 0,0", () => {
            expect(conicA.startx).equals(0);
            expect(conicA.startz).equals(0);
        });
        it("should end at 3,0.584", () => {
            expect(conicA.endx).equals(3);
            expect(conicA.endz).closeTo(0.584, 0.001);
        });
        it("should have a tangent of 0 at 0", () => {
            expect(conicA.getTangentAt(0)).equals(0);
        });
        it("should have a tangent near 22 at 3", () => {
            expect(conicA.getTangentAt(3)).closeTo(22, 0.1);
        });
    });

    const conicB = new Conic(8, shapeFromEcc(0), 3);
    conicB.translateToX(1);
    conicB.translateToZ(0);
    describe("Test 'circular' Conic (r=8, e=0, w=3), with the sample segment tranlated to 1,0", () => {
        it("should start at 1, 0", () => {
            expect(conicB.startx).equals(1);
            expect(conicB.startz).equals(0);
        });
        it("should end at 4, 1.009", () => {
            expect(conicB.endx).equals(4);
            expect(conicB.endz).closeTo(1.009, 0.001);
        });
        it("should have a tangent near 22.0 at 3", () => {
            expect(conicB.getTangentAt(3)).closeTo(22.0, 0.1);
        });
    });

    const conicC = new Conic(8, shapeFromEcc(0.5), 3);
    describe("Test 'elliptical' Conic (r=8, eccentricity = 0.5, w=3)", () => {
        it("should start at 0, 0", () => {
            expect(conicC.startx).equals(0);
            expect(conicC.startz).equals(0);
        });
        it("should end at 3, 0.578", () => {
            expect(conicC.endx).equals(3);
            expect(conicC.endz).closeTo(0.578, 0.001);
        });
        it("should have a tangent of 0 at 0", () => {
            expect(conicC.getTangentAt(0)).equals(0);
        });
        it("should have a tangent near 21.6 at 3", () => {
            expect(conicC.getTangentAt(3)).closeTo(21.6, 0.1);
        });
    });

    const conicD = new Conic(8, shapeFromEcc(0.5), 3);
    conicD.translateToX(1);
    conicD.translateToZ(0);
    describe("Test 'elliptical' Conic (r=8, eccentricity = 0.5, w=3,) with the sample segment tranlated to 1,0", () => {
        it("should start at 1, 0", () => {
            expect(conicD.startx).equals(1);
            expect(conicD.startz).equals(0);
        });
        it("should end at 4, 0.989", () => {
            expect(conicD.endx).equals(4);
            expect(conicD.endz).closeTo(0.989, 0.001);
        });
    });

    const conicE = new Conic(8, shapeFromEcc(0.5), 3);
    conicE.translateToX(1);
    conicE.translateToZ(0.2);
    describe("Test 'elliptical' Conic (r=8, eccentricity = 0.5, w=3,) with the sample segment tranlated to 1, 0.2", () => {
        it("should start at 1, 0.2", () => {
            expect(conicE.startx).equals(1);
            expect(conicE.startz).equals(0.2);
        });
        it("should end at 4, 1.189", () => {
            expect(conicE.endx).equals(4);
            expect(conicE.endz).closeTo(1.189, 0.001);
        });
    });

    const conicF = LensCurve.fromDescriptor(conicE.getCurveDescriptor());
    // Because we didn't translate it the curve should be the same as conicC above!!
    describe("Test Conic Descriptor", () => {
        it("should start at 0, 0", () => {
            expect(conicF.startx).equals(0);
            expect(conicF.startz).equals(0);
        });
        it("should end at 3, 0.578", () => {
            expect(conicF.endx).equals(3);
            expect(conicF.endz).closeTo(0.578, 0.001);
        });
        it("should identify as a Conic", () => {
            expect(conicF.getClassName()).equals("Conic");
        });
        it("should return the original descriptor", () => {
            expect(conicF.getCurveDescriptor().name).equals("Conic");
            expect(conicF.getCurveDescriptor().width).equals(3);
            expect(conicF.getCurveDescriptor().radius).equals(8);
            expect(conicF.getCurveDescriptor().shape).equals(0.75);
        });
    });
    // should be the same as the above
    const conicG = LensCurve.fromDescriptor({ name: "Conic", width: 3, radius: 8, ecc: 0.5 });
    describe("Test Conic Descriptor using Ecc", () => {
        it("should start at 0, 0", () => {
            expect(conicG.startx).equals(0);
            expect(conicG.startz).equals(0);
        });
        it("should end at 3, 0.578", () => {
            expect(conicG.endx).equals(3);
            expect(conicG.endz).closeTo(0.578, 0.001);
        });
    });
});
