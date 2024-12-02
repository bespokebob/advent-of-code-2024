#!/usr/bin/env -S deno run --allow-read

// https://adventofcode.com/2024/day/1

// read input
const input = await Deno.readTextFile("day1_input.test.txt")
//const input = await Deno.readTextFile("day1_input.txt")

// split into "left" and "right" lists, and parse as numbers
const lists = input.split("\n").map((line) => line.split(/\s+/))
const left = lists.map((line) => parseInt(line[0], 10))
const right = lists.map((line) => parseInt(line[1], 10))

// sort ascending
left.sort((a, b) => a - b)
right.sort((a, b) => a - b)

// calculate distances between each number
const distances = left.map((value, index) => Math.abs(value - right[index]))

// and sum them
const distance = distances.reduce((prev, cur) => prev + cur, 0)

// result
console.log("What is the total distance between your lists?", distance)

// --- Part Two ---

// multiply each left value by the number of times it appears in the right list
const scores = left.map(
  (lvalue) => lvalue * right.filter((rvalue) => lvalue == rvalue).length
)

// and sum them again
const score = scores.reduce((prev, cur) => prev + cur, 0)

console.log("What is their similarity score?", score)
