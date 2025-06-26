function toggleChartWidget(products) {
  const content = document.getElementById('chartContent');
  const isVisible = content.style.display === 'block';
  content.style.display = isVisible ? 'none' : 'block';

  if (!isVisible) {
    requestAnimationFrame(() => {
      setTimeout(() => {
        updateCharts(products);
      }, 50);
    });
  }
}

function updateCharts(products) {
  const prices = products.map(p => parseFloat(p.price));
  const ratings = products.map(p => parseFloat(p.rating ?? 0));
  const discounts = products.map(p => parseFloat(p.price) - parseFloat(p.sale_price ?? p.price));

  // Гистограмма по ценам
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

  // Линейный график скидка vs рейтинг с точками и средней линией
  const points = ratings.map((r, i) => ({ rating: r, discount: discounts[i] }));

  const groupStep = 0.1;
  const grouped = {};
  points.forEach(({ rating, discount }) => {
    if (rating === null || isNaN(rating)) return;
    const groupKey = (Math.floor(rating / groupStep) * groupStep).toFixed(1);
    if (!grouped[groupKey]) grouped[groupKey] = [];
    grouped[groupKey].push(discount);
  });

  const groupedRatings = Object.keys(grouped).sort((a, b) => parseFloat(a) - parseFloat(b));
  const averageDiscounts = groupedRatings.map(key => {
    const arr = grouped[key];
    const sum = arr.reduce((acc, v) => acc + v, 0);
    return sum / arr.length;
  });

  const scatterData = points.map(p => ({ x: p.rating, y: p.discount }));

  if (window.discountChart) window.discountChart.destroy();
  window.discountChart = new Chart(document.getElementById('discountVsRatingChart'), {
    type: 'scatter',
    data: {
      datasets: [
        {
          label: 'Товары (скидка vs рейтинг)',
          data: scatterData,
          backgroundColor: 'rgba(33, 150, 243, 0.6)',
          pointRadius: 3,
        },
        {
          label: 'Средняя скидка по рейтингу',
          data: groupedRatings.map((r, i) => ({ x: parseFloat(r), y: averageDiscounts[i] })),
          type: 'line',
          fill: false,
          borderColor: '#FF5722',
          tension: 0.3,
          pointRadius: 0,
        }
      ]
    },
    options: {
      scales: {
        x: {
          title: { display: true, text: 'Рейтинг (0.0 - 5.0)' },
          min: 0,
          max: 5,
          ticks: {
            stepSize: 0.5
          }
        },
        y: {
          title: { display: true, text: 'Размер скидки (₽)' }
        }
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: ctx => `Рейтинг: ${ctx.parsed.x}, Скидка: ${ctx.parsed.y.toFixed(2)} ₽`
          }
        }
      }
    }
  });
}