function fruits() {
    console.group(" Завдання 1 — Масив фруктів");

    let fruits = ["яблуко", "банан", "груша", "виноград", "апельсин", "манго"];
    console.log("Початковий масив:", [...fruits]);

    const removed = fruits.pop();
    console.log(`1. Видалено: "${removed}". Оновлений масив:`, [...fruits]);

    fruits.unshift("ананас");
    console.log('2. Додано "ананас" на початок:', [...fruits]);

    fruits.sort((a, b) => b.localeCompare(a, "uk"));
    console.log("3. Зворотній алфавітний порядок:", [...fruits]);

    const index = fruits.indexOf("яблуко");
    console.log(`4. Індекс елемента "яблуко": ${index}`);

    console.groupEnd();
}

function colors () {
    console.group("Завдання 2 — Масив кольорів");

    let colors = [
        "синій",
        "червоний",
        "темно-синій",
        "зелений",
        "блакитний",
        "жовто-синій",
        "жовтий",
        "синьо-зелений",
    ];
    console.log("Початковий масив:", colors);

    // найдовший, найкоротший
    const longest = colors.reduce((a, b) => (a.length >= b.length ? a : b));
    const shortest = colors.reduce((a, b) => (a.length <= b.length ? a : b));
    console.log(`1. Найдовший: "${longest}" (${longest.length} символів)`);
    console.log(`   Найкоротший: "${shortest}" (${shortest.length} символів)`);

    colors = colors.filter((color) => color.includes("синій"));
    console.log('2. Тільки зі словом "синій":', colors);

    const result = colors.join(", ");
    console.log("3. Рядок через join:", result);

    console.groupEnd();
}

function employer() {
    console.group("Завдання 3 — Масив працівників");

    let employees = [
        { name: "Катя", age: 19, position: "дизайнер" },
        { name: "Міша", age: 18, position: "розробник" },
        { name: "Максім", age: 18.5, position: "менеджер" },
        { name: "Таня", age: 18, position: "розробник" },
        { name: "Діана", age: 18, position: "менеджер" },
    ];
    console.log("Початковий масив:", employees);

    employees.sort((a, b) => a.name.localeCompare(b.name, "uk"));
    console.log("1. Відсортовано за іменем:", employees);

    const developers = employees.filter((emp) => emp.position === "розробник");
    console.log("2. Розробники:", developers);

    employees = employees.filter((emp) => emp.age !== 19);
    console.log("3. Видалено працівника віком 19 років:", employees);

    employees.push({ name: "Ваня", age: 18, position: "дизайнер" });
    console.log("4. Додано нового працівника:", employees);

    console.groupEnd();
}

function students() {
    console.group(" Завдання 4 — Масив студентів");

    let students = [
        { name: "Олексій", age: 20, course: 2 },
        { name: "Марина", age: 22, course: 3 },
        { name: "Дмитро", age: 19, course: 1 },
        { name: "Катерина", age: 21, course: 4 },
        { name: "Василь", age: 23, course: 3 },
    ];
    console.log("Початковий масив:", students);

    students = students.filter((s) => s.name !== "Олексій");
    console.log('1. Видалено "Олексій":', students);

    students.push({ name: "Аліна", age: 20, course: 2 });
    console.log("2. Додано нового студента:", students);

    students.sort((a, b) => b.age - a.age);
    console.log("3. Відсортовано за віком (старший → молодший):", students);

    const thirdCourse = students.find((s) => s.course === 3);
    console.log("4. Студент на 3-му курсі:", thirdCourse);

    console.groupEnd();
}

function metods() {
    console.group(" Завдання 5 — Масив чисел");

    let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    console.log("Початковий масив:", numbers);

    const squared = numbers.map((n) => n * n);
    console.log("1. Квадрати чисел:", squared);

    const even = numbers.filter((n) => n % 2 === 0);
    console.log("2. Парні числа:", even);

    const sum = numbers.reduce((acc, n) => acc + n, 0);
    console.log("3. Сума всіх елементів:", sum);

    const extra = [11, 12, 13, 14, 15];
    numbers = [...extra, ...numbers];
    console.log("4. Масив після додавання:", numbers);

    numbers.splice(0, 3);
    console.log("5. Після видалення перших 3 елементів:", numbers);

    console.groupEnd();
}

function libraryManagement() {
    console.group("Завдання 6 — Бібліотека");


    let books = [
        { title: "Кобзар", author: "Тарас Шевченко", genre: "поезія", pages: 300, isAvailable: true },
        { title: "Застеляйте ліжко", author: "Адмірал Вільям Макрейвен.", genre: "автобіографія", pages: 150, isAvailable: false },
        { title: "Антени", author: "Сергій Жадан", genre: "вірші", pages: 200, isAvailable: true },
        { title: "Мавка", author: "Леся Українка", genre: "драма", pages: 120, isAvailable: true },
    ];
    console.log("1. Початкова бібліотека:", books);

    function addBook(title, author, genre, pages) {
        books.push({ title, author, genre, pages, isAvailable: true });
        console.log(`2. Додано книгу "${title}":`, books);
    }

    function removeBook(title) {
        books = books.filter((b) => b.title !== title);
        console.log(`3. Видалено книгу "${title}":`, books);
    }

    function findBooksByAuthor(author) {
        const result = books.filter((b) => b.author === author);
        console.log(`4. Книги автора "${author}":`, result);
        return result;
    }

    function toggleBookAvailability(title, isBorrowed) {
        const book = books.find((b) => b.title === title);
        if (book) {
            book.isAvailable = !isBorrowed;
            console.log(`5. "${title}" — isAvailable: ${book.isAvailable}`);
        }
    }

    function sortBooksByPages() {
        books.sort((a, b) => a.pages - b.pages);
        console.log("6. Відсортовано за сторінками:", books);
    }

    function getBooksStatistics() {
        const stats = {
            total: books.length,
            available: books.filter((b) => b.isAvailable).length,
            borrowed: books.filter((b) => !b.isAvailable).length,
            avgPages: Math.round(books.reduce((acc, b) => acc + b.pages, 0) / books.length),
        };
        console.log("7. Статистика:", stats);
        return stats;
    }

    addBook("Місто", "Валер'ян Підмогильний", "роман", 350);
    removeBook("Захар Беркут");
    findBooksByAuthor("Леся Українка");
    toggleBookAvailability("Кобзар", true);
    sortBooksByPages();
    getBooksStatistics();

    console.groupEnd();
}

function student () {
    console.group("Завдання 7 — Об'єкт студента");

    let student = {
        name: "Настічка",
        age: 18,
        course: 2,
    };
    console.log("1. Початковий об'єкт:", student);

    student.subjects = ["Математика", "Оперційні Системи", "веб-технології"];
    console.log("2. Додано предмети:", student);

    delete student.age;
    console.log("3. Видалено властивість age:", student);

    console.groupEnd();
}

student();
libraryManagement();
metods();
students();
employer();
colors();
fruits();