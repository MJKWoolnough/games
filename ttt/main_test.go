package main

import "testing"

func TestXONext(t *testing.T) {
	if p := X.Next(); p != O {
		t.Errorf("test 1: from X expecting O, got %s", p)
	}

	if p := O.Next(); p != X {
		t.Errorf("test 2: from O expecting X, got %s", p)
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

func TestBoardHasWin(t *testing.T) {
	for n, test := range [...]struct {
		Board
		Last Position
		XO
	}{
		{
			Board(0).Set(0, X).Set(1, X),
			2,
			X,
		},
		{
			Board(0).Set(0, O).Set(2, O),
			1,
			O,
		},
		{
			Board(0).Set(3, X).Set(5, X),
			4,
			X,
		},
		{
			Board(0).Set(4, O).Set(5, O),
			3,
			O,
		},
		{
			Board(0).Set(6, X).Set(8, X),
			7,
			X,
		},
		{
			Board(0).Set(6, O).Set(7, O),
			8,
			O,
		},
		{
			Board(0).Set(0, X).Set(3, X),
			6,
			X,
		},
		{
			Board(0).Set(4, O).Set(7, O),
			1,
			O,
		},
		{
			Board(0).Set(2, X).Set(8, X),
			5,
			X,
		},
		{
			Board(0).Set(0, O).Set(8, O),
			4,
			O,
		},
		{
			Board(0).Set(2, X).Set(6, X),
			4,
			X,
		},
		{
			Board(0).Set(4, O).Set(5, X).Set(2, O).Set(6, X).Set(0, O).Set(1, X),
			8,
			O,
		},
	} {
		if test.HasWin() {
			t.Errorf("test %d: board already wins:\n%s", n, test.Board)
		} else if b := test.Set(test.Last, test.Next()); b.HasWin() {
			t.Errorf("test %d: board wins with wrong token:\n%s", n, b)
		} else if b := test.Set(test.Last, test.XO); !b.HasWin() {
			t.Errorf("test %d: board doesn't win when it should:\n%s", n, b)
		}
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

func TestBoardTransform(t *testing.T) {
	for n, test := range [...][9]Board{
		{
			Board(0).Set(0, X).Set(2, O).Set(4, X),
			Board(0).Set(2, X).Set(8, O).Set(4, X),
			Board(0).Set(8, X).Set(6, O).Set(4, X),
			Board(0).Set(6, X).Set(0, O).Set(4, X),
			Board(0).Set(2, X).Set(0, O).Set(4, X),
			Board(0).Set(8, X).Set(2, O).Set(4, X),
			Board(0).Set(6, X).Set(8, O).Set(4, X),
			Board(0).Set(0, X).Set(6, O).Set(4, X),
		},
		{
			Board(0).Set(1, X).Set(5, O).Set(4, O),
			Board(0).Set(5, X).Set(7, O).Set(4, O),
			Board(0).Set(7, X).Set(3, O).Set(4, O),
			Board(0).Set(3, X).Set(1, O).Set(4, O),
			Board(0).Set(1, X).Set(3, O).Set(4, O),
			Board(0).Set(5, X).Set(1, O).Set(4, O),
			Board(0).Set(7, X).Set(5, O).Set(4, O),
			Board(0).Set(3, X).Set(7, O).Set(4, O),
		},
	} {
		for i := uint8(0); i < 8; i++ {
			if c := test[0].Transform(i&4 != 0, i&3); c != test[i] {
				t.Errorf("test %d.%d: expecting output:\n%s\n...got:\n%s", n+1, i+1, test[i], c)
			}
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
		{CanWin, CanLose},
		{CanLose, CanWin},
		{Draw, Draw},
	} {
		if out := test.In.Switch(); out != test.Out {
			t.Errorf("test %d: for input %q, expecting output %q, got %q", n+1, test.In, test.Out, out)
		}
	}
}
