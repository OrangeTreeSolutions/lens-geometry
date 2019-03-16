"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const index_1 = require("../lib/index");
describe("Test Utilities", () => {
    // describe("convert Diopters to mm", () => {
    //     it("should equate 30 to 11.25", () => {
    //         expect(callfund(30)).equals(11.25);
    //     });
    // });
    describe("convert Degrees to Radians", () => {
        it("should equate 90 to pi/4", () => {
            chai_1.expect(index_1.ToRadians(30)).equals(Math.PI / 4);
        });
    });
    describe("convert Radians to Degrees", () => {
        it("should equate pi/8 to 48", () => {
            chai_1.expect(index_1.ToDegrees(Math.PI / 8)).equals(45);
        });
    });
});
//# sourceMappingURL=test1.js.map