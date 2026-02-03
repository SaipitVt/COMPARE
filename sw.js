// При каждом изменении в index.html меняйте номер версии ниже (v3, v4, v5...)
const CACHE_NAME = 'price-matrix-v3';

const ASSETS = [
  'index.html',
  'manifest.json',
  'icon-192.png',
  'icon-512.png'
];

// 1. Установка: сохраняем все файлы в память телефона
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('SW: Кэширование ресурсов');
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting(); // Принудительная активация новой версии
});

// 2. Активация: удаляем старые версии кэша, чтобы не занимать место
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('SW: Удаление старого кэша', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim(); // Сразу берем управление текущими вкладками
});

// 3. Работа офлайн: отдаем файлы из кэша
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Если файл есть в кэше — отдаем его, если нет — идем в интернет
      return cachedResponse || fetch(event.request);
    })
  );
});
