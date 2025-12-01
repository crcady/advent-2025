"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var data = (0, fs_1.readFileSync)("input.txt", "utf8");
var rows = data.trim().split("\n");
var moves = rows.map(function (x) {
    var direction = x.charAt(0);
    var magnitude = Number(x.slice(1));
    return direction === "L" ? -magnitude : magnitude;
});
var positions = [50];
var i = 0;
for (var _i = 0, moves_1 = moves; _i < moves_1.length; _i++) {
    var move = moves_1[_i];
    positions.push((positions[i] + move) % 100);
    i++;
}
console.log(positions.filter(function (x) { return x == 0; }).length);
var many_positions = [50];
i = 0;
for (var _a = 0, moves_2 = moves; _a < moves_2.length; _a++) {
    var move = moves_2[_a];
    var delta = move > 0 ? 1 : -1;
    for (var count = Math.abs(move); count > 0; count--) {
        many_positions.push((many_positions[i] + delta) % 100);
        i++;
    }
}
console.log(many_positions.filter(function (x) { return x == 0; }).length);
