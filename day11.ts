#!/usr/bin/env -S deno run --allow-read

// https://adventofcode.com/2024/day/11

// read input
const test = Deno.args[0] === "test"
const input = await Deno.readTextFile(`day11_input.${test ? "test." : ""}txt`)

let stones = input.split(" ").map(Number)

const blink = (stones: number[]) =>
  stones.flatMap((stone) => {
    if (stone === 0) {
      return 1
    }
    const digits = stone.toString()
    if (digits.length % 2 === 0) {
      return [
        Number(digits.slice(0, digits.length / 2)),
        Number(digits.slice(digits.length / 2, digits.length)),
      ]
    }
    return stone * 2024
  })

for (let i = 0; i < 25; i++) {
  stones = blink(stones)
}

console.log(
  "How many stones will you have after blinking 25 times?",
  stones.length,
)
