import { readFileSync } from "fs";
import { argv, exit } from "process";
import { join } from "path";
import { Assert } from "assert";

const data = readFileSync(
  join(__dirname, "..", "data", "day11", argv[2]),
  "utf8",
);
const rows = data.trim().split("\n");
const the_map = new Map<string, string[]>();

for (const row of rows) {
  const [input, remaining] = row.split(":");
  const outputs = remaining.trim().split(" ");
  the_map.set(input, outputs);
}

function recursive_dfs(current: string, target: string): number {
  if (current === target) {
    return 1;
  }

  return (
    the_map
      .get(current)
      ?.map((x) => recursive_dfs(x, target))
      .reduce((a, b) => a + b) ?? 0
  );
}

console.log(recursive_dfs("you", "out"));

const back_map = new Map<string, string[]>();
for (const [k, v] of the_map.entries()) {
  back_map.set(k, []);
  v.forEach((x) => back_map.set(x, []));
}

for (const [k, v] of the_map.entries()) {
  v.forEach((x) => back_map.get(x)?.push(k));
}

function fast_count(from: string, to: string): number {
  // First, we find the set of reachable nodes from the starting point
  const reachable = new Set<string>();
  const to_process = [from];
  while (to_process.length > 0) {
    const current = to_process.pop() || "";
    if (!reachable.has(current)) {
      reachable.add(current);
      to_process.push(...(the_map.get(current) || [])); // There's gotta be a better way to do this
    }
  }

  // While we still have nodes, we pick a node that has no predecessors
  // that are yet to be visited. At the first iteration, this is guaranteed
  // to be exactly the starting node, because this is a DAG. We visit that
  // node by adding up the ways to reach it's predecessors.

  const counts = new Map<string, number>();
  let remaining_nodes = [...reachable];
  loop: while (counts.size < reachable.size) {
    outer: for (let i = 0; i < remaining_nodes.length; i++) {
      const preds = back_map.get(remaining_nodes[i]) || [];
      for (const p of preds) {
        if (!reachable.has(p)) {
          continue;
        }
        if (!counts.has(p)) {
          continue outer;
        }
      }

      // If we ge there, all the preds are good

      // This is a little bit clever, there are never zero ways to get somwhere
      // so we take advantage of zero being falsy and replace it with one
      const new_count =
        preds.map((x) => counts.get(x) || 0).reduce((a, b) => a + b, 0) || 1;

      counts.set(remaining_nodes[i], new_count);
      remaining_nodes = remaining_nodes
        .slice(0, i)
        .concat(remaining_nodes.slice(i + 1));
      continue loop;
    }
  }

  // Once we have no more nodes, we take the count of the destination node
  return counts.get(to) || 0;
}

const fft_first =
  fast_count("svr", "fft") *
  fast_count("fft", "dac") *
  fast_count("dac", "out");
const dac_first =
  fast_count("svr", "dac") *
  fast_count("dac", "fft") *
  fast_count("fft", "out");
console.log(fft_first + dac_first);
