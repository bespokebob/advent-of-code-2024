#!/usr/bin/env -S deno run --allow-read

// https://adventofcode.com/2024/day/5

// read input
const test = Deno.args[0] === "test"
const input = await Deno.readTextFile(`day5_input.${test ? "test." : ""}txt`)

// split input into rule and update sections by the blank line separating them
const [ruleInput, updateInput] = input.split(/^$/m)

// split rules by line and pipe into arrays of numbers [before, after]
const rules = ruleInput.split(/\r\n|\n/).filter((i) => i).map((line) =>
  line.split("|").map(Number) as [number, number]
)

// same thing, except the updates are comma-separated
const updates = updateInput.split(/\r\n|\n/).filter((i) => i).map((line) =>
  line.split(",").map(Number)
)

const ruleMatch = (
  rule: [number, number],
  update: number[],
  pageIdx: number,
) => {
  // "before" rule
  if (rule[0] === update[pageIdx]) {
    const found = update.indexOf(rule[1])
    // fail the rule if we find the "after" page at a lower index
    if (found !== -1 && found < pageIdx) return false
  } // "after" rule
  else if (rule[1] === update[pageIdx]) {
    const found = update.indexOf(rule[0], pageIdx)
    // fail the rule if we find the "before" page at a higher index
    if (found !== -1 && found > pageIdx) return false
  }
  // irrelevant or passing rule
  return true
}

let pageTotal = 0
for (const update of updates) {
  // check if each page in each update matches each rule
  if (
    update.every((_page, idx) =>
      rules.every((rule) => ruleMatch(rule, update, idx))
    )
  ) {
    // and sum the middle numbers
    pageTotal += update[Math.floor(update.length / 2)]
  }
}

console.log(
  "What do you get if you add up the middle page number from those correctly-ordered updates?",
  pageTotal,
)

// --- Part Two ---

const ruleFix = (
  rule: [number, number],
  update: number[],
  pageIdx: number,
) => {
  // "before" rule
  if (rule[0] === update[pageIdx]) {
    const found = update.indexOf(rule[1])
    if (found !== -1 && found < pageIdx) {
      // remove the page and re-insert it after the current page
      update.splice(pageIdx + 1, 0, ...update.splice(found, 1))
    }
  } // "after" rule
  else if (rule[1] === update[pageIdx]) {
    const found = update.indexOf(rule[0], pageIdx)
    if (found !== -1 && found > pageIdx) {
      // remove the page and re-insert it before the current page
      update.splice(pageIdx, 0, ...update.splice(found, 1))
    }
  }
  // irrelevant or passing rule
}

pageTotal = 0
for (const update of updates) {
  if (
    !update.every((_page, idx) =>
      rules.every((rule) => ruleMatch(rule, update, idx))
    )
  ) {
    // if any rule fails, run through each "fix"
    do {
      update.forEach((_page, idx) =>
        rules.forEach((rule) => ruleFix(rule, update, idx))
      )
    } while (
      // and sometimes they still fail, so just keep fixing until this passes
      !update.every((_page, idx) =>
        rules.every((rule) => ruleMatch(rule, update, idx))
      )
    )
    // and sum the middle numbers
    pageTotal += update[Math.floor(update.length / 2)]
  }
}

console.log(
  "What do you get if you add up the middle page numbers after correctly ordering just those updates?",
  pageTotal,
)
