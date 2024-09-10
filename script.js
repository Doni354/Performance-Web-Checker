document.getElementById("checkPerformance").addEventListener("click", function() {
    const urlInput = document.getElementById("url").value;

    // Respon sedang diproses
    document.getElementById("status").innerHTML = "Sedang memproses... Mohon tunggu.";

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

    // Memproses untuk semua kombinasi: Desktop & Mobile, URL Penuh & Asal
    checkAllCombinations(urlFull, urlOrigin);
});

function checkAllCombinations(urlFull, urlOrigin) {
    // Cek desktop untuk URL penuh
    getPageSpeedData(urlFull, 'desktop', 'desktop-full');

    // Cek desktop untuk URL asal
    getPageSpeedData(urlOrigin, 'desktop', 'desktop-origin');

    // Cek mobile untuk URL penuh
    getPageSpeedData(urlFull, 'mobile', 'mobile-full');

    // Cek mobile untuk URL asal
    getPageSpeedData(urlOrigin, 'mobile', 'mobile-origin');
}

function getPageSpeedData(url, strategy, tabId) {
    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=${strategy}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                document.getElementById(tabId).innerHTML = "Data tidak ditemukan atau terjadi kesalahan.";
            } else {
                displayResults(data, tabId);
            }
            document.getElementById("status").innerHTML = "Pengecekan selesai. Pilih tab untuk melihat hasil.";
        })
        .catch(error => {
            console.error("Error fetching PageSpeed data:", error);
            document.getElementById(tabId).innerHTML = "Terjadi kesalahan saat mengambil data.";
        });
}

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

// Fungsi untuk mengubah tab
function openTab(tabName) {
    // Sembunyikan semua tab
    const tabs = document.getElementsByClassName('tab');
    for (let i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove('active');
    }

    // Tampilkan tab yang dipilih
    document.getElementById(tabName).classList.add('active');
}
