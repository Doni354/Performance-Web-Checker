let isProcessing = false;

// Set default ke Desktop dan URL Penuh saat halaman dimuat
window.onload = function() {
    selectMainTab('desktop');
    selectSubTab('full');
};

document.getElementById("checkPerformance").addEventListener("click", function() {
    if (isProcessing) return; // Hindari permintaan ganda

    const urlInput = document.getElementById("url").value;

    // Cek apakah URL kosong
    if (!urlInput) {
        document.getElementById("status").innerHTML = "URL belum diisi. Masukkan URL yang valid.";
        return;
    }

    isProcessing = true; // Tandai proses sedang berlangsung
    document.getElementById("status").innerHTML = "Sedang memproses kombinasi Desktop/Mobile dan URL Penuh/Asal... Mohon tunggu.";

    let urlFull, urlOrigin;

    // Validasi dan parsing URL
    try {
        const parsedUrl = new URL(urlInput);
        urlFull = urlInput;
        urlOrigin = parsedUrl.origin;
    } catch (error) {
        document.getElementById("status").innerHTML = "URL yang Anda masukkan tidak valid.";
        isProcessing = false;
        return;
    }

    // Menyimpan status progres
    let completedRequests = 0;
    const totalRequests = 4;

    // Reset data sebelum memulai pengecekan ulang
    clearPreviousResults();

    // Proses untuk keempat kombinasi
    checkAllCombinations(urlFull, urlOrigin, function() {
        completedRequests++;
        if (completedRequests === totalRequests) {
            document.getElementById("status").innerHTML = "Semua data berhasil diproses. Pilih tab untuk melihat hasil.";
            isProcessing = false; // Tandai proses selesai
        }
    });
});

// Reset hasil sebelum memulai request baru
function clearPreviousResults() {
    document.getElementById("desktop-full").innerHTML = "";
    document.getElementById("desktop-origin").innerHTML = "";
    document.getElementById("mobile-full").innerHTML = "";
    document.getElementById("mobile-origin").innerHTML = "";
}

// Proses semua kombinasi
function checkAllCombinations(urlFull, urlOrigin, onComplete) {
    // Cek desktop untuk URL penuh
    getPageSpeedData(urlFull, 'desktop', 'desktop-full', 'Desktop URL Penuh', onComplete);

    // Cek desktop untuk URL asal
    getPageSpeedData(urlOrigin, 'desktop', 'desktop-origin', 'Desktop URL Asal', onComplete);

    // Cek mobile untuk URL penuh
    getPageSpeedData(urlFull, 'mobile', 'mobile-full', 'Mobile URL Penuh', onComplete);

    // Cek mobile untuk URL asal
    getPageSpeedData(urlOrigin, 'mobile', 'mobile-origin', 'Mobile URL Asal', onComplete);
}

// Ambil data dari API dan tampilkan hasilnya
function getPageSpeedData(url, strategy, tabId, title, onComplete) {
    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=${strategy}`;

    // Tampilkan status loading di tab yang sedang di-request
    if (document.getElementById(tabId).innerHTML === "") {
        document.getElementById(tabId).innerHTML = `<p class="loading">Sedang memproses ${strategy.toUpperCase()} - ${tabId.includes('full') ? 'URL Penuh' : 'URL Asal'}...</p>`;
    }

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                document.getElementById(tabId).innerHTML = "Data tidak ditemukan atau terjadi kesalahan.";
            } else {
                displayResults(data, tabId, title);
            }
            onComplete();
        })
        .catch(error => {
            console.error("Error fetching PageSpeed data:", error);
            document.getElementById(tabId).innerHTML = "Terjadi kesalahan saat mengambil data.";
            onComplete();
        });
}

// Tampilkan hasil
function displayResults(data, tabId, title) {
    const fcp = parseFloat(data.lighthouseResult.audits['first-contentful-paint'].displayValue);
    const lcp = parseFloat(data.lighthouseResult.audits['largest-contentful-paint'].displayValue);
    const cls = parseFloat(data.lighthouseResult.audits['cumulative-layout-shift'].displayValue);
    const tbt = parseFloat(data.lighthouseResult.audits['total-blocking-time'].displayValue);
    const tti = data.lighthouseResult.audits['interactive'].displayValue;
    const performanceScore = data.lighthouseResult.categories.performance.score * 100;

    function getPerformanceCategory(value, thresholds) {
        if (value <= thresholds.low) return 'Baik';
        if (value <= thresholds.medium) return 'Memerlukan Peningkatan';
        return 'Buruk';
    }

    function getColorClass(value, thresholds) {
        if (value <= thresholds.low) return 'result-good';
        if (value <= thresholds.medium) return 'result-needs-improvement';
        return 'result-poor';
    }

    function formatMetric(value, thresholds, label, description) {
        const performanceLabel = getPerformanceCategory(value, thresholds);
        const colorClass = getColorClass(value, thresholds);
        return `
            <div class="result-container ${colorClass}">
                <div class="result-label">${label}: ${value} detik</div>
                <p class="result-category">${performanceLabel}</p>
                <p class="result-description">${description}</p>
            </div>
        `;
    }

    // Thresholds untuk masing-masing metrik (dalam detik atau milidetik)
    const thresholdsLCP = { low: 2.5, medium: 4 }; // Detik
    const thresholdsFCP = { low: 1.8, medium: 3 }; // Detik
    const thresholdsCLS = { low: 0.1, medium: 0.25 }; // Skor
    const thresholdsTBT = { low: 300, medium: 600 }; // Milidetik

    // Ambil waktu saat ini
    const currentTime = new Date();
    const formattedTime = `${currentTime.getDate()} ${currentTime.toLocaleString('id-ID', { month: 'short' })} ${currentTime.getFullYear()}, ${currentTime.toLocaleTimeString('id-ID')}`;

    // Format hasil dengan waktu dan judul
    document.getElementById(tabId).innerHTML = `
        <div class="result-section">
            <div class="result-title">${title}</div>
            ${formatMetric(lcp, thresholdsLCP, 'Largest Contentful Paint (LCP)', 'Largest Contentful Paint (LCP) mengukur waktu yang dibutuhkan untuk elemen konten terbesar pada halaman dimuat dan terlihat oleh pengguna.')}
            ${formatMetric(fcp, thresholdsFCP, 'First Contentful Paint (FCP)', 'First Contentful Paint (FCP) mengukur waktu yang dibutuhkan hingga elemen konten pertama kali dirender pada halaman.')}
            ${formatMetric(cls, thresholdsCLS, 'Cumulative Layout Shift (CLS)', 'Cumulative Layout Shift (CLS) mengukur seberapa sering elemen halaman berpindah posisi saat halaman dimuat, yang dapat memengaruhi pengalaman pengguna.')}
            ${formatMetric(tbt / 1000, thresholdsTBT, 'Total Blocking Time (TBT)', 'Total Blocking Time (TBT) mengukur total waktu dalam milidetik di mana thread utama terblokir dan tidak dapat merespons input pengguna.')} <!-- Konversi milidetik ke detik -->
            <div class="result-container ${getColorClass(performanceScore, {low: 90, medium: 50})}">
                <div class="result-label">Skor Performa: ${performanceScore}/100</div>
                <p class="result-category">${getPerformanceCategory(performanceScore, {low: 90, medium: 50})}</p>
            </div>
            <p class="timestamp">Laporan dari ${formattedTime}</p>
        </div>
    `;
}


// Fungsi untuk memilih tab utama (Desktop/Mobile)
function selectMainTab(mode) {
    const allSubTabs = ['desktop-full', 'desktop-origin', 'mobile-full', 'mobile-origin'];
    allSubTabs.forEach(tab => document.getElementById(tab).style.display = 'none');
    
    const desktopBtn = document.getElementById('desktop-btn');
    const mobileBtn = document.getElementById('mobile-btn');
    
    if (mode === 'desktop') {
        desktopBtn.classList.add('active');
        mobileBtn.classList.remove('active');
        document.getElementById('desktop-full').style.display = 'block';
        document.getElementById('desktop-origin').style.display = 'block';
    } else {
        mobileBtn.classList.add('active');
        desktopBtn.classList.remove('active');
        document.getElementById('mobile-full').style.display = 'block';
        document.getElementById('mobile-origin').style.display = 'block';
    }
}

// Fungsi untuk memilih sub-tab (URL Penuh/Asal)
function selectSubTab(urlType) {
    const mode = document.getElementById('desktop-btn').classList.contains('active') ? 'desktop' : 'mobile';

    const allSubTabs = {
        'desktop': {
            'full': 'desktop-full',
            'origin': 'desktop-origin'
        },
        'mobile': {
            'full': 'mobile-full',
            'origin': 'mobile-origin'
        }
    };

    // Sembunyikan semua tab
    Object.values(allSubTabs[mode]).forEach(tab => document.getElementById(tab).style.display = 'none');

    // Tampilkan tab yang dipilih
    const tabToShow = allSubTabs[mode][urlType];
    document.getElementById(tabToShow).style.display = 'block';
}
