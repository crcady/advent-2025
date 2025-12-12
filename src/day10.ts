import { readFileSync } from "fs";
import { argv } from "process";
import { join } from "path";
import { Context, init } from "z3-solver";

const data = readFileSync(
  join(__dirname, "..", "data", "day10", argv[2]),
  "utf8",
);
const rows = data.trim().split("\n");

interface Machine {
  desired_state: boolean[];
  button_schematics: number[][];
  joltage_requirements: number[];
}

function parse_row(row: string): Machine {
  const token_groups = row.split(" ");
  const indicator_token = token_groups[0];
  const joltage_token = token_groups[token_groups.length - 1];
  const button_tokens = token_groups.slice(1, -1);

  const desired_state = indicator_token
    .slice(1, -1)
    .split("")
    .map((x) => x === "#");

  const joltage_requirements = joltage_token
    .slice(1, -1)
    .split(",")
    .map((x) => Number(x));

  const button_schematics = button_tokens.map((t) =>
    t
      .slice(1, -1)
      .split(",")
      .map((x) => Number(x)),
  );

  return {
    desired_state,
    button_schematics,
    joltage_requirements,
  };
}

function compare_states(a: boolean[], b: boolean[]): boolean {
  return a.every((val, idx) => val === b[idx]);
}

function find_fewest_presses(m: Machine): number {
  let generations = 0;
  let states = [Array<boolean>(m.desired_state.length).fill(false)];
  while (true) {
    let next_generation: boolean[][] = [];
    for (const state of states) {
      if (compare_states(state, m.desired_state)) {
        return generations;
      }
      for (const button of m.button_schematics) {
        let new_state = Array.from(state);
        for (const idx of button) {
          new_state[idx] = !new_state[idx];
        }
        next_generation.push(new_state);
      }
    }
    generations++;
    states = next_generation;
  }
}

function find_fewest_presses2(m: Machine): number {
  let generations = 0;
  let states = new Set([0]);
  const buttons = m.button_schematics.map((nums) => {
    let n = 0;
    for (const num of nums) {
      n += 1 << num;
    }
    return n;
  });
  let desired_state = 0;
  for (let i = 0; i < m.desired_state.length; i++) {
    if (m.desired_state[i]) {
      desired_state += 1 << i;
    }
  }
  while (!states.has(desired_state)) {
    generations++;
    let next_generation = new Set<number>();
    for (const state of states) {
      for (const b of buttons) {
        next_generation.add(state ^ b);
      }
    }
    states = next_generation;
  }
  return generations;
}

async function find_joltage_presses(m: Machine) {
  const { Context } = await init();
  const { Solver, Int } = new (Context as any)("main") as Context; // This feels hacky
  // We will create a new integer, bXX, for each button
  // That integer represents the number of times that button was pressed
  // Then we will add up the buttons that increment a particular joltage counter
  // and set that equation as a constraint in z3. Then we just solve the system
  // of equations and minimize the sum of the button presses to get our answer
  const button_Ints = m.button_schematics.map((_, i) => Int.const(`b${i}`));
  const solver = new Solver();
  for (let i = 0; i < m.joltage_requirements.length; i++) {
    const desired_joltage = m.joltage_requirements[i];
    let button_indexes = Array<number>();
    for (let j = 0; j < m.button_schematics.length; j++) {
      const button = m.button_schematics[j];
      if (button.includes(i)) {
        // Button J increments joltage I. Yes these are bad names.
        button_indexes.push(j);
      }
    }
    const lhs = button_indexes
      .map((i) => button_Ints[i])
      .reduce((a, b) => a.add(b));
    solver.add(lhs.eq(desired_joltage));
  }
  for (const i of button_Ints) {
    solver.add(i.ge(0));
  }
  let sat = await solver.check();
  let result = 0;

  const sum_of_presses = button_Ints.reduce((a, b) => a.add(b));
  while (sat === "sat") {
    const model = solver.model();
    const results = button_Ints.map((i) =>
      // @ts-expect-error TS2339
      Number(model.get(i).value() as BigInt),
    );
    result = results.reduce((a, b) => a + b);
    //console.log(results, result);
    solver.add(sum_of_presses.lt(result));
    sat = await solver.check();
  }
  //console.log(result);
  return Promise.resolve(result);
}

const machines = rows.map(parse_row);

console.log(machines.map(find_fewest_presses2).reduce((a, b) => a + b));
//console.log(machines.map(find_joltage_presses).reduce((a, b) => a + b));
setImmediate(() =>
  Promise.all(machines.map(find_joltage_presses)).then((x) =>
    console.log(x.reduce((a, b) => a + b)),
  ),
);
