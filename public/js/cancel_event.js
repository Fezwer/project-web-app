document.getElementById("cancel_event").addEventListener("click", function () {
    disableScroll(); // Запрет прокрутки
    var confirmationBox = document.createElement("div");
    confirmationBox.style.position = "fixed";
    confirmationBox.style.top = "50%";
    confirmationBox.style.left = "50%";
    confirmationBox.style.transform = "translate(-50%, -50%)";
    confirmationBox.style.backgroundColor = "#FFF4F4";
    confirmationBox.style.width = "300px";
    confirmationBox.style.padding = "40px";
    confirmationBox.style.borderRadius = "17px";
    confirmationBox.style.weight = "607px";
    confirmationBox.style.height = "280px";
    confirmationBox.style.boxShadow = "70px";
    confirmationBox.style.zIndex = "9999"; // Установка высокого значения z-index для окна подтверждения

    var heading = document.createElement("h2");
    heading.style.fontWeight = "bold";
    heading.style.color = "#9B0101";
    heading.textContent = "Отмена записи на мероприятие";
    heading.style.textAlign = "center";
    confirmationBox.appendChild(heading);

    var message = document.createElement("p");
    message.style.marginTop = "30px";
    message.style.color = "#9B0101";
    message.textContent = "Вы уверены, что хотите отменить запись на это событие?";
    message.style.textAlign = "center";
    confirmationBox.appendChild(message);

    var deleteButton = document.createElement("button");
    deleteButton.style.backgroundColor = "#9B0101";
    deleteButton.style.color = "white";
    deleteButton.style.marginTop = "20px"; // Изменение отступа между кнопками
    deleteButton.style.marginRight = "40px";
    deleteButton.style.width = "50%"; // Ширина кнопки занимает 100% ширины родительского контейнера
    deleteButton.textContent = "Отменить запись";
    deleteButton.style.borderRadius = "17px";
    deleteButton.style.height = "40px";
    deleteButton.style.width = "200px";
    deleteButton.style.border = "none";
    deleteButton.style.boxShadow = "0px 2px 4px rgba(0, 0, 0, 0.4)";
    deleteButton.style.marginLeft = "50px";
    confirmationBox.appendChild(deleteButton);

    var cancelButton = document.createElement("button");
    cancelButton.style.backgroundColor = "#333333";
    cancelButton.style.color = "white";
    cancelButton.style.marginTop = "15px"; // Изменение отступа между кнопками
    cancelButton.style.width = "30%"; // Ширина кнопки занимает 100% ширины родительского контейнера
    cancelButton.textContent = "Отмена";
    cancelButton.style.borderRadius = "17px";
    cancelButton.style.height = "40px";
    cancelButton.style.width = "100px";
    cancelButton.style.border = "none";
    cancelButton.style.marginLeft = "100px";
    cancelButton.style.boxShadow = "0px 2px 4px rgba(0, 0, 0, 0.4)";
    confirmationBox.appendChild(cancelButton);

    deleteButton.addEventListener("click", function () {
        confirmationBox.remove();
        overlay.remove(); // Удаление затемнения
        enableButtons();
        // Добавьте здесь дополнительный код для удаления аккаунта
        enableScroll();
    });

    cancelButton.addEventListener("click", function () {
        confirmationBox.remove();
        overlay.remove(); // Удаление затемнения
        enableButtons(); // Активация кнопок
        enableScroll();
    });

    document.body.appendChild(confirmationBox);

    // Блокировка других элементов на странице
    var overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    overlay.style.zIndex = "9998"; // Установка z-index ниже, чем у окна подтверждения
    overlay.style.pointerEvents = "auto"; // Включение взаимодействия с затемнением
    document.body.appendChild(overlay);

    enableButtons(); // Делаем кнопки кликабельными

    function disableButtons() {
        // Получение всех кнопок на странице и их блокировка
        var buttons = document.getElementsByTagName("button");
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].disabled = true;
        }
    }

    function enableButtons() {
        // Получение всех кнопок на странице и их активация
        var buttons = document.getElementsByTagName("button");
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].disabled = false;
        }
    }

    function disableScroll() {
        // Получаем текущую позицию прокрутки страницы
        var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

        // Сохраняем текущую позицию прокрутки в стилях элемента
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
        document.documentElement.scrollTop = scrollTop;
        document.documentElement.scrollLeft = scrollLeft;
    }

    function enableScroll() {
        // Восстанавливаем стили прокрутки страницы
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
    }

});