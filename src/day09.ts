import { readFileSync } from "fs";
import { argv } from "process";
import { join } from "path";

const data = readFileSync(
  join(__dirname, "..", "data", "day09", argv[2]),
  "utf8",
);
const rows = data.trim().split("\n");

interface Point {
  x: number;
  y: number;
}

const points = rows.map((row): Point => {
  const [x, y] = row.split(",").map((str) => Number(str));
  return {
    x: x,
    y: y,
  };
});

function find_largest(points: Point[]): number {
  let largest_rectangle = 0;
  for (let i = 0; i < points.length - 1; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const { x: x1, y: y1 } = points[i];
      const { x: x2, y: y2 } = points[j];
      const rect_size = (Math.abs(x2 - x1) + 1) * (Math.abs(y2 - y1) + 1);
      largest_rectangle = Math.max(largest_rectangle, rect_size);
    }
  }
  return largest_rectangle;
}

const largest_rectangle = find_largest(points);
console.log(largest_rectangle);

// SPOILER: Through manual inspection I discovered that
// I can chop the image in half and do some cheating
// You can paste the points into a SVG Polygon on MDN Playground
// directly to visualize them. I used fill="none", "stroke-width"="100"
// and stroke="black" to make it work out, but ymmv

function find_constrained(points: Point[]): number {
  class SizedRectangle {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    area: number;
    constructor(x1: number, y1: number, x2: number, y2: number) {
      this.x1 = x1;
      this.y1 = y1;
      this.x2 = x2;
      this.y2 = y2;
      this.area = (Math.abs(x2 - x1) + 1) * (Math.abs(y2 - y1) + 1);
    }
  }
  let rects: SizedRectangle[] = [];
  for (let i = 0; i < points.length - 1; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const { x: x1, y: y1 } = points[i];
      const { x: x2, y: y2 } = points[j];
      rects.push(new SizedRectangle(x1, y1, x2, y2));
    }
  }
  rects.sort((a, b) => b.area - a.area);
  outer: for (const { x1, y1, x2, y2, area } of rects) {
    const min_x = Math.min(x1, x2);
    const max_x = Math.max(x1, x2);
    const min_y = Math.min(y1, y2);
    const max_y = Math.max(y1, y2);
    for (const { x, y } of points) {
      if (x > min_x && x < max_x && y > min_y && y < max_y) {
        continue outer;
      }
    }
    return area;
  }
  return -1;
}

const bottom_half = points.slice(0, 249);
const top_half = points.slice(250);

console.log(
  Math.max(find_constrained(top_half), find_constrained(bottom_half)),
);
