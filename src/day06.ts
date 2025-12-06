import { readFileSync } from "fs";
import { argv, exit } from "process";
import { join } from "path";
import assert from "assert";

const data = readFileSync(
  join(__dirname, "..", "data", "day06", argv[2]),
  "utf8",
);
const rows = data.trim().split("\n");
const vectors = rows.map((x) => x.split(" ").filter((x) => x !== ""));
const num_problems = vectors[0].length;

for (const v of vectors) {
  assert(v.length === num_problems);
}

const operations = vectors[vectors.length - 1];
const operands = vectors.slice(0, vectors.length - 1);

const answers: number[] = operations.map((op, idx) => {
  switch (op) {
    case "+":
      return operands.reduce((acc, v) => acc + Number(v[idx]), 0);
    case "*":
      return operands.reduce((acc, v) => acc * Number(v[idx]), 1);
    default:
      console.log("PANIC! We got a bad operand!");
      return 0;
  }
});

console.log(answers.reduce((a, b) => a + b));

// Part Two, very different
let op = "+";
let args = [0];
let total = 0;

let last_row = rows[rows.length - 1];
let other_rows = rows.slice(0, rows.length - 1);

// I'm stripping white space above, which is breaking the last column
// Fixing that is complicated by editor settings that are adding a linebreak
// So this is a hacky fix to pad all the rows back out.

other_rows[0] = "  " + other_rows[0]; // This line has two leading spaces

let max_length = last_row.length;
for (const row of other_rows) {
  max_length = Math.max(max_length, row.length);
}

while (last_row.length < max_length) {
  last_row += " ";
}

for (let i = 0; i < other_rows.length; i++) {
  while (other_rows[i].length < max_length) {
    other_rows[i] += " ";
  }
}

// End hacky fix, begin hacky algorithm!
for (let i = 0; i < last_row.length; i++) {
  const current_char = last_row.charAt(i);
  if (current_char != " ") {
    if (op === "+") {
      total += args.reduce((acc, x) => acc + x);
    } else {
      total += args.reduce((acc, x) => acc * x);
    }
    if (Number.isNaN(total)) {
      console.log(`Total is NaN after processing ${op} ${args} on column `);
      process.exit(1);
    }
    op = current_char;
    args = [];
  }

  const vertical_read = other_rows.reduce(
    (partialstring, row) => partialstring + row.charAt(i),
    "",
  );
  if (vertical_read.trim() !== "") {
    args.push(Number(vertical_read));
  }
}

if (op === "+") {
  total += args.reduce((acc, x) => acc + x);
} else {
  total += args.reduce((acc, x) => acc * x);
}

console.log(total);
