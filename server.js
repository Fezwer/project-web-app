const express = require('express');
const app = express();

// Обслуживание статических файлов из папки public
app.use(express.static('public'));

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