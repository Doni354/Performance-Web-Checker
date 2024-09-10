document.getElementById("checkPerformance").addEventListener("click", function() {
    const urlInput = document.getElementById("url").value;
    let finalUrl;

    // Periksa apakah pengguna memilih URL asal atau URL lengkap
    if (document.getElementById("useOriginal").checked) {
        // Ambil hanya asal (domain) dari URL yang diinputkan
        try {
            const parsedUrl = new URL(urlInput);
            finalUrl = parsedUrl.origin; // Hanya mengambil bagian domain (contoh: https://www.youtube.com)
        } catch (error) {
            console.error("Invalid URL:", error);
            alert("URL yang Anda masukkan tidak valid.");
            return;
        }
    } else {
        // Gunakan URL yang diinputkan secara penuh
        finalUrl = urlInput;
    }

    const strategy = document.getElementById("mobile").checked ? "mobile" : "desktop";
    
    console.log("Requesting URL:", finalUrl);
    
    getPageSpeedData(finalUrl, strategy);
});

function getPageSpeedData(url, strategy) {
    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=${strategy}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error("API Response Error:", data.error.message);
                document.getElementById("result").innerHTML = "Data tidak ditemukan. Pastikan URL yang Anda masukkan valid.";
            } else {
                displayResults(data);
            }
        })
        .catch(error => {
            console.error("Error fetching PageSpeed data:", error);
        });
}

function displayResults(data) {
    const fcp = data.lighthouseResult.audits['first-contentful-paint'].displayValue;
    const lcp = data.lighthouseResult.audits['largest-contentful-paint'].displayValue;
    const cls = data.lighthouseResult.audits['cumulative-layout-shift'].displayValue;
    const tbt = data.lighthouseResult.audits['total-blocking-time'].displayValue;
    const tti = data.lighthouseResult.audits['interactive'].displayValue;
    const performanceScore = data.lighthouseResult.categories.performance.score * 100;

    document.getElementById("result").innerHTML = `
        <p>First Contentful Paint (FCP): ${fcp} (Waktu hingga konten pertama kali terlihat)</p>
        <p>Largest Contentful Paint (LCP): ${lcp} (Waktu hingga elemen terbesar terlihat)</p>
        <p>Cumulative Layout Shift (CLS): ${cls} (Perubahan tata letak halaman yang terjadi)</p>
        <p>Total Blocking Time (TBT): ${tbt} ms (Waktu saat halaman tidak merespons)</p>
        <p>Time to Interactive (TTI): ${tti} (Waktu hingga halaman sepenuhnya interaktif)</p>
        <p>Performance Score: ${performanceScore}/100 (Skor keseluruhan performa halaman)</p>
    `;
}
