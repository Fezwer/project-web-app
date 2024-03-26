const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('main.db');

// Создаем таблицу users, если она еще не существует
db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, admin INTEGER DEFAULT 0 CHECK(admin IN (0,1)), full_name VARCHAR CHECK (full_name NOT LIKE '%[^A-Za-z]%') NOT NULL, email VARCHAR NOT NULL, password VARCHAR NOT NULL, club_lvl VARCHAR DEFAULT 'БРОНЗОВЫЙ' CHECK (club_lvl IN ('ЗОЛОТОЙ', 'СЕРЕБРЯНЫЙ', 'БРОНЗОВЫЙ')), user_balance INTEGER DEFAULT 0, end_date DATE)");
db.run("CREATE TABLE IF NOT EXISTS events (event_id INTEGER PRIMARY KEY,event_name VARCHAR NOT NULL,event_desct VARCHAR NOT NULL,event_image VARCHAR NOT NULL)");
db.run("CREATE TABLE IF NOT EXISTS rent_yacht (yacht_id INTEGER PRIMARY KEY,yacht_price INTEGER NOT NULL CHECK (yacht_price > 0),yacht_name VARCHAR NOT NULL,yacht_owner INTEGER DEFAULT NULL,FOREIGN KEY (yacht_owner) REFERENCES users(id))");
db.run("CREATE TABLE IF NOT EXISTS news (news_id INTEGER PRIMARY KEY,news_name VARCHAR NOT NULL,news_descr VARCHAR NOT NULL,news_image VARCHAR NOT NULL)");

// Устанавливаем middleware для парсинга urlencoded и json
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Устанавливаем и настраиваем сессию
app.use(session({ secret: 'secret_key', resave: false, saveUninitialized: false }));
app.use(flash());

// Инициализируем passport и устанавливаем сессию для сохранения состояния пользователя
app.use(passport.initialize());
app.use(passport.session());

// Настраиваем стратегию passport-local для аутентификации
passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
    failureFlash: true // Включаем использование сообщений об ошибках
  },
  function(req, email, password, done) {
    db.get('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (err, row) => {
      if (err) {
        return done(err);
      }
      if (!row) {
        return done(null, false, { message: 'Invalid email or password' }); // Отправляем сообщение об ошибке
      }
      return done(null, row);
    });
  }
));

// Сериализация и десериализация пользователя
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
    if (!row) {
      done(new Error('User not found'));
    } else {
      done(null, row);
    }
  });
});

// Обработка POST-запроса на /login с использованием passport.authenticate и локальной стратегии
app.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login.html?error=unauthorized', failureFlash: true }),
  function(req, res) {
    const user_fullname = req.user.full_name;
    const user_lvl = req.user.club_lvl;
    const user_balance = req.user.user_balance;
    const user_data = req.user.end_date;

    // Получение названия яхты пользователя из базы данных
    db.get('SELECT yacht_name FROM rent_yacht WHERE yacht_owner = ?', [req.user.id], function(err, row) {
      const user_yacht = (row && row.yacht_name) ? row.yacht_name : 'Нет яхты'; // Если у пользователя есть яхта, то используем ее название, в противном случае выводим "Нет яхты"

      req.session.user = { id: req.user.id, username: user_fullname }; 
      res.redirect('/profile.html?fullname=' + user_fullname + '&level=' + user_lvl + '&balance=' + user_balance + '&yacht=' + user_yacht + '&date=' + user_data);
    });
  }
);

// Обслуживание статических файлов из папки public
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/register', (req, res) => {
  const full_name = req.body.full_name;
  const email = req.body.email;
  const password = req.body.password;

  db.get("SELECT * FROM users WHERE email = ? OR full_name = ?", [email, full_name], (err, row) => {
    if (row) {
      res.redirect('/reg.html?success=see_again');
    } else {
      db.run("INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)", [full_name, email, password], (err) => {
        if (err) {
          // Обработка ошибки при вставке
          res.redirect('/reg.html?success=server_erorr');
          // res.status(500).send("Ошибка сервера");
        } else {
          res.redirect('/login.html?success=true');
        }
      });
    }
  });
});

function requireLogin(req, res, next) {
  if (req.session.user) {
    next(); // Если сессия установлена, продолжаем выполнение следующего обработчика
  } else {
    res.redirect('/login.html'); // Если сессия не установлена, перенаправляем на страницу логина
  }
}

app.get('/profile', function(req, res) {
  // Обработка запроса профиля, req.session.user содержит информацию о пользователе
  if (req.session.user) {
    res.send('Добро пожаловать в ваш профиль!'); // Отправляем данные профиля
  } else {
    res.status(401).send('Unauthorized'); // Если пользователь не авторизован, отправляем статус 401
  }
});

app.post('/delete-profile', function(req, res) {
  if (req.session.user && req.session.user.id) {
    const userId = req.session.user.id; // Получаем идентификатор пользователя из сессии

    // Удаление пользователя из базы данных
    db.run('DELETE FROM users WHERE id = ?', [userId], function(err) {
      if (err) {
        console.error("Ошибка при удалении профиля:", err);
        res.status(500).send("Произошла ошибка при удалении профиля");
      } else {
        req.logout(function(err) { // Вызываем req.logout с функцией обратного вызова
          if (err) {
            console.error("Ошибка при завершении сеанса:", err);
            res.status(500).send("Произошла ошибка при завершении сеанса");
          } else {
            req.session.destroy(); // Уничтожаем сессию (выход пользователя)
            res.sendStatus(200);
          }
        });
      }
    });
  } else {
    res.status(401).send('Пользователь не авторизован');
  }
});

// Добавляем обработчик GET-запроса для завершения сеанса (сессии)
app.get('/logout', requireLogin, function(req, res) {
  req.logout(); // Завершаем сеанс (сессию)
  res.sendStatus(200); // Отправляем успешный статус код
});

app.get('/getShipsData', (req, res) => {
  // Выполняем запрос к базе данных для получения данных о яхтах
  db.all('SELECT * FROM rent_yacht', (err, rows) => {
    if (err) {
      console.error('Ошибка при выполнении запроса к базе данных:', err);
      res.status(500).json({ error: 'Ошибка при выполнении запроса к базе данных' });
    } else {
      // Отправляем данные о яхтах клиенту в формате JSON
      res.json({ ships: rows });
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});

var Gallery = {
  count: 2,
}

const fs = require('fs');
const dir = 'public/img/gallery/';

fs.readdir(dir, (err, files) => {
  Gallery.count = files.length;
});

app.get('/galleryCount', (req, res) => {
  res.json({ count: Gallery.count });
});