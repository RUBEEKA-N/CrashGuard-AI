// MAIN FUNCTION - START PROCESS
function getLocationAndDetect() {

    const alertBox = document.getElementById("alertBox");

    alertBox.innerHTML = "📡 Detecting live location...";

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        alertBox.innerHTML = "❌ Geolocation not supported";
    }
}

// GET GPS DATA
function showPosition(position) {

    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    detectAccident(lat, lon);
}

// MAIN ACCIDENT SYSTEM
function detectAccident(lat, lon) {

    const alertBox = document.getElementById("alertBox");

    // vibration (if mobile supported)
    if (navigator.vibrate) {
        navigator.vibrate([500, 300, 500]);
    }

    alertBox.innerHTML = `
        <h2>🚨 Accident Detected</h2>

        <p>📍 Live Location Captured</p>
        <p>Latitude: ${lat}</p>
        <p>Longitude: ${lon}</p>

        <p>📞 Emergency Contacts Alerted</p>
        <p>🚑 Ambulance Dispatch Initiated</p>

        <div class="hospital">
            <h3>🏥 Nearby Hospitals</h3>

            <p>🏥 Apollo Hospital - 2.1 km</p>
            <p>🏥 MIOT Hospital - 4.3 km</p>
            <p>🏥 Global Hospital - 5.0 km</p>
        </div>
    `;
}