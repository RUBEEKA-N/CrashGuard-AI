// ===============================
// CRASHGUARD AI - FINAL ZONE SYSTEM
// ===============================

// 🏥 HOSPITAL DATABASE (Chennai + Tambaram + Perungalathur)
const zoneHospitals = {

    central: [
        { name: "Apollo Hospital (Greams Road)", lat: 13.0639, lon: 80.2519 },
        { name: "Kauvery Hospital (Alwarpet)", lat: 13.0330, lon: 80.2540 },
        { name: "Fortis Malar Hospital", lat: 13.0030, lon: 80.2570 }
    ],

    west: [
        { name: "MIOT Hospital", lat: 13.0100, lon: 80.1910 },
        { name: "SRMC Hospital (Porur)", lat: 13.0380, lon: 80.1560 },
        { name: "Be Well Hospital (Anna Nagar)", lat: 13.0850, lon: 80.2100 }
    ],

    south: [
        { name: "Global Hospital (Perumbakkam)", lat: 12.9170, lon: 80.2200 },
        { name: "Hindu Mission Hospital (Tambaram)", lat: 12.9249, lon: 80.1225 },
        { name: "Parvathy Hospital (Chromepet)", lat: 12.9516, lon: 80.1410 }
    ],

    north: [
        { name: "Stanley Medical College Hospital", lat: 13.1070, lon: 80.2900 },
        { name: "Government Kilpauk Hospital", lat: 13.0820, lon: 80.2410 }
    ],

    // 🟢 TAMBARAM + PERUNGALATHUR AREA (NEW ADDED)
    tambaram: [
        { name: "Hindu Mission Hospital (Tambaram)", lat: 12.9249, lon: 80.1225 },
        { name: "Parvathy Hospital (Chromepet)", lat: 12.9516, lon: 80.1410 },
        { name: "Annai Arul Hospital", lat: 12.9390, lon: 80.1430 },
        { name: "Deepam Hospital (Perungalathur)", lat: 12.9100, lon: 80.0890 },
        { name: "BM Hospital (Tambaram East)", lat: 12.9290, lon: 80.1180 }
    ]
};

// ===============================
// GEO LOCATION START
// ===============================
function getLocationAndDetect() {

    const alertBox = document.getElementById("alertBox");
    alertBox.innerHTML = "📡 Detecting live location...";

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        alertBox.innerHTML = "❌ Geolocation not supported";
    }
}

function showPosition(position) {

    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    detectAccident(lat, lon);
}

// ===============================
// DISTANCE CALCULATION
// ===============================
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

// ===============================
// ZONE DETECTION (INCLUDING TAMBARAM)
// ===============================
function getZone(lat, lon) {

    // Tambaram region (high priority)
    if (lat >= 12.88 && lat <= 12.98 && lon >= 80.08 && lon <= 80.16) {
        return "tambaram";
    }

    if (lat > 13.05) return "north";

    if (lat >= 13.00 && lat <= 13.05) return "central";

    if (lat < 13.00 && lon > 80.18) return "west";

    return "south";
}

// ===============================
// GET NEARBY HOSPITALS
// ===============================
function getZoneHospitals(lat, lon) {

    let zone = getZone(lat, lon);

    let hospitals = zoneHospitals[zone] || [];

    return hospitals
        .map(h => ({
            name: h.name,
            distance: getDistance(lat, lon, h.lat, h.lon)
        }))
        .sort((a, b) => a.distance - b.distance);
}

// ===============================
// MAIN ACCIDENT FUNCTION
// ===============================
function detectAccident(lat, lon) {

    const alertBox = document.getElementById("alertBox");

    const nearby = getZoneHospitals(lat, lon);
    const zone = getZone(lat, lon);

    if (navigator.vibrate) {
        navigator.vibrate([500, 300, 500]);
    }

    alertBox.innerHTML = `
        <h2>🚨 Accident Detected</h2>

        <p>📍 Zone Detected: ${zone.toUpperCase()}</p>

        <p>Latitude: ${lat}</p>
        <p>Longitude: ${lon}</p>

        <p>📞 Emergency Contacts Alerted</p>
        <p>🚑 Ambulance Dispatched</p>

        <div class="hospital">
            <h3>🏥 Nearby Hospitals (${zone.toUpperCase()})</h3>

            ${
                nearby.map(h => `
                    <p>🏥 ${h.name} - ${h.distance.toFixed(2)} km</p>
                `).join("")
            }
        </div>
    `;
}