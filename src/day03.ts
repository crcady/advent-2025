import { readFileSync } from "fs";
import { argv } from "process";
import { join } from "path";

const data = readFileSync(
  join(__dirname, "..", "data", "day03", argv[2]),
  "utf8",
);
const rows = data.trim().split("\n");

const joltages = rows.map((s) => s.split("").map((digit) => Number(digit)));

function get_best(nums: number[], digits: number): number {
  let sum = 0;
  let digits_consumed = 0;
  for (
    let digits_remaining = digits - 1;
    digits_remaining >= 0;
    digits_remaining--
  ) {
    const next_digit = Math.max(
      ...nums.slice(digits_consumed, nums.length - digits_remaining),
    );
    const next_index =
      nums.slice(digits_consumed).findIndex((x) => x === next_digit) +
      digits_consumed;
    sum += next_digit * 10 ** digits_remaining;
    digits_consumed = next_index + 1;
  }
  return sum;
}

const best_numbers = joltages.map((x) => get_best(x, 2));
console.log(best_numbers.reduce((acc, x) => acc + x));

const best_numbers2 = joltages.map((x) => get_best(x, 12));
console.log(best_numbers2.reduce((acc, x) => acc + x));
