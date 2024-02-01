document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const error = urlParams.get('error');
    
    if (success === 'see_again') {
      alert('Такой пользователь уже зарегистрирован');
    }
    if (success === 'server_erorr') {
      alert('Ошибка сервера!');
    }
  });