const CACHE_NAME = "pwa-cache-v2"; // Change cache version to force update
const OFFLINE_PAGE = "/offline.html";

const urlsToCache = [
  "/",
  "/index.html",
  OFFLINE_PAGE, // Ensure this is cached
  "/sensor.html",
  "/signup.html",
  "/vitals.html",
  "/vitalsmeasurement.html",
  "/pathology.html",
  "/height.html",
  "/bp.html",
  "/spo2.html",
  "/bloodhemoglobin.html",
  "/drybiochemical.html",
  "/renal.html",
  "/lipid.html",
  "/multifunction.html",
  "/reports.html",
  "/css/style.css",
  "/css/all.min.css",
  "/css/bootstrap.min.css",
  "/css/bootstrap.min.css.map",
  "/js/function.js",
  "/js/bootstrap.bundle.min.js",
  "/js/bootstrap.bundle.min.js.map",
  "/js/bootstrap.min.js",
  "/js/jquery-3.7.1.min.js",
  "/js/jquery.js",
  "/js/script.js",
  "/service-worker.js",
  "/js/sweetalert.js",
  "/img/bg.png",
  "/img/bg1.png",
  "/img/Blood sugar2.gif",
  "/img/blood-pressure.png",
  "/img/bmi.png",
  "/img/bmianimation.gif",
  "/img/body-fat.png",
  "/img/bpmachine.gif",
  "/img/cardiogram.png",
  "/img/footerlogo.png",
  "/img/height.png",
  "/img/home.png",
  "/img/human-body.png",
  "/img/icons8-a1c-test-100.png",
  "/img/icons8-albumen-48.png",
  "/img/icons8-albumen-64.png",
  "/img/icons8-albumen-64(2).png",
  "/img/icons8-analysis-48.png",
  "/img/icons8-blood-50.png",
  "/img/icons8-chemical-test-96.png",
  "/img/icons8-diabetes-48.png",
  "/img/icons8-erlenmeyer-test-flask-24.png",
  "/img/icons8-erlenmeyer-test-flask-100.png",
  "/img/icons8-financial-growth-analysis-80.png",
  "/img/icons8-glucometer-50.png",
  "/img/icons8-glucometer-64.png",
  "/img/icons8-kidney-100.png",
  "/img/icons8-kidneys-50.png",
  "/img/icons8-kidneys-50(1).png",
  "/img/icons8-multifunction-printer-50.png",
  "/img/icons8-multifunction-printer-100.png",
  "/img/icons8-next-page-80.png",
  "/img/icons8-pathology-64.png",
  "/img/icons8-wbc-64.png",
  "/img/icons8-wbc-64(1).png",
  "/img/icons8-wifi-50.png",
  "/img/logo.png",
  "/img/print.png",
  "/img/pulse-oximeter.png",
  "/img/reports.png",
  "/img/signout.png",
  "/img/spo2.gif",
  "/img/step.gif",
  "/img/Value-bathroom-scale.png",
  "/img/Value-blood-pressure.png",
  "/img/Value-bmi.png",
  "/img/Value-heart-rate-monitor.png",
  "/img/Value-height.png",
  "/img/Value-pulse.png",
  "/img/VitalLoader.gif",
  "/img/weight.png"
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
