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

// --- Part Two ---

// the obvious solution just blows up because the array gets absurdly large
// for (let i = 0; i < 50; i++) {
//   stones = blink(stones)
// }

// the list of potential stones is mostly duplicates,
// we can cache the results of blinking to significantly speed things up

// cached result of blinking 25 times
const cache25: Record<number, number> = {}
const blink25 = (stone: number) => {
  if (typeof cache25[stone] === "undefined") {
    let newStones = [stone]
    for (let i = 0; i < 25; i++) {
      newStones = blink(newStones)
    }
    cache25[stone] = newStones.length
  }
  return cache25[stone]
}

// cached result of blinking 50 times
const cache50: Record<number, number> = {}
const blink50 = (stone: number) => {
  if (typeof cache50[stone] === "undefined") {
    let newStones = [stone]
    // do 25 normal blinks
    for (let i = 0; i < 25; i++) {
      newStones = blink(newStones)
    }
    // for each stone after 25 blinks, get the cached total for another 25
    cache50[stone] = newStones.reduce((newTotal, newStone) => {
      // use our cached helper here for the final 25 blinks
      return newTotal + blink25(newStone)
    }, 0)
  }
  return cache50[stone]
}

// the rules make the stones' growth independent of each other
// so we can total up another 50 blinks starting with each previous stone
// for a total of 75 blinks
const total = stones.reduce((total, stone) => {
  return total + blink50(stone)
}, 0)

console.log(
  "How many stones would you have after blinking a total of 75 times?",
  total,
)
