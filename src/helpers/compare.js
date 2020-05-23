
function negate(a)    { return !a;    }
function cmp_eq(a, b) { return a == b; }
function cmp_ne(a, b) { return a != b; }
function cmp_ge(a, b) { return a >= b; }
function cmp_gt(a, b) { return a > b;  }
function cmp_le(a, b) { return a <= b; }
function cmp_lt(a, b) { return a < b;  }

function or(...logic) { 

	var result = false;
	for (i = 0; i < arguments.length; ++i)
		result = result || arguments[i];
	return result;
}

function and(...logic) { 

	var result = true;
	for (i = 0; i < arguments.length; ++i)
		result = result && arguments[i];
	return result;
}


/**
 * Provides a set of logic helpers
**/
export function logic_helpers() {
	return {
		"negate": negate,
		"cmp_eq": cmp_eq,
		"cmp_ne": cmp_ne,
		"cmp_gt": cmp_gt,
		"cmp_ge": cmp_ge,
		"cmp_lt": cmp_lt,
		"cmp_le": cmp_le,
		"and"   : and,
		"or"    : or
	}
}