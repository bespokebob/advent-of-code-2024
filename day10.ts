#!/usr/bin/env -S deno run --allow-read

// https://adventofcode.com/2024/day/10

// read input
const test = Deno.args[0] === "test"
const input = await Deno.readTextFile(`day10_input.${test ? "test." : ""}txt`)

const map = input.split(/\r\n|\n/).map((line) => line.split("").map(Number))

// recursive, but we only ever go 9 deep
const step = (x: number, y: number): number[][] => {
  const height = map[y][x]
  if (height === 9) {
    // we made it to the top
    return [[x, y]]
  }
  const next = height + 1
  const result: number[][] = []
  // up
  if (y > 0 && map[y - 1][x] === next) {
    result.push(...step(x, y - 1))
  }
  // down
  if (y < map.length - 1 && map[y + 1][x] === next) {
    result.push(...step(x, y + 1))
  }
  // left
  if (x > 0 && map[y][x - 1] === next) {
    result.push(...step(x - 1, y))
  }
  // right
  if (x < map[y].length - 1 && map[y][x + 1] === next) {
    result.push(...step(x + 1, y))
  }
  return result
}

let score = 0
map.forEach((line, y) =>
  line.forEach((value, x) => {
    // starting at each trailhead (0), start walking
    if (value === 0) {
      // get all paths that end at 9
      const ends = step(x, y)
      // filter to unique ending points
      const unique = ends.filter((value, index, array) =>
        index === array.findIndex((other) =>
          other[0] === value[0] && other[1] === value[1]
        )
      )
      // total the score
      score += unique.length
    }
  })
)

console.log(
  "What is the sum of the scores of all trailheads on your topographic map?",
  score,
)

// --- Part Two ---

// this is even easier, since we just skip the filtering of unique paths

let ratings = 0
map.forEach((line, y) =>
  line.forEach((value, x) => {
    // starting at each trailhead (0), start walking
    if (value === 0) {
      // get all paths that end at 9
      const ends = step(x, y)
      // total the score
      ratings += ends.length
    }
  })
)

console.log("What is the sum of the ratings of all trailheads?", ratings)
