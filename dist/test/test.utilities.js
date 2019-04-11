"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const index_1 = require("../lib/index");
describe("Test Utilities", () => {
    describe("convert Diopters to mm", () => {
        it("should equate 30 to 11.25", () => {
            chai_1.expect(index_1.convertDTomm(30)).equals(11.25);
        });
    });
    describe("convert mm to Diomters", () => {
        it("should equate 11.25 to 30", () => {
            chai_1.expect(index_1.convertmmToD(11.25)).equals(30);
        });
    });
    describe("convert Degrees to Radians", () => {
        it("should equate 90 to pi/2", () => {
            chai_1.expect(index_1.toRadians(90)).equals(Math.PI / 2);
        });
    });
    describe("convert Radians to Degrees", () => {
        it("should equate pi/4 to 45", () => {
            chai_1.expect(index_1.toDegrees(Math.PI / 4)).equals(45);
        });
    });
    describe("Test CircularSag", () => {
        it("should return 0 when x is 0", () => {
            chai_1.expect(index_1.circularSag(0, 8)).equals(0);
        });
        it("should return the radius at the radius", () => {
            chai_1.expect(index_1.circularSag(8, 8)).equals(8);
        });
        it("should return 1-sin(60) at x=cos(60)=0.5 when r=1", () => {
            chai_1.expect(index_1.circularSag(0.5, 1)).equals(1 - Math.sin(index_1.toRadians(60)));
        });
    });
    describe("Test ShapeFromEcc", () => {
        it("should return 1 when e=0 (circle)", () => {
            chai_1.expect(index_1.shapeFromEcc(0)).equals(1);
        });
        it("should return 0 when e=1 (parabola)", () => {
            chai_1.expect(index_1.shapeFromEcc(1)).equals(0);
        });
        it("should return 0.75 for e=0.5", () => {
            chai_1.expect(index_1.shapeFromEcc(0.5)).equals(0.75);
        });
    });
    describe("Test ShapeFromEcc", () => {
        it("should return 0 when p=1 (circle)", () => {
            chai_1.expect(index_1.eccFromShape(1)).equals(0);
        });
        it("should return 1 when e=0 (parabola)", () => {
            chai_1.expect(index_1.eccFromShape(0)).equals(1);
        });
        it("should return 0.75 for e=0.5", () => {
            chai_1.expect(index_1.eccFromShape(0.75)).equals(0.5);
        });
    });
    describe("Test ConicSag", () => {
        it("should return 0 when x is 0", () => {
            chai_1.expect(index_1.conicSag(0, 8.45, index_1.shapeFromEcc(0.56))).equals(0);
        });
        it("should return ~0.456 when x=2.75 and e=0.560 (validated vs focalpoints)", () => {
            chai_1.expect(index_1.conicSag(2.75, 8.45, index_1.shapeFromEcc(0.56))).closeTo(0.456, 0.001);
        });
        it("should return ~0.397 when x=2.50 and e=0.586 (validated vs focalpoints)", () => {
            chai_1.expect(index_1.conicSag(2.50, 8.00, index_1.shapeFromEcc(0.586))).closeTo(0.397, 0.001);
        });
    });
    describe("Test circleRadiusFromTwoPoints", () => {
        it("should return 2 when points are (x,y) = (0,2),(2,0) ", () => {
            chai_1.expect(index_1.solveCircleRadiusOnYAxis({ x: 0, y: 2 }, { x: 2, y: 0 })).equals(2);
        });
        it("should return 2 when points are (x,y) = (0,3),(2,1) ", () => {
            chai_1.expect(index_1.solveCircleRadiusOnYAxis({ x: 0, y: 3 }, { x: 2, y: 1 })).equals(2);
        });
        it("should return ~6 when points are (x,y) = (1, 9.91608), (2, 9.65685) validated vs Wolfram Alpha", () => {
            chai_1.expect(index_1.solveCircleRadiusOnYAxis({ x: 1, y: 9.91608 }, { x: 2, y: 9.65685 })).closeTo(6, 0.001);
        });
    });
});
//# sourceMappingURL=test.utilities.js.map