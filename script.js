document.getElementById("checkPerformance").addEventListener("click", function() {
    const urlInput = document.getElementById("url").value;

    // Respon sedang diproses
    document.getElementById("status").innerHTML = "Sedang memproses keempat kombinasi (Desktop/Mobile dan URL Penuh/Asal)... Mohon tunggu.";

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
        // Jika semua data telah selesai diproses, tampilkan hasil
        completedRequests++;
        if (completedRequests === totalRequests) {
            document.getElementById("status").innerHTML = "Semua data berhasil diproses. Pilih tab untuk melihat hasil.";
        }
    });
});

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
            onComplete(); // Menghitung request yang selesai
        })
        .catch(error => {
            console.error("Error fetching PageSpeed data:", error);
            document.getElementById(tabId).innerHTML = "Terjadi kesalahan saat mengambil data.";
            onComplete(); // Tetap panggil meskipun ada error
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

// Fungsi untuk mengubah tab Desktop/Mobile
function openMainTab(tabName) {
    const mainTabs = document.getElementsByClassName('tab');
    for (let i = 0; i < mainTabs.length; i++) {
        mainTabs[i].classList.remove('active');
    }
    document.getElementById(tabName).classList.add('active');
}

// Fungsi untuk mengubah sub-tab (URL Penuh/Asal)
function openSubTab(subTabName) {
    const subTabs = document.getElementsByClassName('sub-tab');
    for (let i = 0; i < subTabs.length; i++) {
        subTabs[i].classList.remove('active');
    }
    document.getElementById(subTabName).classList.add('active');
}
