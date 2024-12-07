#!/usr/bin/env -S deno run --allow-read

// https://adventofcode.com/2024/day/4

// read input
const test = Deno.args[0] === "test"
const input = await Deno.readTextFile(`day4_input.${test ? "test." : ""}txt`)

// convert to a grid of characters
const search = input.split(/\r\n|\n/).map((line) => line.split(""))

// hey look, a recursive subroutine. fancy.
const walk = (sub: string, x: number, y: number, i: number, j: number) => {
  // if we made it to the end, congrats
  if (sub === "") return true
  // if the next letter matches, slice it off and move on to the next step
  if (sub[0] === search?.[y]?.[x]) return walk(sub.slice(1), x + i, y + j, i, j)
  // no match
  return false
}

let times = 0
for (let y = 0; y < search.length; y++) {
  for (let x = 0; x < search[y].length; x++) {
    if (search[y][x] === "X") {
      // horizontal (forwards)
      if (walk("MAS", x + 1, y, 1, 0)) times += 1
      // horizontal (backwards)
      if (walk("MAS", x - 1, y, -1, 0)) times += 1
      // vertical (down)
      if (walk("MAS", x, y + 1, 0, 1)) times += 1
      // vertical (up)
      if (walk("MAS", x, y - 1, 0, -1)) times += 1
      // diagonals
      if (walk("MAS", x + 1, y + 1, 1, 1)) times += 1
      if (walk("MAS", x + 1, y - 1, 1, -1)) times += 1
      if (walk("MAS", x - 1, y + 1, -1, 1)) times += 1
      if (walk("MAS", x - 1, y - 1, -1, -1)) times += 1
    }
  }
}

console.log("How many times does XMAS appear?", times)

// --- Part Two ---

let xtimes = 0
for (let y = 0; y < search.length; y++) {
  for (let x = 0; x < search[y].length; x++) {
    if (search[y][x] === "M") {
      // each diagonal direction has two "cross" directions,
      // but we only want to count one (so we don't double-count crosses)
      // so I'm arbitrarily picking the counter-clockwise cross
      if (walk("AS", x + 1, y + 1, 1, 1) && walk("MAS", x, y + 2, 1, -1)) {
        xtimes += 1
      }
      if (walk("AS", x + 1, y - 1, 1, -1) && walk("MAS", x + 2, y, -1, -1)) {
        xtimes += 1
      }
      if (walk("AS", x - 1, y + 1, -1, 1) && walk("MAS", x - 2, y, 1, 1)) {
        xtimes += 1
      }
      if (walk("AS", x - 1, y - 1, -1, -1) && walk("MAS", x, y - 2, -1, 1)) {
        xtimes += 1
      }
    }
  }
}

console.log("How many times does an X-MAS appear?", xtimes)
