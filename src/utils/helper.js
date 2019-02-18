import { head, tail } from "ramda";

export const serializePoint = ({ x, y }) => x + "," + y;

export const serializePath = dotsArr =>
  dotsArr.reduce(
    ([stringPath, prevPoint], point) => {
      if (!prevPoint) return ["M" + point.x + "," + point.y, point];

      if (point.type === "M" || prevPoint.type === "M") {
        return [stringPath + "M" + point.x + "," + point.y, point];
      }

      if (point.type === undefined || point.type === "L")
        return [stringPath + "L" + point.x + "," + point.y, point];
    },
    [""]
  )[0];
