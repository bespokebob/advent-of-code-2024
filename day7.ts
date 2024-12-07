#!/usr/bin/env -S deno run --allow-read

// https://adventofcode.com/2024/day/7

// read input
const test = Deno.args[0] === "test"
const input = await Deno.readTextFile(`day7_input.${test ? "test." : ""}txt`)

// split each equation into [test value, [array of values]]
const equations = input.split(/\r\n|\n/).map((line) => line.split(": ")).map(
  (line) => [Number(line[0]), line[1].split(" ").map(Number)] as const,
)

// operators to try
const add = (x: number, y: number) => x + y
const mul = (x: number, y: number) => x * y
const operators = [add, mul]

// returns each combination of operators applied to the list of numbers
const tryOperators = (numbers: number[]): number[] =>
  numbers.length < 2
    ? numbers
    : operators.map((op) => op(numbers[0], numbers[1])).flatMap((total) =>
      tryOperators([total, ...numbers.slice(2)])
    )

//console.log(equations.map(([total, numbers]) => [total, tryOperators(numbers)]))
const trueEquations = equations.map(([total, numbers]) =>
  tryOperators(numbers).find((value) => value === total)
).filter((i) => i) as number[]
const total = trueEquations.reduce((prev, cur) => prev + cur, 0)

console.log("What is their total calibration result?", total)

// --- Part Two ---

// add a new concatenation operator to the list, then copy/paste the rest
const cat = (x: number, y: number) => Number(x.toString() + y.toString())
const newOperators = [add, mul, cat]

// returns each combination of operators applied to the list of numbers
const tryNewOperators = (numbers: number[]): number[] =>
  numbers.length < 2
    ? numbers
    : newOperators.map((op) => op(numbers[0], numbers[1])).flatMap((total) =>
      tryNewOperators([total, ...numbers.slice(2)])
    )
const trueNewEquations = equations.map(([total, numbers]) =>
  tryNewOperators(numbers).find((value) => value === total)
).filter((i) => i) as number[]
const newTotal = trueNewEquations.reduce((prev, cur) => prev + cur, 0)

console.log("What is their total calibration result?", newTotal)
