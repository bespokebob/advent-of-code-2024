#!/usr/bin/env -S deno run --allow-read

// https://adventofcode.com/2024/day/12

// read input
const test = Deno.args[0] === "test"
const input = await Deno.readTextFile(`day12_input.${test ? "test." : ""}txt`)

const map = input.split(/\r\n|\n/)

const checked: boolean[][] = Array.from(map).map((line) =>
  new Array(line.length).fill(false)
)

const getRegion = (x: number, y: number) => {
  const current = map[y][x]
  checked[y][x] = true

  let perimeter = 0
  let area = 1
  if (y > 0 && map[y - 1][x] === current) {
    if (!checked[y - 1][x]) {
      const step = getRegion(x, y - 1)
      perimeter += step.perimeter
      area += step.area
    }
  } else {
    perimeter += 1
  }
  if (y < map.length - 1 && map[y + 1][x] === current) {
    if (!checked[y + 1][x]) {
      const step = getRegion(x, y + 1)
      perimeter += step.perimeter
      area += step.area
    }
  } else {
    perimeter += 1
  }
  if (x > 0 && map[y][x - 1] === current) {
    if (!checked[y][x - 1]) {
      const step = getRegion(x - 1, y)
      perimeter += step.perimeter
      area += step.area
    }
  } else {
    perimeter += 1
  }
  if (x < map[y].length - 1 && map[y][x + 1] === current) {
    if (!checked[y][x + 1]) {
      const step = getRegion(x + 1, y)
      perimeter += step.perimeter
      area += step.area
    }
  } else {
    perimeter += 1
  }
  return { current, perimeter, area }
}

let price = 0

for (let y = 0; y < map.length; y++) {
  for (let x = 0; x < map[y].length; x++) {
    if (!checked[y][x]) {
      const region = getRegion(x, y)
      // console.log("region", region.current, "=", region.area, "*", region.perimeter)
      price += region.area * region.perimeter
    }
  }
}

console.log(
  "What is the total price of fencing all regions on your map?",
  price,
)

// --- Part Two ---
