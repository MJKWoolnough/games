package main

import (
	"encoding/base64"
	"flag"
	"fmt"
	"slices"
	"strings"
)

type XO uint8

const (
	None XO = iota
	X
	O
)

func (xo XO) Switch() XO {
	if xo == None {
		return None
	}

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

var (
	Positions = [...]Position{0, 1, 2, 3, 4, 5, 6, 7, 8}
	wins      = [...][3]Position{
		{0, 1, 2},
		{3, 4, 5},
		{6, 7, 8},
		{0, 3, 6},
		{1, 4, 7},
		{2, 5, 8},
		{0, 4, 8},
		{2, 4, 6},
	}
)

type Board uint32

const emptyBoard Board = 0

func (b Board) Get(pos Position) XO {
	return XO(b>>(pos<<1)) & 3
}

func (b Board) Set(pos Position, xo XO) Board {
	return (b & ^(3 << (pos << 1))) | (Board(xo) << (pos << 1))
}

func (b Board) Switch() Board {
	c := emptyBoard

	for _, p := range Positions {
		c = c.Set(p, b.Get(p).Switch())
	}

	return c
}

func (b Board) Transform(flop bool, rotate uint8) Board {
	c := emptyBoard

	for _, p := range Positions {
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
	return b.hasXsInARow(3)
}

func (b Board) hasXsInARow(num int) bool {
Loop:
	for _, w := range wins {
		xs := 0

		for _, wn := range w {
			switch b.Get(wn) {
			case X:
				xs++
			case O:
				continue Loop
			}
		}

		if xs == num {
			return true
		}
	}

	return false
}

func (b Board) HasPossibleWin() bool {
	return b.hasXsInARow(2)
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

type Result uint8

const (
	WillLose Result = iota
	CanLose
	Draw
	CanWin
	WillWin
	FilledX
	FilledO
)

func (r Result) String() string {
	switch r {
	case WillLose:
		return "Will Lose"
	case CanLose:
		return "Can Lose"
	case Draw:
		return "Draw"
	case CanWin:
		return "Can Win"
	case WillWin:
		return "Will Win"
	case FilledX:
		return "Filled X"
	case FilledO:
		return "Filled O"
	}

	return "Invalid"
}

func (r Result) Switch() Result {
	if r <= WillWin {
		return WillWin - r
	}

	return r
}

type Results uint32

func (rs Results) Get(p Position) Result {
	return Result((rs >> (p * 3)) & 7)
}

func (rs Results) Set(p Position, r Result) Results {
	return (rs & ^(7 << (p * 3))) | (Results(r) << (p * 3))
}

func (rs Results) SetState(b Result) Results {
	return rs | (Results(b) << 27)
}

func (rs Results) GetState() Result {
	return Result(rs >> 27)
}

func (rs Results) String() string {
	var sb strings.Builder

	sb.WriteString("Overall: ")
	sb.WriteString(rs.GetState().String())
	sb.WriteString("\n┌───┬───┬───┐\n")
	for y := Position(0); y < 3; y++ {
		if y > 0 {
			sb.WriteString("├───┼───┼───┤\n")
		}

		for x := Position(0); x < 3; x++ {
			sb.WriteString("│ ")
			switch rs.Get(y*3 + x) {
			case WillLose:
				sb.WriteString("L")
			case CanLose:
				sb.WriteString("l")
			case Draw:
				sb.WriteString("D")
			case CanWin:
				sb.WriteString("w")
			case WillWin:
				sb.WriteString("W")
			case FilledX:
				sb.WriteString("X")
			case FilledO:
				sb.WriteString("O")
			}
			sb.WriteString(" ")
		}

		sb.WriteString("│\n")
	}
	sb.WriteString("└───┴───┴───┘")

	return sb.String()
}

func (r Results) Encode() [3]byte {
	var n uint32

	pow := uint32(1)

	for _, p := range Positions {
		v := r.Get(p)

		if v > CanLose {
			v--
		}

		n += uint32(v) * pow

		pow *= 6
	}

	return [3]byte{
		byte(n >> 16),
		byte(n >> 8),
		byte(n),
	}
}

type Brain map[Board]Results

func NewBrain() Brain {
	b := make(Brain)

	b.move(emptyBoard)

	return b
}

func (b Brain) move(board Board) Result {
	if r, ok := b.getResults(board); ok {
		return r.GetState()
	}

	var (
		rs       Results
		result   Result
		hasEmpty bool
	)

	for _, p := range Positions {
		if t := board.Get(p); t != None {
			rs = rs.Set(p, FilledX+Result(t-1))
			continue
		}

		hasEmpty = true

		setBoard := board.Set(p, X)

		var r Result

		if setBoard.HasWin() {
			r = WillWin
		} else {
			r = b.move(setBoard.Switch()).Switch()

			if (r == Draw || r == CanLose) && setBoard.HasPossibleWin() {
				r = CanWin
			}
		}

		if r > result {
			result = r
		}

		rs = rs.Set(p, r)
	}

	if !hasEmpty {
		result = Draw
	}

	b[board] = rs.SetState(result)

	return result
}

func (b Brain) getResults(board Board) (Results, bool) {
	for i := uint8(0); i < 8; i++ {
		if r, ok := b[board.Transform(i&4 != 0, i&3)]; ok {
			return r, true
		}
	}

	return 0, false
}

func main() {
	var debug, js bool

	flag.BoolVar(&debug, "d", false, "print all boards")
	flag.BoolVar(&js, "j", false, "print brain wrapped in JS")

	flag.Parse()

	b := NewBrain()

	boards := make([]Board, 0, len(b))

	for board := range b {
		boards = append(boards, board)
	}

	slices.Sort(boards)

	if debug {
		for _, board := range boards {
			results := b[board]
			b := strings.Split(board.String(), "\n")
			r := strings.Split(results.String(), "\n")

			fmt.Println("             ", r[0])

			for n, rs := range r[1:] {
				fmt.Println(b[n], rs)
			}

		}

		fmt.Printf("%d boards\n", len(b))
	} else {
		var sb strings.Builder

		w := base64.NewEncoder(base64.StdEncoding, &sb)

		for _, board := range boards {
			v := b[board].Encode()

			w.Write(v[:])
		}

		w.Close()

		if js {
			fmt.Printf("export default %q;", sb.String())
		} else {
			fmt.Println(sb.String())
		}
	}
}
