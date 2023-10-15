package main

import (
	"fmt"
	"strings"
)

type XO uint8

const (
	None XO = iota
	X
	O
)

func (xo XO) Next() XO {
	return 3 - xo
}

func (xo XO) String() string {
	switch xo {
	case None:
		return "None"
	case X:
		return "X"
	case O:
		return "O"
	}

	return "Invalid"
}

type Board uint32

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

func (b Board) Get(pos int) XO {
	return XO(b>>(pos<<1)) & 3
}

func (b Board) Set(pos int, xo XO) Board {
	return (b & ^(3 << (pos << 1))) | (Board(xo) << (pos << 1))
}

func (b Board) hasWin() bool {
	for _, w := range wins {
		if p := b.Get(w[0]); p != None && p == b.Get(w[1]) && p == b.Get(w[2]) {
			return true
		}
	}

	return false
}

func (b Board) String() string {
	var sb strings.Builder

	sb.WriteString("┌───┬───┬───┐\n")
	for y := 0; y < 3; y++ {
		if y > 0 {
			sb.WriteString("├───┼───┼───┤\n")
		}

		for x := 0; x < 3; x++ {
			sb.WriteString("│ ")
			if p := b.Get(y*3 + x); p == None {
				sb.WriteString(" ")
			} else {
				sb.WriteString(p.String())
			}
			sb.WriteString(" ")
		}

		sb.WriteString("│\n")
	}
	sb.WriteString("└───┴───┴───┘")

	return sb.String()
}

type Cell uint8

var game map[Board][]Cell

func main() {
	move(0, X)

	fmt.Println(game)
}

func move(board Board, turn XO) {
	next := turn.Next()

	for n := 0; n < 9; n++ {
		setBoard := board.Set(n, turn)

		if board.Get(n) != None || board.Set(n, next).hasWin() || setBoard.hasWin() {
			continue
		}

		move(setBoard, next)
	}
}
