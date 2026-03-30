let products = new Map();

function addProduct(id, name, price, count) {
    products.set(id, { name, price, count });
}

deleteProduct = (id) => {
    if (products.has(id)) {
        products.delete(id);
    } else {
        console.log(`Product with id ${id} does not exist.`);
    }
}

function updateProduct(id, price, count) {
    if (products.has(id)) {
        const product = products.get(id);
        products.set(id, { ...product, price, count });
        addHistory(product, new Date());
    } else {
        console.log(`Product with id ${id} does not exist.`);
    }
}

function findByName(name) {
    for (let [id, product] of products) {
        if (product.name === name) {
            return { id, ...product };
        }
    }
    console.log(`Product with name ${name} does not exist.`);
    return null;
}

function isBought(id) {
    if (products.has(id)) {
        const product = products.get(id);
        product.count--;
        products.set(id, product);
        return product.count > 0;
    } else {
        console.log(`Product with id ${id} does not exist.`);
        return false;
    }
}

let orderedProducts = new Set();

function isBoughtOneMore(id) {
    if (!products.has(id)) {
        console.log(`Product with id ${id} does not exist.`);
        return false;
    }
    const product = products.get(id);
    if (orderedProducts.has(product)) {
        console.log(`Product with id ${id} has already been bought.`);
    }
    orderedProducts.add(product);
    product.count--;
    products.set(id, product);
    return product.count > 0;
}

let history = new WeakMap();

function addHistory(product, date) {
    if (!history.has(product)) {
        history.set(product, []);
    }
    history.get(product).push(date);}

    // ========== DEMO ==========

// Додаємо продукти
addProduct(1, 'Apple', 10, 5);
addProduct(2, 'Banana', 5, 3);
addProduct(3, 'Orange', 8, 10);
console.log('=== Каталог після додавання ===');
products.forEach((p, id) => console.log(`[${id}] ${p.name} | ціна: ${p.price} | кількість: ${p.count}`));

// Пошук за назвою
console.log('\n=== Пошук "Banana" ===');
console.log(findByName('Banana'));

// Оновлення продукту
console.log('\n=== Оновлення Apple (нова ціна: 15, кількість: 8) ===');
updateProduct(1, 15, 8);
const apple = products.get(1);
console.log(`Apple -> ціна: ${apple.price}, кількість: ${apple.count}`);

// Замовлення
console.log('\n=== Замовлення Orange ===');
isBought(3);
const orange = products.get(3);
console.log(`Orange після замовлення -> кількість: ${orange.count}`);

// Замовлення з відстеженням у Set
console.log('\n=== Замовлення Banana через isBoughtOneMore ===');
isBoughtOneMore(2);
console.log('Замовлені продукти (Set):', [...orderedProducts].map(p => p.name).join(', '));

// Видалення
console.log('\n=== Видалення продукту з id=2 ===');
deleteProduct(2);
console.log('Каталог після видалення:');
products.forEach((p, id) => console.log(`[${id}] ${p.name} | ціна: ${p.price} | кількість: ${p.count}`));

// Пошук видаленого
console.log('\n=== Пошук видаленого "Banana" ===');
findByName('Banana');