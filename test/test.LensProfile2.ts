import { expect } from "chai";

import { Circle, Conic, LensProfile, shapeFromEcc } from "../lib/index";

const curve1 = new Conic(7.6, shapeFromEcc(0.65), 4.9);
const curve2 = new Circle(10, 0.625);

const lenspA = new LensProfile();
lenspA.addCurve(curve1);
lenspA.addCurve(curve2);

describe("Lens Profile Test 2", () => {
    describe("Test Simple Lens Profile (validated in focalpoints (PTS_PC-IV))", () => {
        it("should start at 0, 0", () => {
            expect(lenspA.sag(0)).equals(0);
        });
        it("should pass through 4.9, 1.688 ", () => {
            expect(lenspA.sag(4.9)).closeTo(1.688, 0.001);
        });
        it("should end at 5.25, 1.895 ", () => {
            expect(lenspA.sag(5.25)).closeTo(1.895, 0.001);
        });
    });
    const descriptorsA = lenspA.getCurveDescriptors();
    describe("Test correct LensCurve Descriptors are returned", () => {
        it("should return [1 Conic, 1 Circle] descriptor", () => {
            expect(descriptorsA.length).equals(2);
            expect(descriptorsA[0].name).equals("Conic");
            expect(descriptorsA[1].name).equals("Circle");
        });
    });
    const lenspB = LensProfile.fromDescriptors(descriptorsA);
    describe("Test profile is recreated from descriptors", () => {
        it("should start at 0, 0", () => {
            expect(lenspB.sag(0)).equals(0);
        });
        it("should pass through 4.9, 1.688 ", () => {
            expect(lenspB.sag(4.9)).closeTo(1.688, 0.001);
        });
        it("should end at 5.25, 1.895 ", () => {
            expect(lenspB.sag(5.25)).closeTo(1.895, 0.001);
        });
    });
});
