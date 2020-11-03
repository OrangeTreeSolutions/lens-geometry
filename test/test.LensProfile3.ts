import { expect } from "chai";
import { ICurveDescriptor } from "../lib/ICurveDescriptor";
import { LensProfile } from "../lib/index";

const curveDescriptors: ICurveDescriptor[] = [
    {
        name: "TangentLine",
        width: 1,
        tangent: 20
    },
    {
        name: "TangentLine",
        width: 1,
        inheritTangent: true
    },
    {
        name: "TangentConvexTorus",
        width: 1,
        radius: 16,
        inheritTangent: true
    }
];



const lenspA = LensProfile.fromDescriptors(curveDescriptors);

describe("Test Inherit Tangent function of Lens Profile", () => {
    describe("Verify tangent inheritance worked", () => {
        it("should have spefied tangent in first zone", () => {
            expect(lenspA.getTangentAt(0.5)).equals(20);
        });
        it("should inherit tangent angle in 2nd zone", () => {
            expect(lenspA.getTangentAt(1.5)).equals(20);
        });
        it("should inherit tangent angle in 3rd zone", () => {
            // test a point just inside the zone
            expect(lenspA.getTangentAt(2.01)).closeTo(20.0, 0.1);
        });
    });
    const descriptorsA = lenspA.getCurveDescriptors();
    describe("Test correct LensCurve Descriptors are returned", () => {
        it("should return 2 Circle descriptors", () => {
            expect(descriptorsA.length).equals(3);
            expect(descriptorsA[0].name).equals("TangentLine");
            expect(descriptorsA[1].name).equals("TangentLine");
            expect(descriptorsA[2].name).equals("TangentConvexTorus");
            expect(descriptorsA[0].tangent).equals(20);
            expect(descriptorsA[1].tangent).equals(20);
            expect(descriptorsA[2].tangent).equals(20);
        });
    });
});
