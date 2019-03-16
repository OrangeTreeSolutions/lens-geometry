import { expect } from "chai";

import { CircularSag, ConicSag, ShapeFromE, ToDegrees, ToRadians } from "../lib/index";

describe("Test Utilities", () => {
    // describe("convert Diopters to mm", () => {
    //     it("should equate 30 to 11.25", () => {
    //         expect(callfund(30)).equals(11.25);
    //     });
    // });
    describe("convert Degrees to Radians", () => {
        it("should equate 90 to pi/2", () => {
            expect(ToRadians(90)).equals(Math.PI / 2);
        });
    });
    describe("convert Radians to Degrees", () => {
        it("should equate pi/4 to 45", () => {
            expect(ToDegrees(Math.PI / 4)).equals(45);
        });
    });

    describe("Test CircularSag", () => {
        it("should return 0 when x is 0", () => {
            expect(CircularSag(0, 8)).equals(0);
        });
        it("should return the radius at the radius", () => {
            expect(CircularSag(8, 8)).equals(8);
        });
        it("should return 1-sin(60) at x=cos(60)=0.5 when r=1", () => {
            expect(CircularSag(0.5, 1)).equals(1 - Math.sin(ToRadians(60)));
        });
    });

    describe("Test ShapeFromE", () => {
        it("should return 1 when e=0 (circle)", () => {
            expect(ShapeFromE(0)).equals(1);
        });
        it("should return 0 when e=1 (parabola)", () => {
            expect(ShapeFromE(1)).equals(0);
        });
        it("should return 0.75 for e=0.5", () => {
            expect(ShapeFromE(0.5)).equals(0.75);
        });
    });

    describe("Test ConicSag", () => {
        it("should return 0 when x is 0", () => {
            expect(ConicSag(0, 8.45, ShapeFromE(0.56))).equals(0);
        });
        it("should return ~0.456 when x=2.75 and e=0.560 (validated vs focalpoints)", () => {
            expect(ConicSag(2.75, 8.45, ShapeFromE(0.56))).closeTo(0.456, 0.001);
        });
        it("should return ~0.397 when x=2.50 and e=0.586 (validated vs focalpoints)", () => {
            expect(ConicSag(2.50, 8.00, ShapeFromE(0.586))).closeTo(0.397, 0.001);
        });
    });

});
