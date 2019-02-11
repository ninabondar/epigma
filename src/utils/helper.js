import { head, tail } from "ramda";

export const serializePoint = ({ x, y }) => x + "," + y;
export const serializePath = dotsArr => `
  M${serializePoint(head(dotsArr))}
  ${tail(dotsArr)
    .map(point => "L" + serializePoint(point))
    .join(" ")} 
`;
