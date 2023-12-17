const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

const db = new sqlite3.Database('users.sqlite', (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connected to the database.');
    db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, full_name TEXT, email TEXT, password TEXT)");
  }
});

app.get('/galleryCount', (req, res) => {
  const dir = 'public/img/gallery/';
  fs.readdir(dir, (err, files) => {
    if (err) {
      res.status(500).send('Ошибка при чтении директории gallery');
    } else {
      res.json({ count: files.length });
    }
  });
});

app.post('/register', (req, res) => {
  const { full_name, email, password } = req.body;

  db.run('INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)', [full_name, email, password], function(err) {
    if (err) {
      res.status(500).send('Ошибка сохранения пользователя');
    } else {
      res.send('Пользователь сохранен');
    }
  });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});