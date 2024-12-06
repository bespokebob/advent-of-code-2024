#!/usr/bin/env -S deno run --allow-read

// https://adventofcode.com/2024/day/6

// read input
//const input = await Deno.readTextFile("day6_input.test.txt")
const input = await Deno.readTextFile("day6_input.txt")

// we only care about the locations of the obstructions and the guard

// convert the map into paris of characters with their coordinates
const lines = input.split(/\r\n|\n/)
const mapLocations = lines.flatMap((line, y) =>
  line.split("").map((char, x) => [char, x, y] as const)
)

// get the coordinates of all obstructions ("#")
const obstructions = mapLocations.filter((loc) => loc[0] === "#").map((
  [_char, x, y],
) => [x, y] as const)

// find the guard (not obstruction or empty - should be an "arrow")
const guardLoc = mapLocations.find((loc) => loc[0] !== "#" && loc[0] !== ".")

// some maps for the guard's direction
enum Directions {
  up,
  down,
  left,
  right,
  "^" = up,
  "v" = down,
  "<" = left,
  ">" = right,
}

const move = (direction: Directions, x: number, y: number) => {
  switch (direction) {
    case Directions.up:
      return [x, y - 1] as const
    case Directions.down:
      return [x, y + 1] as const
    case Directions.left:
      return [x - 1, y] as const
    case Directions.right:
      return [x + 1, y] as const
  }
}

const turn = (direction: Directions) => {
  switch (direction) {
    case Directions.up:
      return Directions.right
    case Directions.down:
      return Directions.left
    case Directions.left:
      return Directions.up
    case Directions.right:
      return Directions.down
  }
}

// build an array to store visited locations
const visited: boolean[][] = Array.from(lines).map((line) =>
  new Array(line.length).fill(false)
)

let direction = Directions[guardLoc![0] as "^" | "v" | "<" | ">"]
let x = guardLoc![1]
let y = guardLoc![2]
// use a loop instead of tail-call recursion since apparently that isn't well
// optimized in V8?
while (!(y < 0 || y === visited.length || x < 0 || x === visited[y].length)) {
  // mark our current location as visited
  visited[y][x] = true
  // calculate the next move
  const next = move(direction, x, y)
  if (obstructions.find((loc) => loc[0] === next[0] && loc[1] === next[1])) {
    // if we hit an obstruction, turn direction instead
    direction = turn(direction)
  } else {
    // otherwise, move locations
    ;[x, y] = next
  }
}

const visitedLocations = visited.flat().filter((i) => i).length

// prints the same "X for visited" version of the input/map as the examples
// lines.forEach((line, y) =>
//   console.log(
//     line.split("").map((char, x) => visited[y][x] ? "X" : char).join(""),
//   )
// )

console.log(
  "How many distinct positions will the guard visit before leaving the mapped area?",
  visitedLocations,
)

// --- Part Two ---

// TODO
