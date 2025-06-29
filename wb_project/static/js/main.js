let allProducts = [];
let globalMinPrice = 0;
let globalMaxPrice = 0;
let currentOrdering = '';

document.addEventListener('DOMContentLoaded', () => {
  const minPriceSlider = document.getElementById('minPrice');
  const maxPriceSlider = document.getElementById('maxPrice');
  const minPriceValue = document.getElementById('minPriceValue');
  const maxPriceValue = document.getElementById('maxPriceValue');

  const ratingMinInput = document.getElementById('ratingMin');
  const feedbacksMinInput = document.getElementById('feedbacksMin');

  function updatePriceLabels() {
    minPriceValue.textContent = minPriceSlider.value;
    maxPriceValue.textContent = maxPriceSlider.value;
  }

  function clampSliders() {
    if (parseInt(minPriceSlider.value) > parseInt(maxPriceSlider.value)) {
      minPriceSlider.value = maxPriceSlider.value;
    }
  }

  async function fetchProducts() {
    const params = new URLSearchParams({
      min_price: minPriceSlider.value,
      max_price: maxPriceSlider.value,
      min_rating: ratingMinInput.value,
      min_feedbacks: feedbacksMinInput.value,
      ordering: currentOrdering
    });

    const response = await fetch(`/api/products/?${params.toString()}`);
    const data = await response.json();
    allProducts = data;

    renderTable(data);
    updateCharts(data);
  }

  async function fetchPriceRange() {
    const response = await fetch('/api/products/price-range/');
    const data = await response.json();

    globalMinPrice = Math.floor(data.min_price);
    globalMaxPrice = Math.ceil(data.max_price);

    minPriceSlider.min = globalMinPrice;
    minPriceSlider.max = globalMaxPrice;

    maxPriceSlider.min = globalMinPrice;
    maxPriceSlider.max = globalMaxPrice;

    if (!minPriceSlider.value || minPriceSlider.value < globalMinPrice)
      minPriceSlider.value = globalMinPrice;

    if (!maxPriceSlider.value || maxPriceSlider.value > globalMaxPrice)
      maxPriceSlider.value = globalMaxPrice;

    updatePriceLabels();
  }

  function renderTable(products) {
    const tbody = document.getElementById('productTableBody');
    tbody.innerHTML = '';

    products.forEach(product => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${product.nm_id}</td>
        <td>${product.name}</td>
        <td>${product.price} ₽</td>
        <td>${product.sale_price ? product.sale_price + ' ₽' : '-'}</td>
        <td>${product.rating ?? '-'}</td>
        <td>${product.feedbacks}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  minPriceSlider.addEventListener('input', () => {
    clampSliders();
    updatePriceLabels();
    fetchProducts();
  });

  maxPriceSlider.addEventListener('input', () => {
    clampSliders();
    updatePriceLabels();
    fetchProducts();
  });

  ratingMinInput.addEventListener('change', fetchProducts);
  feedbacksMinInput.addEventListener('change', fetchProducts);

  document.querySelectorAll('th[data-sort]').forEach(header => {
    header.addEventListener('click', () => {
      const field = header.getAttribute('data-sort');

      if (currentOrdering === field) {
        currentOrdering = `-${field}`;
      } else if (currentOrdering === `-${field}`) {
        currentOrdering = '';
      } else {
        currentOrdering = field;
      }

      fetchProducts();
      highlightSortedColumn(header);
    });
  });

  function highlightSortedColumn(activeHeader) {
    document.querySelectorAll('th[data-sort]').forEach(header => {
      header.classList.remove('sorted-asc', 'sorted-desc');
    });

    if (currentOrdering.startsWith('-')) {
      activeHeader.classList.add('sorted-desc');
    } else if (currentOrdering) {
      activeHeader.classList.add('sorted-asc');
    }
  }

  updatePriceLabels();
  fetchPriceRange();
  fetchProducts();
});