const CACHE_NAME = "pwa-cache-v2"; // Change cache version to force update
const OFFLINE_PAGE = "/kioskmedtech/offline.html";

const urlsToCache = [
  "/kioskmedtech/",
  "/kioskmedtech/index.html",
  OFFLINE_PAGE, // Ensure this is cached
  "/kioskmedtech/sensor.html",
  "/kioskmedtech/signup.html",
  "/kioskmedtech/vitals.html",
  "/kioskmedtech/vitalsmeasurement.html",
  "/kioskmedtech/pathology.html",
  "/kioskmedtech/height.html",
  "/kioskmedtech/bp.html",
  "/kioskmedtech/spo2.html",
  "/kioskmedtech/bloodhemoglobin.html",
  "/kioskmedtech/drybiochemical.html",
  "/kioskmedtech/renal.html",
  "/kioskmedtech/lipid.html",
  "/kioskmedtech/multifunction.html",
  "/kioskmedtech/reports.html",
  "/kioskmedtech/css/style.css",
  "/kioskmedtech/css/all.min.css",
  "/kioskmedtech/css/bootstrap.min.css",
  "/kioskmedtech/css/bootstrap.min.css.map",
  "/kioskmedtech/js/function.js",
  "/kioskmedtech/js/bootstrap.bundle.min.js",
  "/kioskmedtech/js/bootstrap.bundle.min.js.map",
  "/kioskmedtech/js/bootstrap.min.js",
  "/kioskmedtech/js/jquery-3.7.1.min.js",
  "/kioskmedtech/js/jquery.js",
  "/kioskmedtech/js/script.js",
  "/kioskmedtech/service-worker.js",
  "/kioskmedtech/js/sweetalert.js",
  "/kioskmedtech/img/bg.png",
  "/kioskmedtech/img/bg1.png",
  "/kioskmedtech/img/Blood sugar2.gif",
  "/kioskmedtech/img/blood-pressure.png",
  "/kioskmedtech/img/bmi.png",
  "/kioskmedtech/img/bmianimation.gif",
  "/kioskmedtech/img/body-fat.png",
  "/kioskmedtech/img/bpmachine.gif",
  "/kioskmedtech/img/cardiogram.png",
  "/kioskmedtech/img/footerlogo.png",
  "/kioskmedtech/img/height.png",
  "/kioskmedtech/img/home.png",
  "/kioskmedtech/img/human-body.png",
  "/kioskmedtech/img/icons8-a1c-test-100.png",
  "/kioskmedtech/img/icons8-albumen-48.png",
  "/kioskmedtech/img/icons8-albumen-64.png",
  "/kioskmedtech/img/icons8-albumen-64(2).png",
  "/kioskmedtech/img/icons8-analysis-48.png",
  "/kioskmedtech/img/icons8-blood-50.png",
  "/kioskmedtech/img/icons8-chemical-test-96.png",
  "/kioskmedtech/img/icons8-diabetes-48.png",
  "/kioskmedtech/img/icons8-erlenmeyer-test-flask-24.png",
  "/kioskmedtech/img/icons8-erlenmeyer-test-flask-100.png",
  "/kioskmedtech/img/icons8-financial-growth-analysis-80.png",
  "/kioskmedtech/img/icons8-glucometer-50.png",
  "/kioskmedtech/img/icons8-glucometer-64.png",
  "/kioskmedtech/img/icons8-kidney-100.png",
  "/kioskmedtech/img/icons8-kidneys-50.png",
  "/kioskmedtech/img/icons8-kidneys-50(1).png",
  "/kioskmedtech/img/icons8-multifunction-printer-50.png",
  "/kioskmedtech/img/icons8-multifunction-printer-100.png",
  "/kioskmedtech/img/icons8-next-page-80.png",
  "/kioskmedtech/img/icons8-pathology-64.png",
  "/kioskmedtech/img/icons8-wbc-64.png",
  "/kioskmedtech/img/icons8-wbc-64(1).png",
  "/kioskmedtech/img/icons8-wifi-50.png",
  "/kioskmedtech/img/logo.png",
  "/kioskmedtech/img/print.png",
  "/kioskmedtech/img/pulse-oximeter.png",
  "/kioskmedtech/img/reports.png",
  "/kioskmedtech/img/signout.png",
  "/kioskmedtech/img/spo2.gif",
  "/kioskmedtech/img/step.gif",
  "/kioskmedtech/img/Value-bathroom-scale.png",
  "/kioskmedtech/img/Value-blood-pressure.png",
  "/kioskmedtech/img/Value-bmi.png",
  "/kioskmedtech/img/Value-heart-rate-monitor.png",
  "/kioskmedtech/img/Value-height.png",
  "/kioskmedtech/img/Value-pulse.png",
  "/kioskmedtech/img/VitalLoader.gif",
  "/kioskmedtech/img/weight.png"
];

// Install Service Worker & Cache Assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      for (const url of urlsToCache) {
        try {
          const response = await fetch(url, { cache: "no-store" });
          if (!response.ok) throw new Error(`Failed to fetch ${url}`);
          await cache.put(url, response);
        } catch (err) {
          console.warn(`Service Worker: Skipping ${url} - ${err.message}`);
        }
      }
    })
  );
  self.skipWaiting();
});

// Fetch from Cache First, Then Network, Show Offline Page If No Cache and Offline
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then(async (response) => {
      if (response) return response;

      return fetch(event.request)
        .catch(async () => {
          // If offline and fetch fails, check cache
          if (!navigator.onLine) {
            const cache = await caches.open(CACHE_NAME);
            const cachedFiles = await cache.keys();
            if (cachedFiles.length === 0) {
              return caches.match(OFFLINE_PAGE);
            }
          }

          return new Response("Network request failed, but cache exists", {
            status: 503,
            statusText: "Service Unavailable",
          });
        });
    })
  );
});

// Activate New Service Worker & Remove Old Caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((cache) => cache !== CACHE_NAME).map((cache) => caches.delete(cache))
      );
    }).then(() => self.clients.claim())
  );
});
