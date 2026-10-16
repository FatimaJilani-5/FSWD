function roundMe(...numbers) {
    if (numbers.length === 0) {
        return 0;
    }

    let result = numbers.map(num => Math.round(num));

    if (result.length === 1) {
        return result[0];
    }

    return result;
}

console.log(roundMe());
console.log(roundMe(4.7));
console.log(roundMe(4.7, 4.4));