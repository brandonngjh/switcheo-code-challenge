// Assumption: n >= 0, if not throw error

// For loop implmentation
var sum_to_n_a = function (n) {
  if (n < 0) {
    throw new Error("Input must be a non-negative integer.");
  }
  result = 0;
  for (var i = 1; i <= n; i++) {
    result += i;
  }
  return result;
};

// Recursion implementation
var sum_to_n_b = function (n) {
  if (n < 0) {
    throw new Error("Input must be a non-negative integer.");
  }
  if (n <= 1) {
    return n;
  } else {
    return n + sum_to_n_b(n - 1);
  }
};

// Arithmetic Series Formula
var sum_to_n_c = function (n) {
  if (n < 0) {
    throw new Error("Input must be a non-negative integer.");
  }
  return (n * (n + 1)) / 2;
};

var input = 15;
console.log(sum_to_n_a(input));
console.log(sum_to_n_b(input));
console.log(sum_to_n_c(input));