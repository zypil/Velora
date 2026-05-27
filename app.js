/* ============================================
   VELORA — Velocity & Motion Tracker
   JavaScript Core
   ============================================ */

// =====================
// INTRO
// =====================
function enterApp() {
    const intro = document.getElementById('intro-screen');
    intro.classList.add('intro-exit');
    setTimeout(() => {
        intro.style.display = 'none';
        document.getElementById('app').style.display = 'block';
        initApp();
    }, 800);
}

// =====================
// APP STATE
// =====================
let currentMode = 'vehicle';
let gpsActive = false;
let watchId = null;

// Vehicle state
let vehicleRunning = false;
let vehicleStartTime = null;
let vehicleTimer = null;
let vehicleMaxSpeed = 0;
let vehicleTotalDist = 0;
let vehicleLastPos = null;
let vehicleSpeedHistory = [];

// Jogging state
let jogRunning = false;
let jogStartTime = null;
let jogTimer = null;
let jogTotalDist = 0;
let jogLastPos = null;
let jogPaceHistory = [];
let jogCalories = 0;

// =====================
// INIT
// =====================
function initApp() {
    requestGPS();
    renderVehicleTicks();
    initPaceChart();
}

function requestGPS() {
    const gpsStatus = document.getElementById('gps-status');
    const gpsText = document.getElementById('gps-text');

    if (!navigator.geolocation) {
        gpsText.textContent = 'GPS Unavailable';
        return;
    }

    navigator.geolocation.getCurrentPosition(
        () => {
            gpsActive = true;
            gpsStatus.classList.add('active');
            gpsText.textContent = 'GPS Ready';
        },
        () => {
            gpsText.textContent = 'GPS Denied';
        },
        { enableHighAccuracy: true, timeout: 10000 }
    );
}

// =====================
// MODE SWITCHING
// =====================
function switchMode(mode) {
    if (mode === currentMode) return;
    currentMode = mode;

    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === mode);
    });

    document.querySelector('.mode-indicator').classList.toggle('jogging', mode === 'jogging');

    const vehiclePanel = document.getElementById('vehicle-panel');
    const joggingPanel = document.getElementById('jogging-panel');

    if (mode === 'vehicle') {
        joggingPanel.classList.add('hidden');
        setTimeout(() => {
            vehiclePanel.classList.remove('hidden');
        }, 50);
    } else {
        vehiclePanel.classList.add('hidden');
        setTimeout(() => {
            joggingPanel.classList.remove('hidden');
        }, 50);
    }
}

// =====================
// VEHICLE SPEEDOMETER
// =====================
function renderVehicleTicks() {
    const ticksGroup = document.getElementById('vehicle-ticks');
    const labelsGroup = document.getElementById('vehicle-labels');
    const cx = 150, cy = 150, r = 120;
    const startAngle = 210, endAngle = 510; // 300 degree arc
    const maxSpeed = 200;

    for (let i = 0; i <= 20; i++) {
        const angle = startAngle + (endAngle - startAngle) * (i / 20);
        const rad = (angle * Math.PI) / 180;
        const isMajor = i % 5 === 0;
        const innerR = isMajor ? r - 18 : r - 10;
        const outerR = r - 4;

        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', cx + innerR * Math.cos(rad));
        line.setAttribute('y1', cy + innerR * Math.sin(rad));
        line.setAttribute('x2', cx + outerR * Math.cos(rad));
        line.setAttribute('y2', cy + outerR * Math.sin(rad));
        line.setAttribute('stroke', isMajor ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.15)');
        line.setAttribute('stroke-width', isMajor ? '2.5' : '1');
        line.setAttribute('stroke-linecap', 'round');
        line.classList.add('tick-mark');
        ticksGroup.appendChild(line);

        if (isMajor) {
            const labelR = r - 32;
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', cx + labelR * Math.cos(rad));
            text.setAttribute('y', cy + labelR * Math.sin(rad) + 4);
            text.setAttribute('class', 'tick-label');
            text.textContent = (i * 10).toString();
            labelsGroup.appendChild(text);
        }
    }
}

function updateVehicleArc(speed) {
    const maxSpeed = 200;
    const clamped = Math.min(speed, maxSpeed);
    const percentage = clamped / maxSpeed;
    const startAngle = 210;
    const sweep = 300 * percentage;
    const endAngle = startAngle + sweep;

    const cx = 150, cy = 150, r = 120;
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const largeArc = sweep > 180 ? 1 : 0;
    const x1 = cx + r * Math.cos(startRad);
    const y1 = cy + r * Math.sin(startRad);
    const x2 = cx + r * Math.cos(endRad);
    const y2 = cy + r * Math.sin(endRad);

    const d = `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;
    document.getElementById('vehicle-arc').setAttribute('d', d);
}

function toggleVehicle() {
    const btn = document.getElementById('vehicle-start');
    if (vehicleRunning) {
        stopVehicle();
        btn.classList.remove('running');
        btn.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20"><path d="M8 5v14l11-7z" fill="currentColor"/></svg><span>Start Tracking</span>`;
    } else {
        startVehicle();
        btn.classList.add('running');
        btn.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" fill="currentColor"/></svg><span>Stop Tracking</span>`;
    }
}

function startVehicle() {
    vehicleRunning = true;
    vehicleStartTime = Date.now();
    vehicleTotalDist = 0;
    vehicleMaxSpeed = 0;
    vehicleLastPos = null;
    vehicleSpeedHistory = [];

    vehicleTimer = setInterval(() => {
        const elapsed = Math.floor((Date.now() - vehicleStartTime) / 1000);
        const mins = Math.floor(elapsed / 60).toString().padStart(2, '0');
        const secs = (elapsed % 60).toString().padStart(2, '0');
        document.getElementById('vehicle-time').textContent = `${mins}:${secs}`;

        if (elapsed > 0) {
            const avg = (vehicleTotalDist / (elapsed / 3600));
            document.getElementById('vehicle-avg').textContent = avg.toFixed(0);
        }
    }, 1000);

    if (navigator.geolocation) {
        watchId = navigator.geolocation.watchPosition(
            handleVehiclePosition,
            () => {},
            { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
        );
    }
}

function stopVehicle() {
    vehicleRunning = false;
    clearInterval(vehicleTimer);
    if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
    }
}

function resetVehicle() {
    stopVehicle();
    vehicleTotalDist = 0;
    vehicleMaxSpeed = 0;
    vehicleLastPos = null;
    document.getElementById('vehicle-speed').textContent = '0';
    document.getElementById('vehicle-max').textContent = '0';
    document.getElementById('vehicle-dist').textContent = '0.00';
    document.getElementById('vehicle-time').textContent = '00:00';
    document.getElementById('vehicle-avg').textContent = '0';
    updateVehicleArc(0);

    const btn = document.getElementById('vehicle-start');
    btn.classList.remove('running');
    btn.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20"><path d="M8 5v14l11-7z" fill="currentColor"/></svg><span>Start Tracking</span>`;
}

function handleVehiclePosition(position) {
    const speed = position.coords.speed;
    const speedKmh = speed !== null && speed !== undefined ? speed * 3.6 : 0;
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;

    // Update speed display
    const displaySpeed = Math.round(speedKmh);
    document.getElementById('vehicle-speed').textContent = displaySpeed;
    updateVehicleArc(displaySpeed);

    // Update max speed
    if (speedKmh > vehicleMaxSpeed) {
        vehicleMaxSpeed = speedKmh;
        document.getElementById('vehicle-max').textContent = Math.round(vehicleMaxSpeed);
    }

    // Calculate distance
    if (vehicleLastPos) {
        const dist = haversine(vehicleLastPos.lat, vehicleLastPos.lng, lat, lng);
        vehicleTotalDist += dist;
        document.getElementById('vehicle-dist').textContent = vehicleTotalDist.toFixed(2);
    }
    vehicleLastPos = { lat, lng };
}

// =====================
// JOGGING TRACKER
// =====================
function toggleJogging() {
    const btn = document.getElementById('jog-start');
    if (jogRunning) {
        stopJogging();
        btn.classList.remove('running');
        btn.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20"><path d="M8 5v14l11-7z" fill="currentColor"/></svg><span>Start Run</span>`;
    } else {
        startJogging();
        btn.classList.add('running');
        btn.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" fill="currentColor"/></svg><span>Stop Run</span>`;
    }
}

function startJogging() {
    jogRunning = true;
    jogStartTime = Date.now();
    jogTotalDist = 0;
    jogLastPos = null;
    jogPaceHistory = [];
    jogCalories = 0;

    jogTimer = setInterval(() => {
        const elapsed = Math.floor((Date.now() - jogStartTime) / 1000);
        const hrs = Math.floor(elapsed / 3600).toString().padStart(2, '0');
        const mins = Math.floor((elapsed % 3600) / 60).toString().padStart(2, '0');
        const secs = (elapsed % 60).toString().padStart(2, '0');
        document.getElementById('jog-time').textContent = `${hrs}:${mins}:${secs}`;

        // Update pace
        if (jogTotalDist > 0.01) {
            const paceSeconds = elapsed / jogTotalDist;
            const paceMin = Math.floor(paceSeconds / 60);
            const paceSec = Math.floor(paceSeconds % 60);
            document.getElementById('jog-pace').textContent =
                `${paceMin.toString().padStart(2,'0')}:${paceSec.toString().padStart(2,'0')}`;
        }

        // Update calories (approx ~60 cal per km for average runner)
        jogCalories = Math.round(jogTotalDist * 60);
        document.getElementById('jog-cal').textContent = jogCalories;

        // Update progress ring (goal: 5km)
        const progress = Math.min(jogTotalDist / 5, 1);
        const circumference = 2 * Math.PI * 120;
        const offset = circumference - (progress * circumference);
        document.getElementById('jog-progress').style.strokeDashoffset = offset;

        drawPaceChart();
    }, 1000);

    if (navigator.geolocation) {
        watchId = navigator.geolocation.watchPosition(
            handleJogPosition,
            () => {},
            { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
        );
    }
}

function stopJogging() {
    jogRunning = false;
    clearInterval(jogTimer);
    if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
    }
}

function resetJogging() {
    stopJogging();
    jogTotalDist = 0;
    jogLastPos = null;
    jogPaceHistory = [];
    jogCalories = 0;
    document.getElementById('jog-dist').textContent = '0.00';
    document.getElementById('jog-time').textContent = '00:00:00';
    document.getElementById('jog-pace').textContent = '--:--';
    document.getElementById('jog-cal').textContent = '0';
    document.getElementById('jog-progress').style.strokeDashoffset = 754;
    clearPaceChart();

    const btn = document.getElementById('jog-start');
    btn.classList.remove('running');
    btn.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20"><path d="M8 5v14l11-7z" fill="currentColor"/></svg><span>Start Run</span>`;
}

function handleJogPosition(position) {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;

    if (jogLastPos) {
        const dist = haversine(jogLastPos.lat, jogLastPos.lng, lat, lng);
        // Filter out GPS noise (less than 2m is likely noise)
        if (dist > 0.002) {
            jogTotalDist += dist;
            document.getElementById('jog-dist').textContent = jogTotalDist.toFixed(2);

            // Record pace point
            const elapsed = (Date.now() - jogStartTime) / 1000;
            if (elapsed > 0) {
                const pace = (elapsed / 60) / jogTotalDist; // min/km
                jogPaceHistory.push(pace);
                if (jogPaceHistory.length > 30) jogPaceHistory.shift();
            }
        }
    }
    jogLastPos = { lat, lng };
}

// =====================
// PACE CHART
// =====================
let paceCanvas, paceCtx;

function initPaceChart() {
    paceCanvas = document.getElementById('paceCanvas');
    if (paceCanvas) {
        paceCtx = paceCanvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        const rect = paceCanvas.getBoundingClientRect();
        paceCanvas.width = rect.width * dpr;
        paceCanvas.height = rect.height * dpr;
        paceCtx.scale(dpr, dpr);
    }
}

function drawPaceChart() {
    if (!paceCtx || jogPaceHistory.length < 2) return;

    const w = paceCanvas.width / (window.devicePixelRatio || 1);
    const h = paceCanvas.height / (window.devicePixelRatio || 1);
    paceCtx.clearRect(0, 0, w, h);

    // Grid lines
    paceCtx.strokeStyle = 'rgba(255,255,255,0.05)';
    paceCtx.lineWidth = 1;
    for (let i = 1; i < 5; i++) {
        const y = (h / 5) * i;
        paceCtx.beginPath();
        paceCtx.moveTo(0, y);
        paceCtx.lineTo(w, y);
        paceCtx.stroke();
    }

    // Draw line
    const maxPace = Math.max(...jogPaceHistory, 10);
    const minPace = Math.min(...jogPaceHistory, 0);
    const range = maxPace - minPace || 1;

    paceCtx.beginPath();
    paceCtx.strokeStyle = '#f15bb5';
    paceCtx.lineWidth = 2;
    paceCtx.lineCap = 'round';
    paceCtx.lineJoin = 'round';

    jogPaceHistory.forEach((pace, i) => {
        const x = (i / (jogPaceHistory.length - 1)) * w;
        const y = h - ((pace - minPace) / range) * (h - 10) - 5;
        if (i === 0) paceCtx.moveTo(x, y);
        else paceCtx.lineTo(x, y);
    });
    paceCtx.stroke();

    // Gradient fill
    paceCtx.lineTo(w, h);
    paceCtx.lineTo(0, h);
    paceCtx.closePath();
    const grad = paceCtx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, 'rgba(241,91,181,0.3)');
    grad.addColorStop(1, 'rgba(241,91,181,0)');
    paceCtx.fillStyle = grad;
    paceCtx.fill();

    // Dots
    jogPaceHistory.forEach((pace, i) => {
        const x = (i / (jogPaceHistory.length - 1)) * w;
        const y = h - ((pace - minPace) / range) * (h - 10) - 5;
        paceCtx.beginPath();
        paceCtx.arc(x, y, 3, 0, Math.PI * 2);
        paceCtx.fillStyle = '#f15bb5';
        paceCtx.fill();
    });
}

function clearPaceChart() {
    if (!paceCtx) return;
    const w = paceCanvas.width / (window.devicePixelRatio || 1);
    const h = paceCanvas.height / (window.devicePixelRatio || 1);
    paceCtx.clearRect(0, 0, w, h);
}

// =====================
// UTILITIES
// =====================
function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// Handle resize for canvas
window.addEventListener('resize', () => {
    initPaceChart();
    if (jogPaceHistory.length > 0) drawPaceChart();
});
