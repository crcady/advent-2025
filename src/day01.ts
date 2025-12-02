import { readFileSync } from "fs";
import { argv } from "process";
import { join } from "path";

const data = readFileSync(
  join(__dirname, "..", "data", "day01", argv[2]),
  "utf8",
);
const rows = data.trim().split("\n");
const moves = rows.map((x) => {
  const direction = x.charAt(0);
  const magnitude = Number(x.slice(1));
  return direction === "L" ? -magnitude : magnitude;
});

let positions = [50];
let i = 0;
for (const move of moves) {
  positions.push((positions[i] + move) % 100);
  i++;
}

console.log(positions.filter((x) => x == 0).length);

let many_positions = [50];
i = 0;
for (const move of moves) {
  const delta = move > 0 ? 1 : -1;
  for (let count = Math.abs(move); count > 0; count--) {
    many_positions.push((many_positions[i] + delta) % 100);
    i++;
  }
}

console.log(many_positions.filter((x) => x == 0).length);
