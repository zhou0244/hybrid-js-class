const log = console.log;
const baseURL = "https://picsum.photos/v2/list";
const cacheName = "random_images";

function init() {
  log("DOM loaded.");

  document.getElementById("buttonDisplay").addEventListener("click", getImage);
}

async function getImage() {
  caches.open(cacheName).then((cache) => {
    cache.matchAll().then((matchResults) => {
      if (matchResults.length == 0) {
        log("Cache is empty.");
        log("Start fetching:");
        fetchAndCacheImage();
      }
      log(matchResults, typeof matchResults);
      const imageURLs = matchResults.map((result) => {
        return result.url;
      });
      log(imageURLs);
      displayImage(imageURLs);
      log("Display images from cache.");
    });
  });
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

function fetchAndCacheImage() {
  fetch(baseURL)
    .then((response) => {
      if (!response.ok) {
        throw new Error(message.statusText);
      }
      return response.json();
    })
    .then((data) => {
      log("Fetch success:", data);
      const imageList = data.map((item) => {
        return item.download_url;
      });
      log(imageList);
      caches.open(cacheName).then((cache) => {
        cache.addAll(imageList);
        log("Data saved to cache.");
        displayImage(imageList);
        log("Display images from fetch.");
      });
    })
    .catch((err) => {
      log(err);
    });
}

// i don't know how to handle expiration of the cache

window.addEventListener("DOMContentLoaded", init);
