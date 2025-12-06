import { readFileSync } from "fs";
import { argv } from "process";
import { join } from "path";

const data = readFileSync(
  join(__dirname, "..", "data", "day02", argv[2]),
  "utf8",
);

type id_range = [number, number];

function to_range(s: string): id_range {
  const [first, last] = s.split("-");
  return [Number(first), Number(last)];
}

const ranges = data.trim().split(",").map(to_range);

function get_bad_ids(r: id_range): number[] {
  let bad: number[] = [];
  const [first, last] = r;
  for (let i = first; i <= last; i++) {
    const s = i.toString(10);
    if (s.length % 2 === 0) {
      const substr_a = s.slice(0, s.length / 2);
      const substr_b = s.slice(s.length / 2);
      if (substr_a === substr_b) {
        bad.push(i);
      }
    }
  }
  return bad;
}

function get_bad_ids2(r: id_range): number[] {
  let bad: number[] = [];
  const [first, last] = r;
  for (let i = first; i <= last; i++) {
    const s = i.toString(10);
    for (let j = 2; j <= s.length; j++) {
      if (s.length % j === 0) {
        const substr_a = s.slice(0, s.length / j);
        let is_bad = true;
        for (let k = substr_a.length; k < s.length; k += substr_a.length) {
          const substr_b = s.slice(k, k + substr_a.length);
          is_bad = is_bad && substr_a === substr_b;
        }
        if (is_bad) {
          bad.push(i);
        }
      }
    }
  }

  return [...new Set(bad)];
}

const bads: number[] = ranges.reduce<number[]>(
  (acc, r) => acc.concat(get_bad_ids(r)),
  [],
);

const bads2: number[] = ranges.reduce<number[]>(
  (acc, r) => acc.concat(get_bad_ids2(r)),
  [],
);

console.log(bads.reduce((sum, x) => sum + x, 0));
console.log(bads2.reduce((sum, x) => sum + x, 0));
