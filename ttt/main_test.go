package main

import "testing"

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
				t.Errorf("test %d.%d: expecting value %d, got %d", n, i, p, q)
			}
		}
	}
}
