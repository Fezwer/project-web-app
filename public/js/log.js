document.addEventListener('DOMContentLoaded', function () {
  const urlParams = new URLSearchParams(window.location.search);
  const success = urlParams.get('success');
  const error = urlParams.get('error');
  
  if (success === 'true') {
    alert('Регистрация прошла успешно!');
  }
  if (error === 'unauthorized'){
    alert('Неправильный логин или пароль!');
  }
});

// Функция для отправки данных формы на сервер
function loginUser(email, password) {
  fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email: email, password: password })
  })
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Authentication failed');
    }
  })
  .then(data => {
    if (data.error) {
      alert(data.error.message);
    }
  })
  .catch(error => {
    alert(error.message); // Выводим сообщение об ошибке
  });
}

document.querySelector('.submit-button button').addEventListener('click', function(event) {
  event.preventDefault(); // Предотвращаем отправку формы по умолчанию

  var email = document.getElementById('login_email').value; // Получаем значение поля email
  var password = document.getElementById('login_password').value; // Получаем значение поля password

  // Вызываем функцию loginUser с полученными значениями
  loginUser(email, password);
});