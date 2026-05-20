// app.js
const COINS_URL = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false";
const GLOBAL_URL = "https://api.coingecko.com/api/v3/global";

async function fetchGlobalData() {
  try {
    const res = await fetch(GLOBAL_URL);
    const data = await res.json();
    const g = data.data;
    
    const statsHTML = `
      <div class="bg-gray-900 rounded-3xl p-6">
        <p class="text-gray-400 text-sm">Total Market Cap</p>
        <p class="text-3xl font-bold">\[ {(g.total_market_cap.usd / 1e12).toFixed(2)}T</p>
      </div>
      <div class="bg-gray-900 rounded-3xl p-6">
        <p class="text-gray-400 text-sm">24h Volume</p>
        <p class="text-3xl font-bold"> \]{(g.total_volume.usd / 1e9).toFixed(1)}B</p>
      </div>
      <div class="bg-gray-900 rounded-3xl p-6">
        <p class="text-gray-400 text-sm">Bitcoin Dominance</p>
        <p class="text-3xl font-bold">${g.market_cap_percentage.btc.toFixed(1)}%</p>
      </div>
      <div class="bg-gray-900 rounded-3xl p-6">
        <p class="text-gray-400 text-sm">Active Coins</p>
        <p class="text-3xl font-bold">${g.active_cryptocurrencies}</p>
      </div>
    `;
    document.getElementById('global-stats').innerHTML = statsHTML;
  } catch(e) { console.error(e); }
}

async function fetchCoins() {
  try {
    const res = await fetch(COINS_URL);
    const coins = await res.json();
    
    let html = '';
    coins.forEach((coin, index) => {
      const change = coin.price_change_percentage_24h;
      const isUp = change >= 0;
      
      html += `
        <tr class="coin-row border-t border-gray-800 hover:bg-gray-800 transition-colors">
          <td class="p-6 font-medium">${index + 1}</td>
          <td class="p-6 flex items-center gap-4">
            <img src="\( {coin.image}" class="w-8 h-8" alt=" \){coin.name}">
            <div>
              <p class="font-semibold">${coin.name}</p>
              <p class="text-gray-500 text-sm uppercase">${coin.symbol}</p>
            </div>
          </td>
          <td class="p-6 text-right font-mono font-medium">\[ {coin.current_price.toLocaleString()}</td>
          <td class="p-6 text-right font-medium ${isUp ? 'price-up' : 'price-down'}">
            ${isUp ? '↑' : '↓'} ${Math.abs(change).toFixed(2)}%
          </td>
          <td class="p-6 text-right font-medium"> \]{(coin.market_cap / 1e9).toFixed(1)}B</td>
          <td class="p-6 text-right font-medium text-gray-400">$${(coin.total_volume / 1e9).toFixed(1)}B</td>
        </tr>
      `;
    });
    
    document.getElementById('coins-body').innerHTML = html;
    document.getElementById('last-updated').textContent = `Last updated: ${new Date().toLocaleTimeString()}`;
  } catch(e) {
    console.error(e);
  }
}

// Simple News (you can replace with better API later)
async function fetchNews() {
  const newsHTML = `
    <div class="bg-gray-800 rounded-2xl p-5">
      <h3 class="font-semibold mb-2">Bitcoin ETF Inflows Hit Record High</h3>
      <p class="text-gray-400 text-sm mb-4">Institutional demand continues to surge as major players increase exposure.</p>
      <a href="#" class="text-yellow-500 text-sm hover:underline">Read more →</a>
    </div>
    <div class="bg-gray-800 rounded-2xl p-5">
      <h3 class="font-semibold mb-2">Ethereum Layer-2 Fees Drop to All-Time Low</h3>
      <p class="text-gray-400 text-sm mb-4">Scaling solutions make DeFi more accessible than ever.</p>
      <a href="#" class="text-yellow-500 text-sm hover:underline">Read more →</a>
    </div>
  `;
  document.getElementById('news-container').innerHTML = newsHTML;
}

function refreshData() {
  fetchCoins();
  fetchGlobalData();
}

// Live Search
document.getElementById('search').addEventListener('input', (e) => {
  const term = e.target.value.toLowerCase();
  const rows = document.querySelectorAll('#coins-body tr');
  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(term) ? '' : 'none';
  });
});

// Initialize
window.onload = () => {
  fetchGlobalData();
  fetchCoins();
  fetchNews();
  
  // Auto refresh every 60 seconds
  setInterval(() => {
    fetchCoins();
    fetchGlobalData();
  }, 60000);
};
