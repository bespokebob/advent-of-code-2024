#!/usr/bin/env -S deno run --allow-read

// https://adventofcode.com/2024/day/8

// read input
const test = Deno.args[0] === "test"
const input = await Deno.readTextFile(`day8_input.${test ? "test." : ""}txt`)

const map = input.split(/\r\n|\n/).map((line) => line.split(""))
const nodes = map.flatMap((line, y) =>
  line.map((char, x) => [char, x, y] as const).filter((node) => node[0] !== ".")
)
const antinodes: boolean[][] = Array.from(map).map((line) =>
  new Array(line.length).fill(false)
)

nodes.forEach((node) =>
  nodes.filter((other) => other[0] == node[0] && other !== node).forEach(
    (other) => {
      const x = other[1] + (other[1] - node[1])
      const y = other[2] + (other[2] - node[2])
      if (y >= 0 && y < antinodes.length && x >= 0 && x < antinodes[y].length) {
        antinodes[y][x] = true
      }
    },
  )
)

// prints the same "# for antinode" version of the input/map as the examples
// map.forEach((line, y) =>
//   console.log(
//     line.map((char, x) => antinodes[y][x] ? "#" : char).join(""),
//   )
// )

const nodeCount = antinodes.flat().filter((i) => i).length
console.log(
  "How many unique locations within the bounds of the map contain an antinode?",
  nodeCount,
)

// --- Part Two ---

// conveniently, we can just update our list of antinodes without re-declaring everything
nodes.forEach((node) =>
  nodes.filter((other) => other[0] == node[0] && other !== node).forEach(
    (other) => {
      const i = other[1] - node[1]
      const j = other[2] - node[2]
      // start at the current node, since every node is now an antinode
      let x = other[1]
      let y = other[2]
      // keep marking antinodes every offset as long as we're on the grid
      while (
        y >= 0 && y < antinodes.length && x >= 0 && x < antinodes[y].length
      ) {
        antinodes[y][x] = true
        x += i
        y += j
      }
    },
  )
)

// prints the same "# for antinode" version of the input/map as the examples
// map.forEach((line, y) =>
//   console.log(
//     line.map((char, x) => antinodes[y][x] ? "#" : char).join(""),
//   )
// )

const newCount = antinodes.flat().filter((i) => i).length
console.log(
  "How many unique locations within the bounds of the map contain an antinode? (part 2)",
  newCount,
)
