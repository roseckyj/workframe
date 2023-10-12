/* eslint-disable import/no-webpack-loader-syntax */
import { GiftWrapConvexHull } from "./GiftWrapConvexHull";
import { SweepLineConvexHull } from "./SweepLineConvexHull";

import giftWrapConvexHull from "!!raw-loader!./GiftWrapConvexHull.ts";
import sweepLineConvexHull from "!!raw-loader!./SweepLineConvexHull.ts";

export const algorithms: {
    [key: string]: {
        class: any;
        source: string;
    };
} = {
    "Convex Hull (Sweep line)": {
        class: SweepLineConvexHull,
        source: sweepLineConvexHull,
    },
    "Convex Hull (Gift wrapping)": {
        class: GiftWrapConvexHull,
        source: giftWrapConvexHull,
    },
};
