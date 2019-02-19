import { init, tail, slice, update, remove, assoc } from "ramda";

export const serializePoint = ({ x, y }) => x + "," + y;

export const serializePath = dotsArr =>
  dotsArr.reduce(
    ([stringPath, prevPoint], point) => {
      if (!prevPoint) return ["M" + point.x + "," + point.y, point];

      if (point.type === "M")
        return [stringPath + "M" + point.x + "," + point.y, point];

      if (point.type === undefined || point.type === "L")
        return [stringPath + "L" + point.x + "," + point.y, point];
    },
    [""]
  )[0];

export const removePoint = (points, index) => {
  if (index === 0) return tail(points);
  if (index === points.length - 1) return init(points);
  if (index === 1) return slice(2, Infinity, points);
  if (index === points.length - 2) return slice(0, points.length - 2, points);

  const nextPoint = assoc("type", "M", points[index + 1]);

  return update(index, nextPoint, remove(index, 1, points));
};
