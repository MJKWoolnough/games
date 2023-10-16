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

type Position uint8

func (p Position) RotateClockwise() Position {
	return 2 - p/3 + 3*(p%3)
}

func (p Position) Flop() Position {
	return 3*(p/3) + 2 - (p % 3)
}

type Board uint32

var wins = [...][3]Position{
	{0, 1, 2},
	{3, 4, 5},
	{6, 7, 8},
	{0, 3, 6},
	{1, 4, 7},
	{2, 5, 8},
	{0, 4, 8},
	{2, 4, 6},
}

func (b Board) Get(pos Position) XO {
	return XO(b>>(pos<<1)) & 3
}

func (b Board) Set(pos Position, xo XO) Board {
	return (b & ^(3 << (pos << 1))) | (Board(xo) << (pos << 1))
}

func (b Board) Transform(flop bool, rotate uint8) Board {
	var c Board

	for i := 0; i < 9; i++ {
		p := Position(i)
		v := b.Get(p)

		if flop {
			p = p.Flop()
		}

		for r := uint8(0); r < rotate; r++ {
			p = p.RotateClockwise()
		}

		c = c.Set(p, v)
	}

	return c
}

func (b Board) HasWin() bool {
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
	for y := Position(0); y < 3; y++ {
		if y > 0 {
			sb.WriteString("├───┼───┼───┤\n")
		}

		for x := Position(0); x < 3; x++ {
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

type Results uint32

type Brain map[Board]Results

func main() {
	b := NewBrain()

	fmt.Println(b)
}

func NewBrain() Brain {
	b := make(Brain)

	b.move(0, X)

	return b
}

func (b Brain) move(board Board, turn XO) {
	if !b.initBoard(board) {
		return
	}

	next := turn.Next()

	for n := Position(0); n < 9; n++ {
		setBoard := board.Set(n, turn)

		if board.Get(n) != None || board.Set(n, next).HasWin() || setBoard.HasWin() {
			continue
		}

		b.move(setBoard, next)
	}
}

func (b Brain) initBoard(board Board) bool {
	for i := uint8(0); i < 8; i++ {
		if _, ok := b[board.Transform(i&4 != 0, i&3)]; ok {
			return false
		}
	}

	b[board] = 0

	return true
}
