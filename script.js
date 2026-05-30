// ===============================
// CRASHGUARD AI - FINAL CLEAN VERSION
// Zone-based Hospital Emergency System
// ===============================

// 🏥 ZONE HOSPITAL DATABASE (CORRECTED)

const zoneHospitals = {

    central: [
        { name: "Apollo Hospital Greams Lane", lat: 13.0550, lon: 80.2500 },
        { name: "Rajiv Gandhi Government General Hospital", lat: 13.0800, lon: 80.2750 },
        { name: "Tamil Nadu Govt Multi Super Specialty Hospital (Omandurar)", lat: 13.0750, lon: 80.2700 }
    ],

    north: [
        { name: "Stanley Medical College Hospital", lat: 13.1070, lon: 80.2900 },
        { name: "Government Kilpauk Hospital", lat: 13.0820, lon: 80.2410 },
        { name: "Chennai National Hospital (Parrys)", lat: 13.0900, lon: 80.2900 },
        { name: "Dr. Mehta’s Hospital (Poonamallee High Road)", lat: 13.0780, lon: 80.2300 }
    ],

    west: [
        { name: "SIMS Hospital (Vadapalani)", lat: 13.0500, lon: 80.2120 },
        { name: "SRMC (Sri Ramachandra Medical Centre)", lat: 13.0400, lon: 80.1750 },
        { name: "MGM Healthcare (Nelson Manickam Road)", lat: 13.0600, lon: 80.2400 }
    ],

    south: [
        { name: "Venkateswara Hospital (Nandambakkam)", lat: 13.0100, lon: 80.2000 },
        { name: "Kalaignar Centenary Super Specialty Hospital (Guindy)", lat: 13.0100, lon: 80.2200 },
        { name: "Malar Hospital (Adyar)", lat: 13.0060, lon: 80.2570 }
        { name: "Avinash Hospital (Kovilambakkam)", lat: 12.9290, lon: 80.2070 }
    ],

    tambaram: [
        { name: "Hindu Mission Hospital (Tambaram)", lat: 12.9249, lon: 80.1225 },
        { name: "Parvathy Hospital (Chromepet)", lat: 12.9516, lon: 80.1410 },
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
// ZONE DETECTION (FIXED LOGIC)
// ===============================

function getZone(lat, lon) {

    // Tambaram first (important priority)
    if (lat >= 12.88 && lat <= 12.98 && lon >= 80.08 && lon <= 80.16) {
        return "tambaram";
    }

    // North Chennai
    if (lat > 13.06) return "north";

    // Central Chennai
    if (lat >= 13.03 && lat <= 13.08) return "central";

    // West Chennai
    if (lon < 80.22 && lat >= 13.00) return "west";

    // Default South Chennai
    return "south";
}

// ===============================
// GET NEARBY HOSPITALS
// ===============================

function getZoneHospitalsList(lat, lon) {

    const zone = getZone(lat, lon);

    const hospitals = zoneHospitals[zone] || [];

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

    const zone = getZone(lat, lon);
    const nearby = getZoneHospitalsList(lat, lon);

    if (navigator.vibrate) {
        navigator.vibrate([500, 300, 500]);
    }

    alertBox.innerHTML = `
        <h2>🚨 Accident Detected</h2>

        <p>📍 Zone Detected: <b>${zone.toUpperCase()}</b></p>

        <p>Latitude: ${lat}</p>
        <p>Longitude: ${lon}</p>

        <p>🚑 Ambulance Dispatched</p>
        <p>📞 Emergency Contacts Alerted</p>

        <div class="hospital">
            <h3>🏥 Nearby Hospitals</h3>

            ${
                nearby.map(h => `
                    <p>🏥 ${h.name} - ${h.distance.toFixed(2)} km</p>
                `).join("")
            }
        </div>
    `;
}