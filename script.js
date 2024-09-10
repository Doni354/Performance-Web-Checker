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
    getPageSpeedData(urlFull, 'desktop', 'desktop-full', onComplete);

    // Cek desktop untuk URL asal
    getPageSpeedData(urlOrigin, 'desktop', 'desktop-origin', onComplete);

    // Cek mobile untuk URL penuh
    getPageSpeedData(urlFull, 'mobile', 'mobile-full', onComplete);

    // Cek mobile untuk URL asal
    getPageSpeedData(urlOrigin, 'mobile', 'mobile-origin', onComplete);
}

// Ambil data dari API dan tampilkan hasilnya
function getPageSpeedData(url, strategy, tabId, onComplete) {
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
                displayResults(data, tabId);
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
function displayResults(data, tabId) {
    const fcp = data.lighthouseResult.audits['first-contentful-paint'].displayValue;
    const lcp = data.lighthouseResult.audits['largest-contentful-paint'].displayValue;
    const cls = data.lighthouseResult.audits['cumulative-layout-shift'].displayValue;
    const tbt = data.lighthouseResult.audits['total-blocking-time'].displayValue;
    const tti = data.lighthouseResult.audits['interactive'].displayValue;
    const performanceScore = data.lighthouseResult.categories.performance.score * 100;

    document.getElementById(tabId).innerHTML = `
        <p>First Contentful Paint (FCP): ${fcp}</p>
        <p>Largest Contentful Paint (LCP): ${lcp}</p>
        <p>Cumulative Layout Shift (CLS): ${cls}</p>
        <p>Total Blocking Time (TBT): ${tbt} ms</p>
        <p>Time to Interactive (TTI): ${tti}</p>
        <p>Performance Score: ${performanceScore}/100</p>
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
