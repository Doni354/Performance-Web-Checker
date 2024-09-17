# Performance-Web-Checker
 Performance Web Checker using PageSpeed Insight Api



Berikut adalah langkah-langkah untuk menggunakan PageSpeed Checker yang nantinya dapat ditambahkan ke file `README.md` di GitHub repo Anda:

---

## Cara Menggunakan PageSpeed Checker

PageSpeed Checker ini memungkinkan pengguna untuk memeriksa kinerja halaman web di berbagai perangkat (Desktop dan Mobile) dengan URL penuh dan asal. Ikuti langkah-langkah di bawah ini untuk menggunakan aplikasi:

### 1. Persiapan
Pastikan Anda sudah memiliki:
- Aplikasi PageSpeed Checker berjalan di server atau hosting.
- Koneksi internet yang stabil.

### 2. Langkah Penggunaan

1. **Buka Aplikasi**: Akses aplikasi PageSpeed Checker melalui URL yang telah disediakan.

2. **Masukkan URL yang Ingin Diperiksa**:
   - Pada kolom input, masukkan URL penuh dari halaman web yang ingin diperiksa (contoh: `https://www.contohwebsite.com`).
   - **Pastikan URL** dimulai dengan `http://` atau `https://`.

3. **Pilih Mode Perangkat**:
   - **Desktop**: Klik tombol "Desktop" untuk melakukan pengecekan kinerja halaman web pada perangkat Desktop.
   - **Mobile**: Klik tombol "Mobile" untuk melakukan pengecekan kinerja halaman web pada perangkat Mobile.

4. **Mulai Pemeriksaan**:
   - Tekan tombol **"Check Performance"** untuk memulai pemeriksaan PageSpeed pada URL yang dimasukkan.
   - **Catatan**: Saat tombol diklik, aplikasi akan memeriksa beberapa kombinasi:
     - **Desktop - URL Penuh**
     - **Desktop - URL Asal**
     - **Mobile - URL Penuh**
     - **Mobile - URL Asal**

5. **Tunggu Hasil**:
   - Aplikasi akan mulai memproses URL. Status "Sedang memproses..." akan ditampilkan selama proses berlangsung.
   - Setelah selesai, hasil pemeriksaan untuk kombinasi yang dipilih akan ditampilkan dalam tab yang sesuai.

6. **Lihat Hasil**:
   - Anda dapat melihat metrik PageSpeed seperti:
     - **Largest Contentful Paint (LCP)**: Mengukur waktu pemuatan elemen terbesar di layar.
     - **First Contentful Paint (FCP)**: Waktu hingga konten pertama muncul.
     - **Cumulative Layout Shift (CLS)**: Mengukur stabilitas tata letak halaman.
     - **Total Blocking Time (TBT)**: Total waktu blokir yang mencegah interaksi.
     - **Skor Performa**: Skor keseluruhan dari 0 hingga 100.
   - Hasil ditampilkan berdasarkan kategori **Baik**, **Memerlukan Peningkatan**, atau **Buruk**, dengan warna hijau, oranye, atau merah untuk memudahkan interpretasi.

### 3. Catatan Penting
- **URL Penuh** adalah URL lengkap yang dimasukkan pengguna.
- **URL Asal** adalah domain utama dari URL yang dimasukkan (misalnya, jika URL penuh adalah `https://www.contohwebsite.com/page`, maka URL Asal-nya adalah `https://www.contohwebsite.com`). (**DIHAPUS**)

### 4. Pesan Error
Jika terjadi kesalahan:
- Jika **URL tidak valid**, Anda akan melihat pesan "URL yang Anda masukkan tidak valid."
- Jika **data tidak dapat diambil** dari PageSpeed API, akan ditampilkan pesan "Data tidak ditemukan atau terjadi kesalahan."


### NOTE
Untuk url Asal fitur tersebut telah di **DIHAPUS**