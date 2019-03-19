"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const index_1 = require("../lib/index");
describe("Test TangentLine", () => {
    const tanline0 = new index_1.TangentLine(0, 3);
    describe("Test TangentLine at 0 degrees", () => {
        it("should start at 0,0", () => {
            chai_1.expect(tanline0.startx).equals(0);
            chai_1.expect(tanline0.startz).equals(0);
        });
        it("should end at 3,0", () => {
            chai_1.expect(tanline0.endx).equals(3);
            chai_1.expect(tanline0.endz).equals(0);
        });
    });
    const tanline15 = new index_1.TangentLine(15, 3);
    describe("Test TangentLine at 15 degrees", () => {
        it("should start at 0,0", () => {
            chai_1.expect(tanline15.startx).equals(0);
            chai_1.expect(tanline15.startz).equals(0);
        });
        it("should end at 3, 0.8038", () => {
            chai_1.expect(tanline15.endx).equals(3);
            chai_1.expect(tanline15.endz).closeTo(0.8038, 0.0001);
        });
        it("should pass through 1.5, 0.4019", () => {
            chai_1.expect(tanline15.height(1.5)).closeTo(0.4019, 0.0001);
        });
    });
    const tanline15tr = new index_1.TangentLine(15, 3);
    tanline15tr.translateToX(1);
    tanline15tr.translateToZ(3);
    describe("Test TangentLine at 15 degrees translated to (1,3)", () => {
        it("should start at 1,3", () => {
            chai_1.expect(tanline15tr.startx).equals(1);
            chai_1.expect(tanline15tr.startz).equals(3);
        });
        it("should end at 4, 3.8038", () => {
            chai_1.expect(tanline15tr.endx).equals(4);
            chai_1.expect(tanline15tr.endz).closeTo(3.8038, 0.0001);
        });
        it("should pass through 2.5, 3.4019", () => {
            chai_1.expect(tanline15tr.height(2.5)).closeTo(3.4019, 0.0001);
        });
    });
});
//# sourceMappingURL=test.TangentLine.js.map