import { expect } from "chai";

import { Circle, Conic, LensProfile, shapeFromE } from "../lib/index";

const curve1 = new Conic(7.6, shapeFromE(0.65), 4.9);
const curve2 = new Circle(10, 0.625);

const lensp = new LensProfile();
lensp.addCurve(curve1);
lensp.addCurve(curve2);

describe("Test Simple Lens Profile (validated in focalpoints (PTS_PC-IV))", () => {
    it("should start at 0, 0", () => {
        expect(lensp.sag(0)).equals(0);
    });
    it("should pass through 4.9, 1.688 ", () => {
        expect(lensp.sag(4.9)).closeTo(1.688, 0.001);
    });
    it("should end at 5.25, 1.895 ", () => {
        expect(lensp.sag(5.25)).closeTo(1.895, 0.001);
    });
});
