"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const index_1 = require("../lib/index");
const curve1 = new index_1.Conic(7.6, index_1.shapeFromEcc(0.65), 4.9);
const curve2 = new index_1.Circle(10, 0.625);
const lensp = new index_1.LensProfile();
lensp.addCurve(curve1);
lensp.addCurve(curve2);
describe("Test Simple Lens Profile (validated in focalpoints (PTS_PC-IV))", () => {
    it("should start at 0, 0", () => {
        chai_1.expect(lensp.sag(0)).equals(0);
    });
    it("should pass through 4.9, 1.688 ", () => {
        chai_1.expect(lensp.sag(4.9)).closeTo(1.688, 0.001);
    });
    it("should end at 5.25, 1.895 ", () => {
        chai_1.expect(lensp.sag(5.25)).closeTo(1.895, 0.001);
    });
});
//# sourceMappingURL=test.LensProfile2.js.map