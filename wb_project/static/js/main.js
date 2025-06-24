document.addEventListener('DOMContentLoaded', () => {
  const minPriceSlider = document.getElementById('minPrice');
  const maxPriceSlider = document.getElementById('maxPrice');
  const minPriceValue = document.getElementById('minPriceValue');
  const maxPriceValue = document.getElementById('maxPriceValue');

  const ratingMinInput = document.getElementById('ratingMin');
  const feedbacksMinInput = document.getElementById('feedbacksMin');
  const sortSelect = document.getElementById('sortSelect');

  let allProducts = [];

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
      ordering: sortSelect.value
    });

    const response = await fetch(`/api/products/?${params.toString()}`);
    const data = await response.json();
    allProducts = data;

    renderTable(data);
    updateCharts(data);
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
  sortSelect.addEventListener('change', fetchProducts);

  updatePriceLabels();
  fetchProducts();
});
