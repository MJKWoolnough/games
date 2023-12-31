package main

import (
	"testing"
)

func TestXOSwitch(t *testing.T) {
	if p := X.Switch(); p != O {
		t.Errorf("test 1: from X expecting O, got %s", p)
	}

	if p := O.Switch(); p != X {
		t.Errorf("test 2: from O expecting X, got %s", p)
	}
}

func TestPositionRotateClockwise(t *testing.T) {
	for n, test := range [...][2]Position{
		{0, 2},
		{1, 5},
		{2, 8},
		{3, 1},
		{4, 4},
		{5, 7},
		{6, 0},
		{7, 3},
		{8, 6},
	} {
		if q := test[0].RotateClockwise(); q != test[1] {
			t.Errorf("test %d: from position %d, expecting clockwise rotation to equal %d, got %d", n+1, test[0], test[1], q)
		}
	}
}

func TestPositionFlop(t *testing.T) {
	for n, test := range [...][2]Position{
		{0, 2},
		{1, 1},
		{2, 0},
		{3, 5},
		{4, 4},
		{5, 3},
		{6, 8},
		{7, 7},
		{8, 6},
	} {
		if q := test[0].Flop(); q != test[1] {
			t.Errorf("test %d: from position %d, expecting flop to equal %d, got %d", n+1, test[0], test[1], q)
		}
	}
}

func TestBoardGetSet(t *testing.T) {
	for n, test := range [...][9]XO{
		{None, X, O, None, X, O, None, X, O},
		{X, O, None, X, O, None, X, O, None},
		{O, None, X, O, None, X, O, None, X},
		{None, None, None, None, None, None, None, None, None},
		{X, X, X, X, X, X, X, X, X},
		{O, O, O, O, O, O, O, O, O},
	} {
		var b Board

		for i, p := range test {
			b = b.Set(Position(i), p)
		}

		for i, p := range test {
			if q := b.Get(Position(i)); q != p {
				t.Errorf("test %d.%d: expecting value %s, got %s", n, i, p, q)
			}
		}
	}
}

func TestBoardSwitch(t *testing.T) {
	for n, test := range [...][2]Board{
		{
			emptyBoard.Set(0, X).Set(4, X).Set(1, O),
			emptyBoard.Set(0, O).Set(4, O).Set(1, X),
		},
		{
			emptyBoard.Set(0, O).Set(4, O).Set(1, X),
			emptyBoard.Set(0, X).Set(4, X).Set(1, O),
		},
		{
			emptyBoard.Set(0, X).Set(1, O).Set(2, X).Set(3, O).Set(4, X).Set(5, O).Set(6, X).Set(7, O).Set(8, X),
			emptyBoard.Set(0, O).Set(1, X).Set(2, O).Set(3, X).Set(4, O).Set(5, X).Set(6, O).Set(7, X).Set(8, O),
		},
		{
			emptyBoard.Set(0, O).Set(1, X).Set(2, O).Set(3, X).Set(4, O).Set(5, X).Set(6, O).Set(7, X).Set(8, O),
			emptyBoard.Set(0, X).Set(1, O).Set(2, X).Set(3, O).Set(4, X).Set(5, O).Set(6, X).Set(7, O).Set(8, X),
		},
	} {
		if s := test[0].Switch(); s != test[1] {
			t.Errorf("test %d: from board:\n%s\nexpecting switched board:\n%s\n...but got:\n%s", n+1, test[0], test[1], s)
		}
	}
}

func TestBoardTransform(t *testing.T) {
	for n, test := range [...][9]Board{
		{
			emptyBoard.Set(0, X).Set(2, O).Set(4, X),
			emptyBoard.Set(2, X).Set(8, O).Set(4, X),
			emptyBoard.Set(8, X).Set(6, O).Set(4, X),
			emptyBoard.Set(6, X).Set(0, O).Set(4, X),
			emptyBoard.Set(2, X).Set(0, O).Set(4, X),
			emptyBoard.Set(8, X).Set(2, O).Set(4, X),
			emptyBoard.Set(6, X).Set(8, O).Set(4, X),
			emptyBoard.Set(0, X).Set(6, O).Set(4, X),
		},
		{
			emptyBoard.Set(1, X).Set(5, O).Set(4, O),
			emptyBoard.Set(5, X).Set(7, O).Set(4, O),
			emptyBoard.Set(7, X).Set(3, O).Set(4, O),
			emptyBoard.Set(3, X).Set(1, O).Set(4, O),
			emptyBoard.Set(1, X).Set(3, O).Set(4, O),
			emptyBoard.Set(5, X).Set(1, O).Set(4, O),
			emptyBoard.Set(7, X).Set(5, O).Set(4, O),
			emptyBoard.Set(3, X).Set(7, O).Set(4, O),
		},
	} {
		for i := uint8(0); i < 8; i++ {
			if c := test[0].Transform(i&4 != 0, i&3); c != test[i] {
				t.Errorf("test %d.%d: expecting output:\n%s\n...got:\n%s", n+1, i+1, test[i], c)
			}
		}
	}
}

func TestBoardHasWin(t *testing.T) {
	for n, test := range [...]struct {
		Board
		Wins bool
	}{
		{
			emptyBoard.Set(0, X).Set(1, X).Set(2, X),
			true,
		},
		{
			emptyBoard.Set(3, X).Set(4, X).Set(5, X),
			true,
		},
		{
			emptyBoard.Set(6, X).Set(7, X).Set(8, X),
			true,
		},
		{
			emptyBoard.Set(0, X).Set(3, X).Set(6, X),
			true,
		},
		{
			emptyBoard.Set(1, X).Set(4, X).Set(7, X),
			true,
		},
		{
			emptyBoard.Set(2, X).Set(5, X).Set(8, X),
			true,
		},
		{
			emptyBoard.Set(0, X).Set(4, X).Set(8, X),
			true,
		},
		{
			emptyBoard.Set(2, X).Set(4, X).Set(6, X),
			true,
		},
		{
			emptyBoard.Set(0, O).Set(1, O).Set(2, O),
			false,
		},
		{
			emptyBoard.Set(3, O).Set(4, O).Set(5, O),
			false,
		},
		{
			emptyBoard.Set(6, O).Set(7, O).Set(8, O),
			false,
		},
		{
			emptyBoard.Set(0, O).Set(3, O).Set(6, O),
			false,
		},
		{
			emptyBoard.Set(1, O).Set(4, O).Set(7, O),
			false,
		},
		{
			emptyBoard.Set(2, O).Set(5, O).Set(8, O),
			false,
		},
		{
			emptyBoard.Set(0, O).Set(4, O).Set(8, O),
			false,
		},
		{
			emptyBoard.Set(2, O).Set(4, O).Set(6, O),
			false,
		},
		{
			emptyBoard,
			false,
		},
		{
			emptyBoard.Set(0, X),
			false,
		},
		{
			emptyBoard.Set(1, X),
			false,
		},
		{
			emptyBoard.Set(2, X),
			false,
		},
		{
			emptyBoard.Set(3, X),
			false,
		},
		{
			emptyBoard.Set(4, X),
			false,
		},
		{
			emptyBoard.Set(5, X),
			false,
		},
		{
			emptyBoard.Set(6, X),
			false,
		},
		{
			emptyBoard.Set(7, X),
			false,
		},
		{
			emptyBoard.Set(8, X),
			false,
		},
		{
			emptyBoard.Set(0, X).Set(1, X),
			false,
		},
		{
			emptyBoard.Set(0, X).Set(2, X),
			false,
		},
		{
			emptyBoard.Set(1, X).Set(2, X),
			false,
		},
	} {
		if test.HasWin() != test.Wins {
			t.Errorf("test %d: board.HasWin() should return %v when it doesn't:\n%s", n, test.Wins, test.Board)
		}
	}
}

func TestBoardHasPossibleWin(t *testing.T) {
	for n, test := range [...]struct {
		Board
		Possible bool
	}{
		{
			emptyBoard.Set(0, X).Set(1, X),
			true,
		},
		{
			emptyBoard.Set(0, X).Set(2, X),
			true,
		},
		{
			emptyBoard.Set(1, X).Set(2, X),
			true,
		},
		{
			emptyBoard.Set(3, X).Set(4, X),
			true,
		},
		{
			emptyBoard.Set(3, X).Set(5, X),
			true,
		},
		{
			emptyBoard.Set(4, X).Set(5, X),
			true,
		},
		{
			emptyBoard.Set(6, X).Set(7, X),
			true,
		},
		{
			emptyBoard.Set(6, X).Set(8, X),
			true,
		},
		{
			emptyBoard.Set(7, X).Set(8, X),
			true,
		},
		{
			emptyBoard.Set(0, X).Set(3, X),
			true,
		},
		{
			emptyBoard.Set(0, X).Set(6, X),
			true,
		},
		{
			emptyBoard.Set(3, X).Set(6, X),
			true,
		},
		{
			emptyBoard.Set(1, X).Set(4, X),
			true,
		},
		{
			emptyBoard.Set(1, X).Set(7, X),
			true,
		},
		{
			emptyBoard.Set(4, X).Set(7, X),
			true,
		},
		{
			emptyBoard.Set(2, X).Set(5, X),
			true,
		},
		{
			emptyBoard.Set(2, X).Set(8, X),
			true,
		},
		{
			emptyBoard.Set(5, X).Set(8, X),
			true,
		},
		{
			emptyBoard.Set(0, X).Set(4, X),
			true,
		},
		{
			emptyBoard.Set(0, X).Set(8, X),
			true,
		},
		{
			emptyBoard.Set(4, X).Set(8, X),
			true,
		},
		{
			emptyBoard.Set(2, X).Set(4, X),
			true,
		},
		{
			emptyBoard.Set(2, X).Set(6, X),
			true,
		},
		{
			emptyBoard.Set(4, X).Set(6, X),
			true,
		},
		{
			emptyBoard.Set(0, O).Set(1, O),
			false,
		},
		{
			emptyBoard.Set(3, O).Set(5, O),
			false,
		},
		{
			emptyBoard.Set(7, O).Set(8, O),
			false,
		},
		{
			emptyBoard.Set(3, O).Set(6, O),
			false,
		},
		{
			emptyBoard.Set(1, O).Set(7, O),
			false,
		},
		{
			emptyBoard.Set(2, O).Set(5, O),
			false,
		},
		{
			emptyBoard.Set(0, X),
			false,
		},
		{
			emptyBoard.Set(0, X).Set(5, X),
			false,
		},
		{
			emptyBoard.Set(1, X).Set(0, 6),
			false,
		},
	} {
		if test.HasPossibleWin() != test.Possible {
			t.Errorf("test %d: board.HasPossibleWin should return %v when it doesn't:\n%s", n, test.Possible, test.Board)
		}
	}
}

func TestResultSwitch(t *testing.T) {
	for n, test := range [...]struct {
		In, Out Result
	}{
		{FilledX, FilledX},
		{FilledO, FilledO},
		{WillWin, WillLose},
		{WillLose, WillWin},
		{Draw, Draw},
		{CanWin, CanLose},
		{CanLose, CanWin},
	} {
		if out := test.In.Switch(); out != test.Out {
			t.Errorf("test %d: for input %q, expecting output %q, got %q", n+1, test.In, test.Out, out)
		}
	}
}

func TestResultsGetSet(t *testing.T) {
	var rs Results
	for _, p := range Positions {
		for r := WillLose; r <= FilledO; r++ {
			rs = rs.Set(p, r)

			if g := rs.Get(p); g != r {
				t.Errorf("test %d.%d: expecting to get %s, got %s", p+1, r+1, r, g)
			}
		}
	}
}

func TestResultsEncode(t *testing.T) {
	for n, test := range [...]Results{
		Results(0).Set(0, WillLose).Set(1, Draw).Set(2, CanWin).Set(3, WillWin).Set(4, FilledX).Set(5, FilledO).Set(6, WillLose).Set(7, Draw).Set(8, CanWin),
		Results(0).Set(0, Draw).Set(1, CanWin).Set(2, WillWin).Set(3, FilledX).Set(4, FilledO).Set(5, WillLose).Set(6, Draw).Set(7, CanWin).Set(8, WillWin),
		Results(0).Set(0, CanWin).Set(1, WillWin).Set(2, FilledX).Set(3, FilledO).Set(4, WillLose).Set(5, Draw).Set(6, CanWin).Set(7, WillWin).Set(8, FilledX),
		Results(0).Set(0, WillWin).Set(1, FilledX).Set(2, FilledO).Set(3, WillLose).Set(4, Draw).Set(5, CanWin).Set(6, WillWin).Set(7, FilledX).Set(8, FilledO),
		Results(0).Set(0, FilledX).Set(1, FilledO).Set(2, WillLose).Set(3, Draw).Set(4, CanWin).Set(5, WillWin).Set(6, FilledX).Set(7, FilledO).Set(8, WillLose),
		Results(0).Set(0, FilledO).Set(1, WillLose).Set(2, Draw).Set(3, CanWin).Set(4, WillWin).Set(5, FilledX).Set(6, FilledO).Set(7, WillLose).Set(8, Draw),
		Results(0).Set(0, FilledX).Set(1, FilledO).Set(2, FilledX).Set(3, WillLose).Set(4, FilledO).Set(5, WillLose).Set(6, WillLose).Set(7, CanLose).Set(8, WillLose).SetState(CanLose),
	} {
		re := test.Encode()

		e := Results(re[2]) | (Results(re[1]) << 8) | (Results(re[0]) << 16)

		for _, p := range Positions {
			r := Result(e % 6)
			e /= 6

			if r > 0 {
				r++
			}

			if g := test.Get(p); g != r && g != CanLose && r != Draw {
				t.Errorf("test %d.%d: expecting result %s, got %s", n+1, p+1, g, r)
			}
		}
	}
}

func TestBrainMove(t *testing.T) {
	for n, test := range [...]struct {
		Board
		Result
	}{
		{
			emptyBoard,
			CanWin,
		},
		{
			emptyBoard.Set(0, X).Set(1, X).Set(8, O).Set(3, O),
			WillWin,
		},
		{
			emptyBoard.Set(0, O).Set(2, O).Set(8, X).Set(3, X),
			CanLose,
		},
		{
			emptyBoard.Set(0, O).Set(1, O).Set(4, O).Set(3, X).Set(8, X),
			WillLose,
		},
	} {
		b := make(Brain)

		if r := b.move(test.Board); r != test.Result {
			t.Errorf("test %d: for board:\n%s, expected result %s, got %s", n+1, test.Board, test.Result, r)
		}
	}
}

func TestBrainGetResults(t *testing.T) {
	brain := NewBrain()

	for n, test := range [...]struct {
		Board
		Results
	}{
		{
			emptyBoard,
			Results(0).Set(0, CanWin).Set(1, CanWin).Set(2, CanWin).Set(3, CanWin).Set(4, CanWin).Set(5, CanWin).Set(6, CanWin).Set(7, CanWin).Set(8, CanWin).SetState(CanWin),
		},
		{
			emptyBoard.Set(1, X).Set(6, O).Set(7, O).Set(8, X),
			Results(0).Set(0, FilledX).Set(1, FilledO).Set(2, FilledO).Set(3, WillWin).Set(4, CanWin).Set(5, WillWin).Set(6, WillWin).Set(7, FilledX).Set(8, WillWin).SetState(WillWin),
		},
		{
			emptyBoard.Set(0, O).Set(1, X).Set(2, O).Set(4, X).Set(7, O),
			Results(0).Set(0, FilledO).Set(1, FilledX).Set(2, FilledO).Set(3, CanWin).Set(4, FilledX).Set(5, CanWin).Set(6, CanLose).Set(7, FilledO).Set(8, CanLose).SetState(CanWin),
		},
		{
			emptyBoard.Set(0, X).Set(1, O).Set(2, X).Set(4, O),
			Results(0).Set(0, FilledX).Set(1, FilledO).Set(2, FilledX).Set(3, WillLose).Set(4, FilledO).Set(5, WillLose).Set(6, WillLose).Set(7, CanLose).Set(8, WillLose).SetState(CanLose),
		},
	} {
		if r, ok := brain.getResults(test.Board); !ok {
			t.Errorf("test %d: for board:\n%s\n...got no result when expecting one", n+1, test.Board)
		} else if r != test.Results {
			t.Errorf("test %d: for board:\n%s\n...expecting Results:\n%s, got:\n%s", n+1, test.Board, test.Results, r)
		}
	}
}
