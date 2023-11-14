/* eslint-disable import/no-webpack-loader-syntax */
import { BuildKdTree } from "./BuildKdTree";
import { GiftWrapConvexHull } from "./GiftWrapConvexHull";
import { MonotonePolygonTriangulation } from "./MonotonePolygonTriangulation";
import { SweepLineConvexHull } from "./SweepLineConvexHull";

import buildKdTree from "!!raw-loader!./BuildKdTree.ts";
import giftWrapConvexHull from "!!raw-loader!./GiftWrapConvexHull.ts";
import monotonePolygonTriangulation from "!!raw-loader!./MonotonePolygonTriangulation.ts";
import sweepLineConvexHull from "!!raw-loader!./SweepLineConvexHull.ts";

export const algorithms: {
    [key: string]: {
        class: any;
        source: string;
    };
} = {
    "Build Kd-Tree": {
        class: BuildKdTree,
        source: buildKdTree,
    },
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
