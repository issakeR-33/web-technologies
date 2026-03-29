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