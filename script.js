const appState = {
    points: 850,
    lives: 3,
    route: "dashboard",
    selectedAnswer: null,
    answered: false,
    selectedComponent: "Sensor",
    selectedTech: "Wi-Fi"
};

const materials = {
    material1: {
        level: 1,
        title: "Mengenal Wireless Sensor Network",
        kicker: "LEVEL 1 — MENGENAL WSN",
        progress: 20,
        intro: "Wireless Sensor Network (WSN) adalah jaringan yang terdiri dari sejumlah sensor node yang saling berkomunikasi secara nirkabel untuk mengumpulkan, mengirimkan, dan mengolah data dari lingkungan.",
        type: "wsn"
    },
    material2: {
        level: 2,
        title: "Mengenal Sensor Node",
        kicker: "LEVEL 2 — SENSOR NODE",
        progress: 40,
        intro: "Sensor Node mendeteksi kondisi lingkungan, memproses hasil pengukuran, lalu mengirimkan data melalui komunikasi nirkabel.",
        type: "sensor"
    },
    material3: {
        level: 3,
        title: "Mengenal Sink / Base Station",
        kicker: "LEVEL 3 — SINK / BASE STATION",
        progress: 60,
        intro: "Sink atau Base Station menerima dan mengumpulkan data dari beberapa Sensor Node, kemudian meneruskannya ke perangkat berikutnya.",
        type: "sink"
    },
    material4: {
        level: 4,
        title: "Mengenal Gateway",
        kicker: "LEVEL 4 — GATEWAY",
        progress: 80,
        intro: "Gateway menghubungkan jaringan sensor nirkabel dengan jaringan atau sistem di luar WSN, seperti Internet, server, atau cloud.",
        type: "gateway"
    },
    material5: {
        level: 5,
        title: "Mengenal Komunikasi Nirkabel",
        kicker: "LEVEL 5 — KOMUNIKASI NIRKABEL",
        progress: 100,
        intro: "Komunikasi nirkabel memungkinkan perangkat bertukar data tanpa kabel fisik. Pada WSN, Sensor Node mengirimkan data menuju Sink / Base Station.",
        type: "wireless"
    }
};

const componentInfo = {
    "Sensor": [
        "Sensor",
        "Berfungsi mendeteksi kondisi lingkungan seperti suhu, kelembapan, cahaya, atau gerakan."
    ],
    "Mikrokontroler": [
        "Mikrokontroler",
        "Memproses data yang diperoleh dari sensor dan mengatur kerja Sensor Node."
    ],
    "Modul Komunikasi": [
        "Modul Komunikasi Nirkabel",
        "Mengirimkan dan menerima data secara nirkabel dari Sensor Node."
    ],
    "Baterai / Power": [
        "Baterai / Power",
        "Menyediakan energi listrik agar seluruh komponen Sensor Node dapat bekerja."
    ]
};

/* MENGATUR PERPINDAHAN HALAMAN */
function showScreen(id) {
    document.querySelectorAll(".screen").forEach(screen => {
        screen.classList.add("hidden");
    });

    document.getElementById("mainApp").classList.add("hidden");

    const target = document.getElementById(id);

    if (target) {
        target.classList.remove("hidden");
    }
}

/* MENAMPILKAN ATAU MENYEMBUNYIKAN PASSWORD */
function togglePassword() {
    const password = document.getElementById("password");

    password.type =
        password.type === "password" ? "text" : "password";
}

/* MENAMPILKAN PESAN */
function toast(message) {
    const element = document.getElementById("toast");

    element.textContent = message;
    element.classList.add("show");

    clearTimeout(window.toastTimer);

    window.toastTimer = setTimeout(() => {
        element.classList.remove("show");
    }, 3000);
}

/* MEMPERBARUI NAMA PENGGUNA DI SELURUH TAMPILAN */
function updateExplorerName(name) {
    const safeName = (name || "").trim() || "Explorer";

    document.querySelectorAll(".explorer-name").forEach(element => {
        element.textContent = safeName;
    });

    document.querySelectorAll(".avatar").forEach(element => {
        element.textContent = safeName.charAt(0).toUpperCase();
    });
}

/* LOGIN MENGGUNAKAN DATABASE */
document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    const button = e.currentTarget.querySelector('button[type="submit"]');

    if (!username || !password) {
        toast("Username dan password wajib diisi.");
        return;
    }

    if (button) {
        button.disabled = true;
        button.textContent = "MEMERIKSA...";
    }

    try {
        const response = await fetch("api/login.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            toast(result.message || "Login gagal. Periksa akun kamu.");
            return;
        }

        const name = result.user.username;

        updateExplorerName(name);

        document.getElementById("mainApp").classList.remove("hidden");
        document.getElementById("loginScreen").classList.add("hidden");
        document.getElementById("splashScreen").classList.add("hidden");

        const registerScreen = document.getElementById("registerScreen");

        if (registerScreen) {
            registerScreen.classList.add("hidden");
        }

        navigate("dashboard");

        toast("Selamat datang, " + name + "! Petualanganmu dimulai.");

    } catch (error) {
        console.error("Kesalahan login:", error);
        toast("Tidak dapat terhubung ke server. Periksa XAMPP.");
    } finally {
        if (button) {
            button.disabled = false;
            button.textContent = "MASUK →";
        }
    }
});

/* PENDAFTARAN AKUN KE DATABASE */
const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const username = document.getElementById("regUsername").value.trim();
        const email = document.getElementById("regEmail").value.trim();
        const password = document.getElementById("regPassword").value;

        const button = registerForm.querySelector('button[type="submit"]');

        if (!username || !email || !password) {
            toast("Semua kolom pendaftaran wajib diisi.");
            return;
        }

        if (password.length < 8) {
            toast("Password minimal 8 karakter.");
            return;
        }

        if (button) {
            button.disabled = true;
            button.textContent = "MENDAFTARKAN...";
        }

        try {
            const response = await fetch("api/register.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: username,
                    email: email,
                    password: password
                })
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                toast(result.message || "Pendaftaran gagal.");
                return;
            }

            registerForm.reset();

            document.getElementById("username").value = username;

            showScreen("loginScreen");

            toast("Pendaftaran berhasil! Silakan login.");

        } catch (error) {
            console.error("Kesalahan pendaftaran:", error);
            toast("Tidak dapat terhubung ke server. Periksa XAMPP.");
        } finally {
            if (button) {
                button.disabled = false;
                button.textContent = "DAFTAR →";
            }
        }
    });
}

/* MEMPERBARUI POIN */
function updatePoints() {
    document.getElementById("points").textContent = appState.points;
}

/* NAVIGASI MENU */
function navigate(route) {
    appState.route = route;

    document.querySelectorAll(".nav-item").forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.route === route ||
            (route.startsWith("material") && button.dataset.route === "material1")
        );
    });

    renderRoute();
}

/* JUDUL HALAMAN */
function heading(kicker, title, subtitle, action = "") {
    return `<div class="page-heading">
        <div>
            <span class="eyebrow-small">${kicker}</span>
            <h1>${title}</h1>
            <p>${subtitle}</p>
        </div>
        ${action}
    </div>`;
}

/* MENAMPILKAN HALAMAN SESUAI MENU */
function renderRoute() {
    const main = document.getElementById("mainContent");

    if (routeIsMaterial(appState.route)) {
        main.innerHTML = renderMaterial(appState.route);
        return;
    }

    switch (appState.route) {
        case "dashboard":
            main.innerHTML = renderDashboard();
            break;

        case "map":
            main.innerHTML = renderMap();
            break;

        case "quiz":
            main.innerHTML = renderQuiz();
            break;

        case "achievements":
            main.innerHTML = renderAchievements();
            break;

        case "profile":
            main.innerHTML = renderProfile();
            break;

        default:
            main.innerHTML = renderDashboard();
    }
}

function routeIsMaterial(route) {
    return !!materials[route];
}

/* DASHBOARD: NAMA MENGIKUTI AKUN YANG LOGIN */
function renderDashboard() {
    const name =
        document.querySelector(".explorer-name").textContent.trim() || "Explorer";

    return `${heading(
        "YOUR LEARNING JOURNEY",
        `Halo, ${name}! 👋`,
        "Lanjutkan petualangan belajarmu tentang Wireless Sensor Network."
    )}
    <div class="grid dashboard-grid">
        <section class="card progress-card">
            <div class="progress-top">
                <div>
                    <h3>Progress Pembelajaran</h3>
                    <p>Terus maju untuk membuka semua misi.</p>
                </div>
                <div class="progress-number">75%</div>
            </div>

            <div class="progress-track">
                <div class="progress-fill" style="width:75%"></div>
            </div>

            <div class="progress-meta">
                <span>3 dari 5 level telah diselesaikan</span>
                <b>⭐ ${appState.points} Points</b>
            </div>
        </section>

        <section class="card level-card">
            <div class="level-illustration">⌁</div>
            <div>
                <span class="level-tag">LEVEL SAAT INI · LEVEL 2</span>
                <h2>Sensor Node</h2>
                <p>Kenali bagian penting yang mengumpulkan data dari lingkungan.</p>
                <button class="btn btn-primary" onclick="navigate('material2')">
                    LANJUTKAN BELAJAR →
                </button>
            </div>
        </section>

        <div class="stat-row">
            <div class="card stat-card">
                <div class="stat-icon">⭐</div>
                <div>
                    <small>Total Points</small>
                    <strong>${appState.points}</strong>
                    <small>Terus kumpulkan poin</small>
                </div>
            </div>

            <div class="card stat-card">
                <div class="stat-icon">🔥</div>
                <div>
                    <small>Streak Hari</small>
                    <strong>3 Hari</strong>
                    <small>Jaga konsistensimu</small>
                </div>
            </div>

            <div class="card stat-card">
                <div class="stat-icon">🏆</div>
                <div>
                    <small>Badge Terbaru</small>
                    <strong>WSN Explorer</strong>
                    <small>Badge berhasil dibuka</small>
                </div>
            </div>
        </div>

        <div class="mission-row">
            <section class="card mission-card">
                <div>
                    <span class="eyebrow-small">MISI BERIKUTNYA</span>
                    <h3>Mengenal Sensor Node</h3>
                    <p>Pahami sensor, mikrokontroler, modul komunikasi, dan sumber daya.</p>
                    <span class="reward">⭐ Reward +100 Points</span>
                </div>
                <button class="btn btn-primary" onclick="navigate('material2')">
                    MULAI MISI
                </button>
            </section>

            <section class="card mission-card">
                <div>
                    <span class="eyebrow-small">ACHIEVEMENT TERBARU</span>
                    <h3>🏆 WSN Explorer</h3>
                    <p>Terus belajar untuk membuka badge berikutnya!</p>
                    <button class="btn btn-secondary" onclick="navigate('achievements')">
                        LIHAT PRESTASI
                    </button>
                </div>
            </section>
        </div>
    </div>`;
}

/* PETA MISI */
function renderMap() {
    return `${heading(
        "MISSION CONTROL",
        "Peta Petualangan",
        "Selesaikan setiap misi untuk menjadi WSN Explorer."
    )}
    <div class="map-layout">
        <section class="card mission-map">
            <div class="map-path"></div>

            <div class="map-node done mn1">
                <div class="map-icon">✓</div>
                <b>Level 1 · Mengenal WSN</b>
                <small>SELESAI · +100 points</small>
            </div>

            <div class="map-node current mn2 clickable" onclick="navigate('material2')">
                <div class="map-icon">⌁</div>
                <b>Level 2 · Sensor Node</b>
                <small>SEDANG DIPELAJARI</small>
            </div>

            <div class="map-node locked mn3">
                <div class="map-icon">▣</div>
                <b>Level 3 · Sink / Base Station</b>
                <small>🔒 TERKUNCI</small>
            </div>

            <div class="map-node locked mn4">
                <div class="map-icon">⌘</div>
                <b>Level 4 · Gateway</b>
                <small>🔒 TERKUNCI</small>
            </div>

            <div class="map-node locked mn5">
                <div class="map-icon">〰</div>
                <b>Level 5 · Komunikasi Nirkabel</b>
                <small>🔒 TERKUNCI</small>
            </div>

            <div class="map-node locked mn6">
                <div class="map-icon">★</div>
                <b>Final Mission · Evaluasi WSN</b>
                <small>🔒 TERKUNCI</small>
            </div>
        </section>

        <section class="card">
            <span class="eyebrow-small">MISSION AKTIF</span>
            <h2 style="margin-top:10px">Level 2 — Sensor Node</h2>
            <p>Pelajari komponen utama Sensor Node dan fungsi setiap bagiannya.</p>

            <div class="progress-track">
                <div class="progress-fill" style="width:40%"></div>
            </div>

            <p>⭐ Reward +100 Points</p>

            <button class="btn btn-primary full-width" onclick="navigate('material2')">
                MULAI MISI →
            </button>

            <div class="quiz-bottom-stats">
                <span>⭐ ${appState.points} Points</span>
                <span>❤️ ${appState.lives} Lives</span>
            </div>
        </section>
    </div>`;
}

/* MATERI PEMBELAJARAN */
function renderMaterial(route) {
    const m = materials[route];
    let diagram = "";

    if (m.type === "wsn") {
        diagram = `<div class="diagram-flow">
            <div class="flow-device"><span>◉</span><b>Sensor Node</b><small>Collect data</small></div>
            <span class="flow-arrow">→</span>
            <div class="flow-device"><span>〰</span><b>Wireless</b><small>Send data</small></div>
            <span class="flow-arrow">→</span>
            <div class="flow-device"><span>▣</span><b>Sink / Base</b><small>Collect data</small></div>
            <span class="flow-arrow">→</span>
            <div class="flow-device"><span>⌘</span><b>Gateway</b><small>Connect</small></div>
            <span class="flow-arrow">→</span>
            <div class="flow-device"><span>☁</span><b>Server / Cloud</b><small>Store data</small></div>
        </div>
        <div class="component-grid">
            ${[
                ["◉", "Sensor Node", "Mengumpulkan data"],
                ["▣", "Sink / Base", "Menerima data"],
                ["⌘", "Gateway", "Menghubungkan jaringan"],
                ["☁", "Server / Cloud", "Menyimpan data"],
                ["◎", "User", "Menggunakan informasi"]
            ].map(x => `<div class="component-tile">
                <span>${x[0]}</span><b>${x[1]}</b><small>${x[2]}</small>
            </div>`).join("")}
        </div>`;
    }

    if (m.type === "sensor") {
        diagram = `<div class="component-interactive">
            <div class="card component-visual">
                <div class="sensor-board">⌁</div>

                <button class="callout c-top clickable ${appState.selectedComponent === "Sensor" ? "selected" : ""}" onclick="selectComponent('Sensor')">
                    Sensor
                </button>

                <button class="callout c-left clickable ${appState.selectedComponent === "Mikrokontroler" ? "selected" : ""}" onclick="selectComponent('Mikrokontroler')">
                    Mikrokontroler
                </button>

                <button class="callout c-right clickable ${appState.selectedComponent === "Modul Komunikasi" ? "selected" : ""}" onclick="selectComponent('Modul Komunikasi')">
                    Modul Komunikasi
                </button>

                <button class="callout c-bottom clickable ${appState.selectedComponent === "Baterai / Power" ? "selected" : ""}" onclick="selectComponent('Baterai / Power')">
                    Baterai / Power
                </button>
            </div>

            <div class="card info-card" id="componentInfo">
                <span class="eyebrow-small">KOMPONEN SENSOR NODE</span>
                <h3>${componentInfo[appState.selectedComponent][0]}</h3>
                <p>${componentInfo[appState.selectedComponent][1]}</p>
                <p class="muted">Klik setiap komponen pada ilustrasi untuk mempelajari fungsi dan perannya.</p>
            </div>
        </div>`;
    }

    if (m.type === "sink") {
        diagram = `<div class="diagram-flow">
            <div class="flow-device"><span>◉</span><b>Sensor Node 1</b><small>Wireless data</small></div>
            <span class="flow-arrow">↘</span>
            <div class="flow-device"><span>◉</span><b>Sensor Node 2</b><small>Wireless data</small></div>
            <span class="flow-arrow">↙</span>
            <div class="flow-device" style="border:2px solid var(--cyan);box-shadow:0 0 0 4px #27c7e817">
                <span>▣</span><b>Sink / Base Station</b><small>Collect data</small>
            </div>
            <span class="flow-arrow">→</span>
            <div class="flow-device"><span>⌘</span><b>Gateway</b><small>Forward data</small></div>
        </div>`;
    }

    if (m.type === "gateway") {
        diagram = `<div class="diagram-flow">
            <div class="flow-device"><span>◉</span><b>Sensor Nodes</b><small>Collect data</small></div>
            <span class="flow-arrow">→</span>
            <div class="flow-device"><span>▣</span><b>Sink / Base</b><small>Receive data</small></div>
            <span class="flow-arrow">→</span>
            <div class="flow-device" style="border:2px solid var(--cyan);box-shadow:0 0 0 5px #27c7e81b;background:#f3fdff">
                <span>⌘</span><b>Gateway</b><small>External network</small>
            </div>
            <span class="flow-arrow">→</span>
            <div class="flow-device"><span>☁</span><b>Internet / Cloud</b><small>System destination</small></div>
        </div>`;
    }

    if (m.type === "wireless") {
        diagram = `<div class="diagram-flow">
            <div class="flow-device"><span>◉</span><b>Sensor Node</b><small>Read environment</small></div>
            <span class="flow-arrow">〰</span>
            <div class="flow-device" style="border:2px solid var(--cyan);background:#f3fdff">
                <span>📡</span><b>Wireless Signal</b><small>Data packet</small>
            </div>
            <span class="flow-arrow">→</span>
            <div class="flow-device"><span>▣</span><b>Sink / Base</b><small>Receive data</small></div>
            <span class="flow-arrow">→</span>
            <div class="flow-device"><span>⌘</span><b>Gateway</b><small>Forward data</small></div>
        </div>
        <div class="technology-grid">
            ${[
                ["📶", "Wi-Fi", "Jangkauan dan kecepatan relatif tinggi."],
                ["🔷", "Zigbee", "Komunikasi berdaya rendah."],
                ["🔵", "Bluetooth", "Komunikasi jarak dekat."],
                ["📡", "LoRa", "Jarak jauh dengan daya rendah."]
            ].map(t => `<div class="tech-card ${appState.selectedTech === t[1] ? "selected" : ""}" onclick="selectTech('${t[1]}')">
                <span>${t[0]}</span><b>${t[1]}</b><p>${t[2]}</p>
            </div>`).join("")}
        </div>`;
    }

    const explanation = m.type === "sink"
        ? "Sink / Base Station menerima data dari beberapa Sensor Node, mengumpulkan data tersebut, lalu meneruskannya ke Gateway."
        : m.type === "gateway"
        ? "Gateway menghubungkan WSN dengan jaringan eksternal seperti Internet, server, atau cloud. Gateway meneruskan data antara jaringan sensor dan sistem lainnya."
        : m.type === "wireless"
        ? "Sensor Node membaca kondisi lingkungan, kemudian data dikirim tanpa kabel fisik menuju Sink / Base Station. Data selanjutnya dapat diteruskan ke Gateway."
        : m.type === "sensor"
        ? "Sensor Node mendeteksi kondisi lingkungan, memproses pengukuran, lalu mengirimkan data secara nirkabel."
        : "WSN memungkinkan data dari lingkungan dikumpulkan oleh sensor dan dikirimkan secara nirkabel ke sistem pengolah data.";

    const functions = m.type === "gateway"
        ? ["Menghubungkan WSN dengan jaringan eksternal", "Meneruskan data ke server atau cloud", "Menjadi penghubung komunikasi dengan sistem lain"]
        : m.type === "sink"
        ? ["Mengumpulkan data dari Sensor Node", "Menerima dan menggabungkan data yang dikirimkan", "Meneruskan data ke Gateway"]
        : m.type === "sensor"
        ? ["Sensor mendeteksi kondisi lingkungan", "Mikrokontroler memproses data", "Modul komunikasi mengirimkan data"]
        : m.type === "wireless"
        ? ["Mengirim data tanpa kabel", "Menghubungkan perangkat dalam jaringan sensor", "Meneruskan informasi ke perangkat tujuan"]
        : ["Sensor Node mengumpulkan data", "Sink menerima data dari Sensor Node", "Gateway menghubungkan jaringan ke sistem lain"];

    return `${heading(
        m.kicker,
        m.title,
        `Materi ${m.level} dari 5 · Pelajari konsep utama dan alur kerja WSN.`
    )}
    <div class="material-progress">
        <span class="muted">Progress materi</span>
        <div class="progress-track"><div class="progress-fill" style="width:${m.progress}%"></div></div>
        <b style="font-size:11px;color:var(--blue)">${m.progress}%</b>
    </div>

    <div class="material-grid">
        <section class="card diagram-card">
            <span class="eyebrow-small">VISUAL LEARNING</span>
            <h3 style="margin-top:8px">${m.type === "wireless" ? "Alur Komunikasi Nirkabel" : m.type === "sensor" ? "Bagian Sensor Node" : m.type === "sink" ? "Alur Data Menuju Sink" : m.type === "gateway" ? "Alur Data Melalui Gateway" : "Arsitektur Wireless Sensor Network"}</h3>
            ${diagram}

            <div class="action-row">
                <button class="btn btn-secondary" onclick="toast('Audio materi dapat dihubungkan dengan file suara.')">
                    🔊 DENGARKAN
                </button>
                <button class="btn btn-primary" onclick="toast('Animasi ilustrasi dapat dikembangkan pada tahap berikutnya.')">
                    ▶ LIHAT ANIMASI
                </button>
            </div>
        </section>

        <div>
            <section class="card info-card">
                <span class="eyebrow-small">KONSEP UTAMA</span>
                <h3 style="margin-top:9px">${m.type === "gateway" ? "Apa itu Gateway?" : m.type === "sink" ? "Apa itu Sink / Base Station?" : m.type === "sensor" ? "Apa itu Sensor Node?" : m.type === "wireless" ? "Apa itu Komunikasi Nirkabel?" : "Apa itu WSN?"}</h3>
                <p>${m.intro}</p>
                <h3 style="margin-top:18px">Fungsi / Hal Penting</h3>
                <ul class="bullet-list">${functions.map(x => `<li>${x}</li>`).join("")}</ul>
            </section>

            <section class="card tip-card">
                <strong>💡 Cara Kerjanya</strong>
                <p>${explanation}</p>
            </section>
        </div>
    </div>

    <div class="level-nav">
        <button class="btn btn-outline" onclick="previousMaterial(${m.level})">
            ← KEMBALI
        </button>
        <button class="btn btn-primary" onclick="nextMaterial(${m.level})">
            ${m.level === 5 ? "MULAI QUIZ" : "LANJUT →"}
        </button>
    </div>`;
}

/* INTERAKSI KOMPONEN */
function selectComponent(key) {
    appState.selectedComponent = key;
    renderRoute();
}

function selectTech(key) {
    appState.selectedTech = key;
    renderRoute();
    toast(`${key} dipilih`);
}

/* NAVIGASI MATERI */
function previousMaterial(level) {
    if (level === 1) {
        navigate("map");
    } else {
        navigate("material" + (level - 1));
    }
}

function nextMaterial(level) {
    if (level === 5) {
        navigate("quiz");
        return;
    }

    navigate("material" + (level + 1));
}

/* KUIS */
function renderQuiz() {
    return `${heading(
        "FINAL CHALLENGE",
        "Uji Pengetahuanmu!",
        "Buktikan bahwa kamu siap menjadi WSN Explorer."
    )}
    <div class="quiz-layout">
        <div class="quiz-topline">
            <span class="quiz-meta">
                PERTANYAAN 1 DARI 5
                <span style="display:inline-block;width:140px;height:6px;border-radius:10px;background:#e5edf7;margin:0 10px;vertical-align:middle;overflow:hidden">
                    <span style="display:block;width:20%;height:100%;background:var(--cyan)"></span>
                </span>
                20%
            </span>
            <span class="timer-pill">⏱ 00:30</span>
        </div>

        <section class="card quiz-card">
            <div class="quiz-question">
                <div class="question-art">⌁</div>
                <div>
                    <span class="question-label">QUESTION 01</span>
                    <h2>Perangkat manakah yang bertugas mengumpulkan data dari lingkungan pada Wireless Sensor Network?</h2>
                </div>
            </div>

            <div class="answers">
                ${["Sensor Node", "Gateway", "Server / Cloud", "User"].map((answer, i) => `
                    <button class="answer-option ${appState.selectedAnswer === i ? "selected" : ""}" ${appState.answered ? "disabled" : ""} onclick="selectAnswer(${i})">
                        <span class="answer-letter">${"ABCD"[i]}</span>
                        <span>${answer}</span>
                    </button>
                `).join("")}
            </div>

            <div class="feedback ${appState.answered ? "show" : ""} ${appState.selectedAnswer === 0 ? "good" : "bad"}" id="quizFeedback">
                ${appState.selectedAnswer === 0
                    ? "✓ Benar! Sensor Node bertugas mengumpulkan data dari lingkungan. Kamu memperoleh +100 Points."
                    : "✕ Belum tepat. Jawaban yang benar adalah Sensor Node, karena komponen ini mengumpulkan data dari lingkungan."}
            </div>

            <div class="quiz-footer">
                <span class="quiz-hint">💡 Baca pertanyaan dengan teliti sebelum menjawab.</span>
                ${appState.answered
                    ? `<button class="btn btn-primary" onclick="nextQuestion()">PERTANYAAN BERIKUTNYA →</button>`
                    : `<button class="btn btn-primary" onclick="submitAnswer()">SUBMIT JAWABAN →</button>`}
            </div>
        </section>

        <div class="quiz-bottom-stats">
            <span>⭐ ${appState.points} Points</span>
            <span>🔥 3 Streak Hari</span>
            <span>❤️ ${appState.lives} Lives</span>
            <span class="reward">Reward: +100 Points</span>
        </div>
    </div>`;
}

function selectAnswer(i) {
    if (appState.answered) return;

    appState.selectedAnswer = i;
    renderRoute();
}

function submitAnswer() {
    if (appState.selectedAnswer === null) {
        toast("Pilih salah satu jawaban terlebih dahulu.");
        return;
    }

    appState.answered = true;

    if (appState.selectedAnswer === 0) {
        appState.points += 100;
        toast("Jawaban benar! +100 Points");
    } else {
        appState.lives = Math.max(0, appState.lives - 1);
        toast("Jawaban belum tepat. Coba pelajari kembali materinya.");
    }

    updatePoints();
    renderRoute();
}

function nextQuestion() {
    appState.answered = false;
    appState.selectedAnswer = null;

    toast("Prototype ini menampilkan pertanyaan pertama. Tambahkan bank soal untuk quiz lengkap.");

    renderRoute();
}

/* PRESTASI */
function renderAchievements() {
    return `${heading(
        "YOUR REWARDS",
        "Prestasi Explorer",
        "Badge dan pencapaian yang kamu kumpulkan selama belajar."
    )}
    <div class="achievement-banner">
        <div class="medal">🏆</div>
        <div>
            <span class="eyebrow-small">BADGE TERBARU</span>
            <h2>WSN Explorer</h2>
            <p>Kamu telah memulai petualangan memahami Wireless Sensor Network.</p>
        </div>
    </div>

    <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(210px,1fr));margin-top:18px">
        <section class="card">
            <div style="font-size:32px">🌱</div>
            <h3>First Steps</h3>
            <p>Memulai petualangan pembelajaran.</p>
            <span class="reward">UNLOCKED</span>
        </section>

        <section class="card">
            <div style="font-size:32px">📡</div>
            <h3>Signal Seeker</h3>
            <p>Mempelajari komunikasi nirkabel.</p>
            <span class="muted">Belum terbuka</span>
        </section>

        <section class="card">
            <div style="font-size:32px">🧠</div>
            <h3>Quiz Master</h3>
            <p>Menjawab tantangan dengan benar.</p>
            <span class="muted">Belum terbuka</span>
        </section>
    </div>`;
}

/* PROFIL PENGGUNA */
function renderProfile() {
    const name =
        document.querySelector(".explorer-name").textContent.trim() || "Explorer";

    return `${heading(
        "YOUR PROFILE",
        "Profil Explorer",
        "Ringkasan profil dan progres pembelajaranmu."
    )}
    <div class="profile-grid">
        <section class="card">
            <div class="profile-avatar">${name.charAt(0).toUpperCase()}</div>
            <h2>${name}</h2>
            <p>WSN Explorer · Level 2</p>
            <span class="reward">⭐ ${appState.points} Points</span>
        </section>

        <section class="card">
            <h3>Statistik Pembelajaran</h3>
            <div class="stat-row" style="grid-template-columns:repeat(2,1fr)">
                <div class="card stat-card">
                    <div class="stat-icon">📚</div>
                    <div>
                        <small>Materi</small>
                        <strong>5 Level</strong>
                    </div>
                </div>

                <div class="card stat-card">
                    <div class="stat-icon">🏆</div>
                    <div>
                        <small>Badge</small>
                        <strong>1 Badge</strong>
                    </div>
                </div>
            </div>
            <p class="empty-note">Profil pembelajaran masih berupa prototype.</p>
        </section>
    </div>`;
}

/* MENAMPILKAN HALAMAN AWAL */
showScreen("splashScreen");