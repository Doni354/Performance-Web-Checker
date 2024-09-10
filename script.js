// Set default ke Desktop dan URL Penuh saat halaman dimuat
window.onload = function() {
    selectMainTab('desktop');
    selectSubTab('full');
};

document.getElementById("checkPerformance").addEventListener("click", function() {
    const urlInput = document.getElementById("url").value;

    // Respon sedang diproses
    document.getElementById("status").innerHTML = "Sedang memproses kombinasi Desktop/Mobile dan URL Penuh/Asal... Mohon tunggu.";

    let urlFull, urlOrigin;
    
    // Validasi dan parsing URL
    try {
        const parsedUrl = new URL(urlInput);
        urlFull = urlInput;
        urlOrigin = parsedUrl.origin;
    } catch (error) {
        document.getElementById("status").innerHTML = "URL yang Anda masukkan tidak valid.";
        return;
    }

    // Menyimpan status progres
    let completedRequests = 0;
    const totalRequests = 4;

    // Proses untuk keempat kombinasi
    checkAllCombinations(urlFull, urlOrigin, function() {
        completedRequests++;
        if (completedRequests === totalRequests) {
            document.getElementById("status").innerHTML = "Semua data berhasil diproses. Pilih tab untuk melihat hasil.";
        }
    });
});

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
        desktopBtn.style.backgroundColor = '#ccc';
        mobileBtn.style.backgroundColor = '';
        document.getElementById('desktop-full').style.display = 'block';
        document.getElementById('desktop-origin').style.display = 'none';
    } else {
        mobileBtn.style.backgroundColor = '#ccc';
        desktopBtn.style.backgroundColor = '';
        document.getElementById('mobile-full').style.display = 'block';
        document.getElementById('mobile-origin').style.display = 'none';
    }
}

// Fungsi untuk memilih sub-tab (URL Penuh/Asal)
function selectSubTab(urlType) {
    const mode = document.getElementById('desktop-btn').style.backgroundColor === '#ccc' ? 'desktop' : 'mobile';

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

    // Aktifkan tab yang sesuai
    const fullTabId = allSubTabs[mode]['full'];
    const originTabId = allSubTabs[mode]['origin'];

    document.getElementById(fullTabId).style.display = urlType === 'full' ? 'block' : 'none';
    document.getElementById(originTabId).style.display = urlType === 'origin' ? 'block' : 'none';
    
    // Update tombol URL penuh/asal
    document.getElementById('full-btn').style.backgroundColor = urlType === 'full' ? '#ccc' : '';
    document.getElementById('origin-btn').style.backgroundColor = urlType === 'origin' ? '#ccc' : '';
}
