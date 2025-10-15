import { expect } from "chai";
import { Circle, LensProfile } from "../lib/index";

const curve1 = new Circle(7.896, 4.3);
const curve2 = new Circle(11.4, 0.5);

const lenspA = new LensProfile();
lenspA.addCurve(curve1);
lenspA.addCurve(curve2);

describe("Test Simple Lens Profile", () => {
    describe("Test Simple Lens Profile (validated in focalpoints (APEX-C2))", () => {
        it("should start at 0, 0", () => {
            expect(lenspA.sag(0)).equals(0);
        });
        it("should pass through 4.3, 1.274 ", () => {
            expect(lenspA.sag(4.3)).closeTo(1.274, 0.001);
        });
        it("should end at 4.8, 1.491 ", () => {
            expect(lenspA.sag(4.8)).closeTo(1.491, 0.001);
        });

        // random point chosen and validated in focalpoints with mouse hover (X,Z)
        it("should pass through 4.456, 1.383", () => {
            expect(lenspA.sag(4.56)).closeTo(1.383, 0.001);
        });
    });
    const descriptorsA = lenspA.getCurveDescriptors();
    describe("Test correct LensCurve Descriptors are returned", () => {
        it("should return 2 Circle descriptors", () => {
            expect(descriptorsA.length).equals(2);
            expect(descriptorsA[0].name).equals("Circle");
            expect(descriptorsA[1].name).equals("Circle");
        });
    });
    const lenspB = LensProfile.fromDescriptors(descriptorsA);
    describe("Test profile is recreated from descriptors", () => {
        it("should start at 0, 0", () => {
            expect(lenspB.sag(0)).equals(0);
        });
        it("should pass through 4.3, 1.274 ", () => {
            expect(lenspB.sag(4.3)).closeTo(1.274, 0.001);
        });
        it("should end at 4.8, 1.491 ", () => {
            expect(lenspB.sag(4.8)).closeTo(1.491, 0.001);
        });

        // random point chosen and validated in focalpoints with mouse hover (X,Z)
        it("should pass through 4.456, 1.383", () => {
            expect(lenspB.sag(4.56)).closeTo(1.383, 0.001);
        });
    });
});
