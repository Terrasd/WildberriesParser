function toggleChartWidget() {
  const content = document.getElementById('chartContent');
  content.style.display = content.style.display === 'none' ? 'block' : 'none';
}

function updateCharts(products) {
  const prices = products.map(p => parseFloat(p.price));
  const ratings = products.map(p => parseFloat(p.rating));
  const discounts = products.map(p => parseFloat(p.price) - parseFloat(p.sale_price || p.price));

  const priceBuckets = Array(10).fill(0);
  const maxPrice = Math.max(...prices, 1);
  prices.forEach(price => {
    const index = Math.min(Math.floor((price / maxPrice) * 10), 9);
    priceBuckets[index]++;
  });

  if (window.priceChart) window.priceChart.destroy();
  window.priceChart = new Chart(document.getElementById('priceHistogram'), {
    type: 'bar',
    data: {
      labels: priceBuckets.map((_, i) => {
        const from = Math.round((i * maxPrice) / 10);
        const to = Math.round(((i + 1) * maxPrice) / 10);
        return `${from}–${to} ₽`;
      }),
      datasets: [{
        label: 'Количество товаров',
        data: priceBuckets,
        backgroundColor: '#4CAF50'
      }]
    }
  });

  if (window.discountChart) window.discountChart.destroy();
  window.discountChart = new Chart(document.getElementById('discountVsRatingChart'), {
    type: 'line',
    data: {
      labels: ratings,
      datasets: [{
        label: 'Скидка vs Рейтинг',
        data: ratings.map((r, i) => ({ x: r, y: discounts[i] })),
        borderColor: '#2196F3',
        backgroundColor: 'rgba(33, 150, 243, 0.2)',
        pointRadius: 3
      }]
    },
    options: {
      scales: {
        x: { title: { display: true, text: 'Рейтинг' } },
        y: { title: { display: true, text: 'Скидка (₽)' } }
      }
    }
  });
}