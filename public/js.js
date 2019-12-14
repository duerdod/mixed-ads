const spinner = `
  <div class="spinner">
    <div class="bounce1"></div>
    <div class="bounce2"></div>
    <div class="bounce3"></div>
    </div>
  `;

async function bringMeSomeAds() {
  const adTitle = document.querySelector('.title');
  adTitle.innerHTML = spinner;
  const response = await fetch('/ad');
  const data = await response.json();
  adTitle.innerHTML = null;
  adTitle.textContent = data.ad;
}
