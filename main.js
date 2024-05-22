const log = console.log;
const baseURL = "https://picsum.photos/v2/list";
const cacheName = "random_images";

function init() {
  log("DOM loaded.");

  document.getElementById("buttonDisplay").addEventListener("click", getImage);
}

function getImage() {
  fetchAndCacheImage(baseURL);
}

function displayImage(imageList) {
  const result = document.getElementById("result");
  const df = new DocumentFragment();
  imageList.forEach((item) => {
    const image = document.createElement("img");
    image.src = item;
    image.style.height = "300px";
    df.append(image);
  });

  result.innerHTML = "";
  result.append(df);
}

function fetchAndCacheImage(baseURL) {
  fetch(baseURL)
    .then((response) => {
      if (!response.ok) {
        throw new Error(message.statusText);
      }
      return response.json();
    })
    .then((data) => {
      log(data);
      const imageList = data.map((item) => {
        return item.download_url;
      });
      log(imageList);
      caches.open(cacheName).then((cache) => {
        cache.addAll(imageList);
      });
      displayImage(imageList);
    })
    .catch((err) => {
      log(err);
    });
}

window.addEventListener("DOMContentLoaded", init);
