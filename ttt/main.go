package main

import "fmt"

type XO uint8

const (
	None XO = iota
	X
	O
)

func (xo XO) Next() XO {
	return 3 - xo
}

type Board [9]XO

type Cell uint8

var game map[Board][]Cell

func main() {
	move(new(Board), X)

	fmt.Println(game)
}

func move(board *Board, turn XO) {
	next := turn.Next()

	for n, p := range *board {
		if p != None {
			continue
		}

		(*board)[n] = next
		if hasWin(board) {
			(*board)[n] = None

			continue
		}

		(*board)[n] = turn
		if hasWin(board) {
			(*board)[n] = None

			continue
		}

		move(board, next)
	}
}

var wins = [...][3]int{
	{0, 1, 2},
	{3, 4, 5},
	{6, 7, 8},
	{0, 3, 6},
	{1, 4, 7},
	{2, 5, 8},
	{0, 4, 8},
	{2, 4, 6},
}

func hasWin(board *Board) bool {
	for _, w := range wins {
		p := (*board)[w[0]]

		if p != None && p == (*board)[w[1]] && p == (*board)[w[2]] {
			return true
		}
	}

	return false
}
