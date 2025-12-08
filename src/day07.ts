import { readFileSync } from "fs";
import { argv } from "process";
import { join } from "path";
import assert from "assert";
import { time } from "console";

const data = readFileSync(
  join(__dirname, "..", "data", "day07", argv[2]),
  "utf8",
);
const rows = data.trim().split("\n");

// We'll keep the number of times the beam has hit a splitter in a global var
let num_splits = 0;

interface manifold_square {
  char: string;
  timelines: number;
}

const manifold_rows = rows.map((row) => {
  let manifold_row: manifold_square[] = [];
  for (const char of row) {
    manifold_row.push({ char: char, timelines: 0 });
  }
  return manifold_row;
});

function transform_row(
  curr_row: manifold_square[],
  prev_row: manifold_square[],
): manifold_square[] {
  let next_row: manifold_square[] = [];
  for (let j = 0; j < curr_row.length; j++) {
    const above = prev_row[j];
    if (curr_row[j].char === ".") {
      if (above.char === "S" || above.char === "|") {
        let timelines = above.char === "S" ? 1 : above.timelines;
        if (prev_row[j - 1]?.char === "^") {
          timelines += prev_row[j - 1].timelines;
        }

        if (prev_row[j + 1]?.char === "^") {
          timelines += prev_row[j + 1].timelines;
        }
        next_row.push({ char: "|", timelines: timelines });
      } else if (
        prev_row[j - 1]?.char === "^" ||
        prev_row[j + 1]?.char === "^"
      ) {
        let timelines = 0;
        if (prev_row[j - 1]?.char === "^") {
          timelines += prev_row[j - 1].timelines;
        }

        if (prev_row[j + 1]?.char === "^") {
          timelines += prev_row[j + 1].timelines;
        }
        next_row.push({
          char: "|",
          timelines: timelines,
        });
      } else {
        next_row.push({ char: ".", timelines: 0 });
      }
    } else {
      // this covers the only other case, "^"
      if (above.char === "|") {
        next_row.push({ char: "^", timelines: above.timelines });
        num_splits++;
      } else {
        next_row.push({ char: "*", timelines: 0 }); // Introduce a new symbol for unused splitters
      }
    }
  }
  assert(next_row.length === curr_row.length);
  return next_row;
}

let rows_with_beams = manifold_rows.slice(0, 1);

let prev_row = manifold_rows[0];
for (const curr_row of manifold_rows.slice(1)) {
  const next_row = transform_row(curr_row, prev_row);
  rows_with_beams.push(next_row);
  prev_row = next_row;
}

assert(rows.length === rows_with_beams.length);

if (argv[2] === "sample.txt") {
  for (const row of rows_with_beams) {
    console.log(
      row.reduce((str, x) => str + x.char, "") +
        row
          .filter((x) => x.char === "|")
          .reduce((str, x) => str + ` ${x.timelines}`, ""),
    );
  }
}
console.log(num_splits);
console.log(
  rows_with_beams[rows_with_beams.length - 1].reduce(
    (acc, x) => (acc += x.timelines),
    0,
  ),
);
