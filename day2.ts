#!/usr/bin/env -S deno run --allow-read

// https://adventofcode.com/2024/day/2

// read input
const input = await Deno.readTextFile("day2_input.test.txt")
//const input = await Deno.readTextFile("day2_input.txt")

const reports = input.split(/\r\n|\n/).map((line) =>
  line.split(/\s+/).map(Number)
)

const isSafe = (levels: number[]) => {
  if (levels[0] > levels[1]) {
    // all decreasing?
    for (let i = 0; i < levels.length - 1; i++) {
      const diff = levels[i] - levels[i + 1]
      if (diff < 1 || diff > 3) return false
    }
    return true
  } else {
    // all increasing?
    for (let i = 0; i < levels.length - 1; i++) {
      const diff = levels[i + 1] - levels[i]
      if (diff < 1 || diff > 3) return false
    }
    return true
  }
}

const areSafe = reports.filter(isSafe).length

console.log("How many reports are safe?", areSafe)

// --- Part Two ---

// install "problem dampener"
const isSafeDampened = (levels: number[]) => {
  // already safe reports are still safe
  if (isSafe(levels)) return true
  // check if any single level can be removed to be safe
  for (let i = 0; i < levels.length; i++) {
    const newLevels = [...levels]
    newLevels.splice(i, 1)
    if (isSafe(newLevels)) return true
  }
  return false
}

const nowSafe = reports.filter(isSafeDampened).length

console.log("How many reports are now safe?", nowSafe)
