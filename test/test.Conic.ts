import { expect } from "chai";

import { Conic, ShapeFromE} from "../lib/index";

describe("Test Conic", () => {

    const conicA = new Conic(8, ShapeFromE(0), 3);
    describe("Test 'circular' Conic (r=8, e=0, w=3)", () => {
        it("should start at 0,0", () => {
            expect(conicA.startx).equals(0);
            expect(conicA.startz).equals(0);
        });
        it("should end at 3,0.584", () => {
            expect(conicA.endx).equals(3);
            expect(conicA.endz).closeTo(0.584, 0.001);
        });
    });

    const conicB = new Conic(8, ShapeFromE(0), 3);
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
    });

    const conicC = new Conic(8, ShapeFromE(0.5), 3);
    describe("Test 'elliptical' Conic (r=8, eccentricity = 0.5, w=3)", () => {
        it("should start at 0, 0", () => {
            expect(conicC.startx).equals(0);
            expect(conicC.startz).equals(0);
        });
        it("should end at 3, 0.578", () => {
            expect(conicC.endx).equals(3);
            expect(conicC.endz).closeTo(0.578, 0.001);
        });
    });

    const conicD = new Conic(8, ShapeFromE(0.5), 3);
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

    const conicE = new Conic(8, ShapeFromE(0.5), 3);
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
});
