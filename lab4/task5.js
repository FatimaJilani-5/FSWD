// Task 5: Implement abs, ceil, and floor

// 1. Absolute Value
function abs(...numbers) {
    let result = numbers.map(num => Math.abs(num));

    if (result.length === 0) {
        return 0;
    }

    if (result.length === 1) {
        return result[0];
    }

    return result;
}

// 2. Ceiling
function ceil(...numbers) {
    let result = numbers.map(num => Math.ceil(num));

    if (result.length === 0) {
        return 0;
    }

    if (result.length === 1) {
        return result[0];
    }

    return result;
}

// 3. Floor
function floor(...numbers) {
    let result = numbers.map(num => Math.floor(num));

    if (result.length === 0) {
        return 0;
    }

    if (result.length === 1) {
        return result[0];
    }

    return result;
}

// Testing abs()
console.log("ABS:");
console.log(abs());
console.log(abs(-5));
console.log(abs(-5, 3, -8));

// Testing ceil()
console.log("CEIL:");
console.log(ceil());
console.log(ceil(4.2));
console.log(ceil(4.2, 5.8, -2.7));

// Testing floor()
console.log("FLOOR:");
console.log(floor());
console.log(floor(4.9));
console.log(floor(4.9, 5.1, -2.3));