import { expect } from "chai";

import { Circle, Conic, LensProfile, TangentConvexTorus, TangentLine } from "../lib/index";

const curve1 = new Circle(7.896, 4.3);
const curve2 = new Circle(11.4, 0.5);

const lensp = new LensProfile();
lensp.addCurve(curve1);
lensp.addCurve(curve2);

describe("Test Simple Lens Profile (validated in focalpoints (APEX-C2))", () => {
    it("should start at 0, 0", () => {
        expect(lensp.sag(0)).equals(0);
    });
    it("should pass through 4.3, 1.274 ", () => {
        expect(lensp.sag(4.3)).closeTo(1.274, 0.001);
    });
    it("should end at 4.8, 1.491 ", () => {
        expect(lensp.sag(4.8)).closeTo(1.491, 0.001);
    });

    // random point chosen and validated in focalpoints with mouse hover (X,Z)
    it("should pass through 4.456, 1.383", () => {
        expect(lensp.sag(4.56)).closeTo(1.383, 0.001);
    });
});
