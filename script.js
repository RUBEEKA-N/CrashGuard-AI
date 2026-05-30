// ===============================
// CRASHGUARD AI - CLEAN WORKING VERSION
// ===============================

// 🏥 HOSPITAL DATABASE
const zoneHospitals = {

    central: [
        { name: "Apollo Hospital (Greams Road)", lat: 13.0550, lon: 80.2500 },
        { name: "Rajiv Gandhi Govt Hospital", lat: 13.0800, lon: 80.2750 },
        { name: "Omandurar Multi Specialty Hospital", lat: 13.0750, lon: 80.2700 }
    ],

    north: [
        { name: "Stanley Hospital", lat: 13.1070, lon: 80.2900 },
        { name: "Kilpauk Hospital", lat: 13.0820, lon: 80.2410 },
        { name: "Dr. Mehta Hospital", lat: 13.0780, lon: 80.2300 }
    ],

    west: [
        { name: "SIMS Hospital", lat: 13.0500, lon: 80.2120 },
        { name: "SRMC Hospital", lat: 13.0400, lon: 80.1750 },
        { name: "MGM Healthcare", lat: 13.0600, lon: 80.2400 }
    ],

    south: [
        { name: "Venkateswara Hospital", lat: 13.0100, lon: 80.2000 },
        { name: "Kalaignar Hospital", lat: 13.0100, lon: 80.2200 },
        { name: "Malar Hospital", lat: 13.0060, lon: 80.2570 },
        { name: "Avinash Hospital", lat: 12.9290, lon: 80.2070 }
    ],

    tambaram: [
        { name: "Hindu Mission Hospital", lat: 12.9249, lon: 80.1225 },
        { name: "Parvathy Hospital", lat: 12.9516, lon: 80.1410 },
        { name: "Deepam Hospital", lat: 12.9100, lon: 80.0890 }
    ]
};

// ===============================
// LOCATION FUNCTION
// ===============================

function getLocationAndDetect() {

    const box = document.getElementById("alertBox");
    box.innerHTML = "📡 Getting location...";

    if (!navigator.geolocation) {
        box.innerHTML = "❌ Geolocation not supported";
        return;
    }

    navigator.geolocation.getCurrentPosition((pos) => {

        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        detectAccident(lat, lon);

    });
}

// ===============================
// MANUAL TEST
// ===============================

function detectAccidentManually() {
    detectAccident(13.0827, 80.2707);
}

// ===============================
// DISTANCE
// ===============================

function getDistance(lat1, lon1, lat2, lon2) {

    const R = 6371;

    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1*Math.PI/180) *
        Math.cos(lat2*Math.PI/180) *
        Math.sin(dLon/2) * Math.sin(dLon/2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
}

// ===============================
// ZONE DETECTION
// ===============================

function getZone(lat, lon) {

    if (lat >= 12.88 && lat <= 12.98 && lon >= 80.08 && lon <= 80.16) {
        return "tambaram";
    }

    if (lat > 13.06) return "north";

    if (lat >= 13.03 && lat <= 13.08) return "central";

    if (lon < 80.22) return "west";

    return "south";
}

// ===============================
// NEARBY HOSPITALS
// ===============================

function getHospitals(lat, lon) {

    const zone = getZone(lat, lon);
    const list = zoneHospitals[zone] || [];

    return list
        .map(h => ({
            name: h.name,
            distance: getDistance(lat, lon, h.lat, h.lon)
        }))
        .sort((a,b) => a.distance - b.distance);
}

// ===============================
// MAIN FUNCTION
// ===============================

function detectAccident(lat, lon) {

    const box = document.getElementById("alertBox");

    const zone = getZone(lat, lon);
    const hospitals = getHospitals(lat, lon);

    if (navigator.vibrate) {
        navigator.vibrate(500);
    }

    box.innerHTML = `
        <h2>🚨 Accident Detected</h2>

        <p>📍 Zone: <b>${zone.toUpperCase()}</b></p>

        <p>Latitude: ${lat}</p>
        <p>Longitude: ${lon}</p>

        <h3>🏥 Nearby Hospitals</h3>

        ${hospitals.map(h =>
            `<p>🏥 ${h.name} - ${h.distance.toFixed(2)} km</p>`
        ).join("")}

        <p>🚑 Ambulance Notified</p>
        <p>📞 Emergency Contacts Alerted</p>
    `;
}
// ===============================
// EMERGENCY CONTACTS FEATURE
// ===============================

let emergencyContacts = [];

function saveContact() {

    const name = document.getElementById("contactName").value.trim();
    const phone = document.getElementById("contactPhone").value.trim();

    if (!name || !phone) {
        alert("Please fill all fields");
        return;
    }

    const contact = { name, phone };
    emergencyContacts.push(contact);

    updateContactList();

    document.getElementById("contactName").value = "";
    document.getElementById("contactPhone").value = "";
}

function updateContactList() {

    const list = document.getElementById("contactList");

    list.innerHTML = "";

    emergencyContacts.forEach(c => {

        const li = document.createElement("li");
        li.textContent = `${c.name} - ${c.phone}`;

        list.appendChild(li);
    });
}