import { stdin } from "process";

stdin.on("data", (data) => {
  console.log(`Hello, ${data.toString().trim()}!`);
});
