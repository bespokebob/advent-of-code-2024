#!/usr/bin/env -S deno run --allow-read

// https://adventofcode.com/2024/day/9

// read input
const test = Deno.args[0] === "test"
const input = await Deno.readTextFile(`day9_input.${test ? "test." : ""}txt`)

const diskMap = input.split("").map(Number)

let disk: number[] = []

// fill the disk with file IDs (and empty space)
diskMap.forEach((value, idx) => {
  if (idx % 2 === 0) {
    disk.push(...(new Array(value) as number[]).fill(idx / 2))
  } else {
    disk.length += value
  }
})

// console.log(disk)

// compact the disk
for (;;) {
  // find the last non-empty block
  const block = disk.findLastIndex((value) => !!value)
  // find the first empty block
  const space = disk.findIndex((value) => typeof value === "undefined")
  // if there are no spaces before this block, we're done
  if (space > block) break
  // move the block
  disk[space] = disk[block]
  delete disk[block]
}

// console.log(disk)

let checksum = disk.reduce((prev, cur, idx) => prev += cur * idx, 0)

console.log("What is the resulting filesystem checksum?", checksum)

// --- Part Two ---

// reset the disk
disk = []
diskMap.forEach((value, idx) => {
  if (idx % 2 === 0) {
    disk.push(...(new Array(value) as number[]).fill(idx / 2))
  } else {
    disk.length += value
  }
})

// compact the disk by moving whole files

// find the first contiguous space that can fit size blocks
const findSpace = (disk: number[], size: number) => {
  // indexOf doesn't work with undefined, and findIndex doesn't take a start index
  for (let i = 0; i < disk.length; i++) {
    if (typeof disk[i] === "undefined") {
      if (
        disk.slice(i, i + size).every((value) => typeof value === "undefined")
      ) {
        return i
      }
    }
  }
  return -1
}

// delete (set undefined) a block of spaces
const deleteMany = (disk: number[], start: number, end: number) => {
  for (let i = start; i <= end; i++) {
    delete disk[i]
  }
}

// find the highest file ID number and count backwards
const maxFileId = disk.findLast((value) => !!value) ?? 0
for (let id = maxFileId; id > 0; id--) {
  // find the beginning and end of the file
  const blockStart = disk.findIndex((value) => value === id, 0)
  const blockEnd = disk.findLastIndex((value) => value === id)
  const blockLen = blockEnd - blockStart + 1

  const space = findSpace(disk, blockLen)
  if (space > -1 && space < blockStart) {
    disk.fill(id, space, space + blockLen)
    deleteMany(disk, blockStart, blockEnd)
  }
}

// console.log(disk)

checksum = disk.reduce((prev, cur, idx) => prev += cur * idx, 0)

console.log("What is the resulting filesystem checksum? (part 2)", checksum)
