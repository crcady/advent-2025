"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var process_1 = require("process");
process_1.stdin.on("data", function (data) {
    console.log("Hello, ".concat(data.toString().trim(), "!"));
});
