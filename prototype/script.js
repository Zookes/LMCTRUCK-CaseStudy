const rows = document.querySelector('#orderRows');
const toast = document.querySelector('#toast');

const showToast = (message) => {
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2200);
};

const addRow = () => rows.insertAdjacentHTML('beforeend', '<tr><td><input class="part-number" aria-label="Part number"></td><td><input class="quantity" aria-label="Quantity" type="number" min="1" value="1"></td><td class="description"></td><td class="price"></td><td><button class="delete" aria-label="Delete row">×</button></td></tr>');

document.querySelector('#addRow').addEventListener('click', addRow);
document.querySelector('#clearAll').addEventListener('click', () => {
  rows.innerHTML = '';
  addRow();
  document.querySelector('#emptyMessage').textContent = 'Your Shopping Cart is empty!';
});

rows.addEventListener('click', (event) => {
  if (event.target.matches('.delete')) {
    event.target.closest('tr').remove();
    if (!rows.children.length) addRow();
  }
});

document.querySelector('#addCart').addEventListener('click', () => {
  const filled = [...document.querySelectorAll('.part-number')].filter((input) => input.value.trim());
  if (filled.length) {
    document.querySelector('.cart-count').textContent = '(' + filled.length + ')';
    document.querySelector('#emptyMessage').textContent = 'Your Shopping Cart has items ready for checkout.';
    showToast('Items added to cart');
  } else {
    showToast('Enter a part number first');
  }
});

document.querySelector('#upload').addEventListener('click', () => showToast('Upload tool is ready for a parts list'));
document.querySelector('#menuButton').addEventListener('click', () => showToast('Menu opened'));
document.querySelector('#searchButton').addEventListener('click', () => showToast('Search selected'));
