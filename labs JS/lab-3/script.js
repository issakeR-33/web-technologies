function task1() {
  let a = 0, b = 1;
  let sum = 0;
  let count = 0;

  while (count < 10) {
    sum += a;
    let next = a + b;
    a = b;
    b = next;
    count++;
  }

  console.log("Завдання 1 — Сума перших 10 чисел Фібоначчі:", sum);
}

function task2() {
  function simplNum(n) {
    if (n < 2) return false;
    for (let i = 2; i <= Math.sqrt(n); i++) {
      if (n % i === 0) return false;
    }
    return true;
  }

  let sum = 0;
  for (let i = 2; i <= 1000; i++) {
    if (simplNum(i)) sum += i;
  }

  console.log("Завдання 2 — Сума простих чисел від 1 до 1000:", sum);
}


function task3(num) {
  let day;
  switch (num) {
    case 1: day = "Понеділок"; break;
    case 2: day = "Вівторок"; break;
    case 3: day = "Середа"; break;
    case 4: day = "Четвер"; break;
    case 5: day = "П'ятниця"; break;
    case 6: day = "Субота"; break;
    case 7: day = "Неділя"; break;
    default: day = "Невірне число (введіть від 1 до 7)";
  }
  console.log(`Завдання 3 — День тижня для числа ${num}:`, day);
}

function task4(arr) {
  const result = arr.filter(str => str.length % 2 !== 0);
  console.log("Завдання 4 — Рядки з непарною довжиною:", result);
  return result;
}

const task5 = (arr) => {
  const result = arr.map(n => n + 1);
  console.log("Завдання 5 — Масив зі збільшеними на 1 числами:", result);
  return result;
};


function task6(a, b) {
  const result = (a + b === 10) || (Math.abs(a - b) === 10);
  console.log(`a=${a}, b=${b}`, result);
  return result;
}


console.log("Лабораторна робота №3");

task1();

task2();

task3(1);  
task3(7);   
task3(6);   

task4(["hi", "hello", "hey", "world", "js", "code"]);

task5([1, 5, 10, 0, -3]);

task6(3, 7);   
task6(15, 5);  
task6(4, 8);   