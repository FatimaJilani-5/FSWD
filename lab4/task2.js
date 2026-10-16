let num = 11;
let next = num + 1;

while (true) {
    let isPrime = true;

    for (let i = 2; i < next; i++) {
        if (next % i === 0) {
            isPrime = false;
            break;
        }
    }

    if (isPrime) {
        console.log("Next prime number: " + next);
        break;
    }

    next++;
}