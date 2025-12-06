import { readFileSync } from "fs";
import { argv } from "process";
import { join } from "path";

const data = readFileSync(
  join(__dirname, "..", "data", "day05", argv[2]),
  "utf8",
);
const rows = data.trim().split("\n");

type range = [number, number];
interface puzzle_input {
  ranges: range[];
  ingredients: number[];
}

const initial_puzzle: puzzle_input = {
  ranges: [],
  ingredients: [],
};

const puzzle: puzzle_input = rows.reduce((current, row) => {
  const nums = row.split("-");
  if (nums.length == 2) {
    const new_range: range = [Number(nums[0]), Number(nums[1])];
    current.ranges.push(new_range);
  } else if (nums[0] !== "") {
    current.ingredients.push(Number(nums[0]));
  }
  return current;
}, initial_puzzle);

const unspoiled = puzzle.ingredients.filter((x) => {
  for (const [low, high] of puzzle.ranges) {
    if (x >= low && x <= high) {
      return true;
    }
  }
  return false;
});

console.log(unspoiled.length);

const sorted = puzzle.ranges.sort((a, b) => a[0] - b[0]);

let [left, right] = sorted[0];
let sum = 0;

for (const [next_left, next_right] of sorted.slice(1, sorted.length - 1)) {
  if (next_left <= right) {
    right = Math.max(right, next_right);
  } else {
    sum += right - left + 1;
    left = next_left;
    right = next_right;
  }
}
sum += right - left + 1;

console.log(sum);
