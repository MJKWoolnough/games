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
