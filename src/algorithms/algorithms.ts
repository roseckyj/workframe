/* eslint-disable import/no-webpack-loader-syntax */
import { GiftWrapConvexHull } from "./GiftWrapConvexHull";
import { MonotonePolygonTriangulation } from "./MonotonePolygonTriangulation";
import { SweepLineConvexHull } from "./SweepLineConvexHull";

import giftWrapConvexHull from "!!raw-loader!./GiftWrapConvexHull.ts";
import monotonePolygonTriangulation from "!!raw-loader!./MonotonePolygonTriangulation.ts";
import sweepLineConvexHull from "!!raw-loader!./SweepLineConvexHull.ts";

export const algorithms: {
    [key: string]: {
        class: any;
        source: string;
    };
} = {
    "Monotone Polygon Triangulation": {
        class: MonotonePolygonTriangulation,
        source: monotonePolygonTriangulation,
    },
    "Convex Hull (Sweep line)": {
        class: SweepLineConvexHull,
        source: sweepLineConvexHull,
    },
    "Convex Hull (Gift wrapping)": {
        class: GiftWrapConvexHull,
        source: giftWrapConvexHull,
    },
};
