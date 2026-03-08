function InRange(el, num1, num2) {
    return el >= num1 && el <= num2;
}

console.log(InRange(5, 1, 10));  // true
console.log(InRange(15, 1, 10)); // false

let isActive = true;
let isActive2 = false;

isActive = !isActive;
isActive2 = !isActive2;

console.log(`isActive: ${isActive}`);   // false
console.log(`isActive2: ${isActive2}`); // true