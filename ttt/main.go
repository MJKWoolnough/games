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

type Cell uint8

var game map[Board][]Cell

func main() {
	move(0, X)

	fmt.Println(game)
}

func move(board Board, turn XO) {
	next := turn.Next()

	for n := 0; n < 9; n++ {
		p := board.Get(n)

		if p != None {
			continue
		}

		if board.Set(n, next).hasWin() {
			continue
		}

		setBoard := board.Set(n, turn)

		if setBoard.hasWin() {
			continue
		}

		move(setBoard, next)
	}
}
