import { readFileSync } from "fs";
import { argv } from "process";
import { join } from "path";
import assert from "assert";

const data = readFileSync(
  join(__dirname, "..", "data", "day04", argv[2]),
  "utf8",
);
const rows = data.trim().split("\n");

type coord = [number, number];

let paper_rolls: Set<coord> = new Set();

for (let i = 0; i < rows.length; i++) {
  const row = rows[i];
  for (let j = 0; j < row.length; j++) {
    if (row.charAt(j) === "@") {
      paper_rolls.add([i, j]);
    }
  }
}

const num_rows = rows.length;
const num_cols = rows[0].length;

function* generate_all_coords(
  rows: number,
  cols: number,
): Generator<coord, any, any> {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      yield [i, j];
    }
  }
}

const gen = generate_all_coords(num_rows, num_cols);
let count = 0;

// This entire concept of an index is to make up for the fact
// that JS sets and maps compare keys by identity, not by value
// Unlike Go or Python or Rust, which don't suck
function make_index(c: coord): number {
  const [i, j] = c;
  return i * num_rows + j;
}

const indexes = new Set([...paper_rolls].map(make_index));
assert(indexes.size === paper_rolls.size);

function check(c: coord, haystack: Set<number>): boolean {
  const [i, j] = c;
  const coords_to_check: coord[] = [
    [i - 1, j - 1],
    [i - 1, j],
    [i - 1, j + 1],
    [i, j - 1],
    [i, j + 1],
    [i + 1, j - 1],
    [i + 1, j],
    [i + 1, j + 1],
  ];
  let neighbors = 0;
  for (const c of coords_to_check) {
    const [x, y] = c;
    // Index doesn't work right with negative column values
    // so we'll clean that up here
    if (x < 0 || y < 0 || x >= num_rows || y >= num_cols) {
      continue;
    }
    if (haystack.has(make_index(c))) {
      neighbors++;
    }
  }
  return neighbors < 4;
}

for (const c of paper_rolls) {
  if (check(c, indexes)) {
    count++;
  }
}

console.log(count);

function recursive_remove(coord_set: Set<coord>): number {
  let removed_count = 0;
  let my_coord_copy = new Set(coord_set); //TODO: Is this pass by reference or by value (copy)?
  const haystack = new Set([...my_coord_copy].map(make_index));
  for (const c of my_coord_copy) {
    if (check(c, haystack)) {
      my_coord_copy.delete(c); // This feels icky, mutating mid-iteration
      removed_count++;
    }
  }
  if (removed_count > 0) {
    removed_count += recursive_remove(my_coord_copy);
  }
  return removed_count;
}

console.log(recursive_remove(paper_rolls));
