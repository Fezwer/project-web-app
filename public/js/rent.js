const urlParams = new URLSearchParams(window.location.search);
const balance = urlParams.get('balance');
document.getElementById('user_balance').textContent = balance;

fetch('/getShipsData')
  .then(response => response.json())
  .then(data => {
    const ships = data.ships;
    const tableBody = document.querySelector('#shipTable tbody');

    ships.forEach((ship) => {
      const row = document.createElement('tr');
      const status = ship.yacht_owner ? 'Арендовано' : 'Свободно'; // Проверка значения yacht_owner

      row.innerHTML = `
        <td>${ship.yacht_name}</td>
        <td>${ship.yacht_price}</td>
        <td>${status}</td>
      `;
      tableBody.appendChild(row);
    });
  })
  .catch(error => {
    console.error('Ошибка при получении данных:', error);
  });