// ===============================
// CRASHGUARD AI - FINAL VERSION
// ===============================

// Hospital dataset (simulation)
const hospitals = [
    { name: "Apollo Hospital", lat: 19.0765, lon: 72.8777 },
    { name: "MIOT Hospital", lat: 19.0850, lon: 72.8880 },
    { name: "Global Hospital", lat: 19.0600, lon: 72.8900 },
    { name: "Lilavati Hospital", lat: 19.0450, lon: 72.8250 }
];

// Start process
function getLocationAndDetect() {

    const alertBox = document.getElementById("alertBox");
    alertBox.innerHTML = "📡 Detecting live location...";

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        alertBox.innerHTML = "❌ Geolocation not supported";
    }
}

// Get GPS
function showPosition(position) {

    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    detectAccident(lat, lon);
}

// Distance calculation (Haversine formula)
function getDistance(lat1, lon1, lat2, lon2) {

    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

// Get nearby hospitals (sorted)
function getNearbyHospitals(userLat, userLon) {

    let result = hospitals.map(h => {
        return {
            name: h.name,
            distance: getDistance(userLat, userLon, h.lat, h.lon)
        };
    });

    result.sort((a, b) => a.distance - b.distance);

    return result;
}

// Main accident function
function detectAccident(lat, lon) {

    const alertBox = document.getElementById("alertBox");

    // mobile vibration
    if (navigator.vibrate) {
        navigator.vibrate([500, 300, 500]);
    }

    const nearby = getNearbyHospitals(lat, lon);

    alertBox.innerHTML = `
        <h2>🚨 Accident Detected</h2>

        <p>📍 Live Location Captured</p>
        <p>Latitude: ${lat}</p>
        <p>Longitude: ${lon}</p>

        <p>📞 Emergency Contacts Alerted</p>
        <p>🚑 Ambulance Dispatched</p>

        <div class="hospital">
            <h3>🏥 Nearby Hospitals</h3>

            ${nearby.map(h => `
                <p>🏥 ${h.name} - ${h.distance.toFixed(2)} km</p>
            `).join("")}
        </div>
    `;
}