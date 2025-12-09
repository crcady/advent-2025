import { readFileSync } from "fs";
import { argv, exit } from "process";
import { join } from "path";

if (argv.length !== 4) {
  console.log(`usage: ${argv[0]} ${argv[1]} filename iterations`);
  exit(1);
}

const data = readFileSync(
  join(__dirname, "..", "data", "day08", argv[2]),
  "utf8",
);
const rows = data.trim().split("\n");

interface IndexedPoint {
  x: number;
  y: number;
  z: number;
  index: number;
}

interface DistanceOfIndexes {
  a: number;
  b: number;
  distance: number;
}

const points = rows.map((row, idx): IndexedPoint => {
  const [x, y, z] = row.split(",").map((str) => Number(str));
  return {
    x: x,
    y: y,
    z: z,
    index: idx,
  };
});

let distances: DistanceOfIndexes[] = [];
for (let i = 0; i < points.length - 1; i++) {
  for (let j = i + 1; j < points.length; j++) {
    const { x: x1, y: y1, z: z1 } = points[i];
    const { x: x2, y: y2, z: z2 } = points[j];
    distances.push({
      a: i,
      b: j,
      distance: Math.hypot(x1 - x2, y1 - y2, z1 - z2),
    });
  }
}

distances.sort((a, b) => a.distance - b.distance);

let circuits: (number | null)[] = Array(points.length).fill(null);

let next_circuit_id = 0;
const next_ckt = () => next_circuit_id++;

for (let i = 0; i < Number(argv[3]); i++) {
  const { a, b } = distances[i];
  const ckt_a = circuits[a];
  const ckt_b = circuits[b];
  if (ckt_a === null && ckt_b === null) {
    // If neither junction box is in a circuit,
    // we create a new one and add them both
    const new_ckt = next_ckt();
    circuits[a] = new_ckt;
    circuits[b] = new_ckt;
  } else if (ckt_a === null) {
    // Junction a joints junction b's group
    circuits[a] = ckt_b;
  } else if (ckt_b === null) {
    // Junction b joints junction a's group
    circuits[b] = ckt_a;
  } else if (ckt_a !== ckt_b) {
    // We arbitrarily choose b's group
    // and add a to it, along with all
    // of the other members of a's group
    for (let j = 0; j < circuits.length; j++) {
      if (circuits[j] === ckt_a) {
        circuits[j] = ckt_b;
      }
    }
  }
}

let counts: number[] = Array(next_circuit_id).fill(0);

for (const i of circuits) {
  if (i !== null) {
    counts[i]++;
  }
}

counts.sort((a, b) => b - a);
console.log(counts.slice(0, 3).reduce((a, b) => a * b));

// Part 2

circuits = Array(points.length).fill(null);

next_circuit_id = 0;

let a = 0,
  b = 0;

while (
  circuits[0] === null ||
  circuits.filter((x) => x === circuits[0]).length < circuits.length
) {
  ({ a, b } = distances.shift() as DistanceOfIndexes); // This will never be undefined
  const ckt_a = circuits[a];
  const ckt_b = circuits[b];
  if (ckt_a === null && ckt_b === null) {
    // If neither junction box is in a circuit,
    // we create a new one and add them both
    const new_ckt = next_ckt();
    circuits[a] = new_ckt;
    circuits[b] = new_ckt;
  } else if (ckt_a === null) {
    // Junction a joints junction b's group
    circuits[a] = ckt_b;
  } else if (ckt_b === null) {
    // Junction b joints junction a's group
    circuits[b] = ckt_a;
  } else if (ckt_a !== ckt_b) {
    // We arbitrarily choose b's group
    // and add a to it, along with all
    // of the other members of a's group
    for (let j = 0; j < circuits.length; j++) {
      if (circuits[j] === ckt_a) {
        circuits[j] = ckt_b;
      }
    }
  }
}

console.log(points[a].x * points[b].x);
