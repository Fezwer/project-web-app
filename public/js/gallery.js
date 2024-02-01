function ImgEnter() {
  var GalleryCount = 2;
  var main = document.querySelector('main');
  var imgContainer = document.createElement("div"); // создаем общий контейнер для span

  fetch('/galleryCount')
    .then(response => response.json())
    .then(data => {
      GalleryCount = data.count;
      console.log(GalleryCount);

      for (let i = 1; i <= GalleryCount; i++) {
        var imgId = 'img' + i;
        if (!document.getElementById(imgId)) {
          var img = document.createElement("img");
          img.src = 'img/gallery/gal' + i + '.jpg';
          img.id = imgId;
          img.onclick = function () { openOverlay(this.src) }; // добавляем onclick

          var imgWrapper = document.createElement("span");
          imgWrapper.appendChild(img);
          imgContainer.appendChild(imgWrapper); // добавляем span в общий контейнер
        }
      }
      main.appendChild(imgContainer); // добавляем общий контейнер в main
    });
}

document.addEventListener("DOMContentLoaded", function() {
  ImgEnter();
});
