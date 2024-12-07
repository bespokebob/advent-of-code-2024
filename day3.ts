#!/usr/bin/env -S deno run --allow-read

// https://adventofcode.com/2024/day/3

// read input
const test = Deno.args[0] === "test"
const input = await Deno.readTextFile(`day3_input.${test ? "test." : ""}txt`)

// find all valid instructions
const instructions = input.match(/mul\(\d{1,3},\d{1,3}\)/g)

// multiply each pair
const results = instructions!.map((mul) => mul.match(/mul\((\d+),(\d+)\)/)).map(
  (match) => parseInt(match![1], 10) * parseInt(match![2], 10),
)

// sum the results
const total = results.reduce((acc, cur) => acc + cur, 0)

console.log(
  "What do you get if you add up all of the results of the multiplications?",
  total,
)

// --- Part Two ---

// strip everything between "don't()" and "do()", then repeat previous steps
const enabledInstructions = input.replaceAll(/don't\(\).+?(do\(\)|$)/gs, "")
  .match(
    /mul\(\d{1,3},\d{1,3}\)/g,
  )

// multiply each pair
const enabledResults = enabledInstructions!.map((mul) =>
  mul.match(/mul\((\d+),(\d+)\)/)
).map(
  (match) => parseInt(match![1], 10) * parseInt(match![2], 10),
)

// sum the results
const enabledTotal = enabledResults.reduce((acc, cur) => acc + cur, 0)

console.log(
  "What do you get if you add up all of the results of just the enabled multiplications?",
  enabledTotal,
)
