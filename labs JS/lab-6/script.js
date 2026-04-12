'use strict';

/* ─────────────────── UTILS ─────────────────── */
const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
const getCurrentDate = () => new Date().toISOString();
const formatPrice = (price) => `${Number(price).toFixed(2)} грн`;

/* ─────────────────── STATE ─────────────────── */
let products = [
  {
    id: generateId(), name: 'Steelseries arctis nova 7', price: 1299, category: 'Електроніка',
    image: 'https://img.mta.ua/image/cache/data/foto/z688/688065/photos/SteelSeries-Arctis-Nova-7-84-Black-01-600x600.jpg',
    createdAt: getCurrentDate(), updatedAt: getCurrentDate(),
  },
  {
    id: generateId(), name: 'Футболка Унісекс', price: 450, category: 'Одяг',
    image: 'https://omixcdn.com/img/catalog/futbolka-stafford-190-3233435-0.jpg',
    createdAt: getCurrentDate(), updatedAt: getCurrentDate(),
  },
  {
    id: generateId(), name: 'Гаррі Поттер і в’язень Азкабану. Велике ілюстроване видання', price: 1000, category: 'Книги',
    image: 'https://s.ababahalamaha.com.ua/images/800x800/hp-3-illustrated_3.jpg',
    createdAt: getCurrentDate(), updatedAt: getCurrentDate(),
  },
];

let activeFilter = null;
let activeSort   = null;

/* ─────────────────── DOM REFS ─────────────────── */
const $productList    = document.getElementById('js-product-list');
const $emptyState     = document.getElementById('js-empty-state');
const $productCount   = document.getElementById('js-product-count');
const $totalPrice     = document.getElementById('js-total-price');
const $filterButtons  = document.getElementById('js-filter-buttons');
const $resetFilter    = document.getElementById('js-reset-filter');
const $resetSort      = document.getElementById('js-reset-sort');
const $addBtn         = document.getElementById('js-add-btn');
const $modalBackdrop  = document.getElementById('js-modal-backdrop');
const $modalTitle     = document.getElementById('js-modal-title');
const $productForm    = document.getElementById('js-product-form');
const $editId         = document.getElementById('js-edit-id');
const $fName          = document.getElementById('js-f-name');
const $fPrice         = document.getElementById('js-f-price');
const $fCategory      = document.getElementById('js-f-category');
const $fImage         = document.getElementById('js-f-image');
const $modalClose     = document.getElementById('js-modal-close');
const $modalCancel    = document.getElementById('js-modal-cancel');
const $snackContainer = document.getElementById('js-snackbar-container');
const $burgerBtn      = document.getElementById('js-burger-btn');
const $aside          = document.getElementById('js-aside');
const $asideClose     = document.getElementById('js-aside-close');
const $blurOverlay    = document.getElementById('js-blur-overlay');

/* ─────────────────── PURE FUNCTIONS ─────────────────── */
const addProduct = (products, productData) => {
  const newProduct = {
    id:        generateId(),
    name:      productData.productName,
    price:     parseFloat(productData.productPrice),
    category:  productData.productCategory,
    image:     productData.productImage,
    createdAt: getCurrentDate(),
    updatedAt: getCurrentDate(),
  };
  return [...products, newProduct];
};

const updateProduct = (products, productId, productData) =>
  products.map(p => p.id !== productId ? p : {
    ...p,
    name:      productData.productName,
    price:     parseFloat(productData.productPrice),
    category:  productData.productCategory,
    image:     productData.productImage,
    updatedAt: getCurrentDate(),
  });

const deleteProduct = (products, productId) =>
  products.filter(p => p.id !== productId);

const getCategories = (products) =>
  [...new Set(products.map(p => p.category))].sort();

const filterProducts = (products, category) =>
  category ? products.filter(p => p.category === category) : products;

const sortProducts = (products, sortBy) => {
  if (!sortBy) return products;
  return [...products].sort((a, b) => {
    if (sortBy === 'price') return a.price - b.price;
    return new Date(a[sortBy]) - new Date(b[sortBy]);
  });
};

const calculateTotalPrice = (products) =>
  products.reduce((sum, p) => sum + p.price, 0);

const getFilteredAndSorted = (products, filter, sort) =>
  sortProducts(filterProducts(products, filter), sort);

/* ─────────────────── UI HELPERS ─────────────────── */
const showSnackbar = (message, type = 'success') => {
  const el = document.createElement('div');
  el.className = `snackbar ${type}`;
  el.textContent = message;
  $snackContainer.appendChild(el);
  setTimeout(() => {
    el.classList.add('hide');
    el.addEventListener('animationend', () => el.remove());
  }, 3000);
};

const toggleModal = (show, editMode = false) => {
  $modalBackdrop.classList.toggle('open', show);
  $modalTitle.textContent = editMode ? 'Редагувати товар' : 'Новий товар';
  if (!show) $productForm.reset();
};

const openEditModal = (productId) => {
  const product = products.find(p => p.id === productId);
  if (!product) return;
  $editId.value    = product.id;
  $fName.value     = product.name;
  $fPrice.value    = product.price;
  $fCategory.value = product.category;
  $fImage.value    = product.image;
  toggleModal(true, true);
};

/* ─────────────────── RENDER ─────────────────── */
const createProductCard = (product) => {
  const li = document.createElement('li');
  li.className = 'product-card';
  li.dataset.id = product.id;
  li.innerHTML = `
    <img class="product-image" src="${product.image}" alt="${product.name}"
         onerror="this.src='https://picsum.photos/seed/${product.id}/400/300'" />
    <div class="product-info">
      <div class="product-id">ID: ${product.id}</div>
      <h3 class="product-name">${product.name}</h3>
      <div class="product-price">${formatPrice(product.price)}</div>
      <span class="product-category">${product.category}</span>
      <div class="product-actions">
        <button class="edit-btn"   data-id="${product.id}">Редагувати</button>
        <button class="delete-btn" data-id="${product.id}">Видалити</button>
      </div>
    </div>`;
  return li;
};

const updateTotalPrice = (products) => {
  $totalPrice.textContent = calculateTotalPrice(products).toFixed(2);
};

const updateFilterButtons = (products) => {
  const categories = getCategories(products);
  $filterButtons.innerHTML = '';
  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'filter-btn' + (activeFilter === cat ? ' active' : '');
    btn.textContent = cat;
    btn.dataset.category = cat;
    $filterButtons.appendChild(btn);
  });
};

const updateSortButtons = () => {
  document.querySelectorAll('.sort-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.sort === activeSort);
  });
};

const refreshProductList = () => {
  const visible = getFilteredAndSorted(products, activeFilter, activeSort);
  $productList.innerHTML = '';
  $emptyState.classList.toggle('visible', products.length === 0);
  visible.forEach(p => $productList.appendChild(createProductCard(p)));
  $productCount.textContent = `Товарів: ${visible.length}`;
  updateTotalPrice(products);
  updateFilterButtons(products);
  updateSortButtons();
};

/* ─────────────────── ACTIONS ─────────────────── */
const handleAddOrEdit = (e) => {
  e.preventDefault();
  if (!$productForm.checkValidity()) { $productForm.reportValidity(); return; }

  const data = {
    productName:     $fName.value.trim(),
    productPrice:    $fPrice.value,
    productCategory: $fCategory.value,
    productImage:    $fImage.value.trim(),
  };

  const editId = $editId.value;
  if (editId) {
    products = updateProduct(products, editId, data);
    showSnackbar(`Товар оновлено: ID ${editId} — ${data.productName}`);
  } else {
    products = addProduct(products, data);
    showSnackbar(`Товар «${data.productName}» додано`);
  }
  toggleModal(false);
  refreshProductList();
};

const deleteProductWithAnimation = (productId) => {
  const card = $productList.querySelector(`[data-id="${productId}"]`);
  const deletedProduct = products.find(p => p.id === productId);
  if (!card || !deletedProduct) return;
  card.classList.add('removing');
  card.addEventListener('animationend', () => {
    products = deleteProduct(products, productId);
    refreshProductList();
    showSnackbar(`Товар «${deletedProduct.name}» видалено`, 'error');
  }, { once: true });
};

/* ─────────────────── EVENTS ─────────────────── */
$productList.addEventListener('click', (e) => {
  const editBtn   = e.target.closest('.edit-btn');
  const deleteBtn = e.target.closest('.delete-btn');
  if (editBtn)   openEditModal(editBtn.dataset.id);
  if (deleteBtn) deleteProductWithAnimation(deleteBtn.dataset.id);
});

$filterButtons.addEventListener('click', (e) => {
  const btn = e.target.closest('.filter-btn');
  if (!btn) return;
  activeFilter = activeFilter === btn.dataset.category ? null : btn.dataset.category;
  refreshProductList();
});

document.querySelectorAll('.sort-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    activeSort = activeSort === btn.dataset.sort ? null : btn.dataset.sort;
    refreshProductList();
  });
});

$resetFilter.addEventListener('click', () => { activeFilter = null; refreshProductList(); });
$resetSort.addEventListener('click',   () => { activeSort   = null; refreshProductList(); });
$addBtn.addEventListener('click',      () => { $editId.value = ''; toggleModal(true, false); });
$productForm.addEventListener('submit', handleAddOrEdit);
$modalClose.addEventListener('click',  () => toggleModal(false));
$modalCancel.addEventListener('click', () => toggleModal(false));
$modalBackdrop.addEventListener('click', (e) => {
  if (e.target === $modalBackdrop) toggleModal(false);
});

/* ─── Aside drawer ─── */
const openAside  = () => {
  $aside.classList.add('open');
  $blurOverlay.classList.add('open');
};
const closeAside = () => {
  $aside.classList.remove('open');
  $blurOverlay.classList.remove('open');
};
$burgerBtn.addEventListener('click', openAside);
$asideClose.addEventListener('click', closeAside);
$blurOverlay.addEventListener('click', closeAside);

/* ─── Escape key ─── */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') { toggleModal(false); closeAside(); }
});

/* ─────────────────── INIT ─────────────────── */
refreshProductList();