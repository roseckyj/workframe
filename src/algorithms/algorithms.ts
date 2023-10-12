import { GiftWrapConvexHull } from "./GiftWrapConvexHull";
import { SweepLineConvexHull } from "./SweepLineConvexHull";

export const algorithms: { [key: string]: any } = {
    "Convex Hull (Sweep line)": SweepLineConvexHull,
    "Convex Hull (Gift wrapping)": GiftWrapConvexHull,
};
