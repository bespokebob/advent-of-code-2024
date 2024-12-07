#!/usr/bin/env -S deno run --allow-read

// https://adventofcode.com/2024/day/6

// read input
const test = Deno.args[0] === "test"
const input = await Deno.readTextFile(`day6_input.${test ? "test." : ""}txt`)

// we only care about the locations of the obstructions and the guard

// convert the map into pairs of characters with their coordinates
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

function walkPath() {
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

  // prints the same "X for visited" version of the input/map as the examples
  // lines.forEach((line, y) =>
  //   console.log(
  //     line.split("").map((char, x) => visited[y][x] ? "X" : char).join(""),
  //   )
  // )

  return visited
}

const visited = walkPath()
const visitedLocations = visited.flat().filter((i) => i).length

console.log(
  "How many distinct positions will the guard visit before leaving the mapped area?",
  visitedLocations,
)

// --- Part Two ---

// similar to the previous path walking, except now we abort if a loop is detected
function detectLoop(obstruction: [number, number]) {
  // build an array to store visited locations as an array of previous directions
  const visited: Directions[][][] = Array.from(lines).map((line) =>
    [...Array(line.length)].map((_) => [])
  )

  let direction = Directions[guardLoc![0] as "^" | "v" | "<" | ">"]
  let x = guardLoc![1]
  let y = guardLoc![2]

  while (!(y < 0 || y === visited.length || x < 0 || x === visited[y].length)) {
    if (visited[y][x].find((v) => v === direction)) {
      // we already visited this location going in the same direction,
      // which implies that we are in a loop
      return true
    }
    // mark our current location as visited using the current direction
    visited[y][x].push(direction)
    // calculate the next move
    const next = move(direction, x, y)
    if (
      obstructions.concat([obstruction]).find((loc) =>
        loc[0] === next[0] && loc[1] === next[1]
      )
    ) {
      // if we hit an obstruction, turn direction instead
      direction = turn(direction)
    } else {
      // otherwise, move locations
      ;[x, y] = next
    }
  }

  // exiting the map, no loop
  return false
}

// why yes, this does take a while, thanks for asking
const loops: boolean[][] = Array.from(lines).map((line, y) =>
  [...Array(line.length)].map((_, x) => detectLoop([x, y]))
)
const loopLocations = loops.flat().filter((i) => i).length

console.log(
  "How many different positions could you choose for this obstruction?",
  loopLocations,
)
