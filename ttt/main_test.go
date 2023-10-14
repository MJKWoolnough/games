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
			b = b.Set(i, p)
		}

		for i, p := range test {
			if q := b.Get(i); q != p {
				t.Errorf("test %d.%d: expecting value %s, got %s", n, i, p, q)
			}
		}
	}
}

func TestBoardHasWin(t *testing.T) {
	for n, test := range [...]struct {
		Board
		Last int
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
		if test.hasWin() {
			t.Errorf("test %d: board already wins:\n%s", n, test.Board)
		} else if b := test.Set(test.Last, test.Next()); b.hasWin() {
			t.Errorf("test %d: board wins with wrong token:\n%s", n, b)
		} else if b := test.Set(test.Last, test.XO); !b.hasWin() {
			t.Errorf("test %d: board doesn't win when it should:\n%s", n, b)
		}
	}
}
