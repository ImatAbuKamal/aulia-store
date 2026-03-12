# Proyek E-Commerce estetik.store dengan Next.js

Ini adalah proyek starter yang telah dikonversi menjadi aplikasi E-Commerce modern menggunakan Next.js (App Router), React, dan TypeScript. Aplikasi ini dirancang agar sepenuhnya dinamis, di mana semua data konten diambil dari Google Apps Script.

## Fitur Utama

- **Framework Modern**: Dibangun dengan Next.js 14+ (App Router) untuk performa optimal dan rendering sisi server.
- **Dinamis Penuh**: Semua data seperti produk, carousel, informasi "Tentang Kami", dan kontak diambil secara _real-time_ dari URL Google Apps Script.
- **Desain Responsif**: Tampilan yang menyesuaikan di berbagai perangkat, mulai dari ponsel hingga desktop.
- **Fungsionalitas E-Commerce**: Termasuk keranjang belanja, manajemen stok, dan proses checkout.
- **Integrasi Pembayaran**: Terhubung dengan Midtrans Snap untuk proses pembayaran yang mudah dan aman.
- **Kode Terstruktur**: Proyek dipecah menjadi komponen-komponen React yang rapi dan dapat digunakan kembali.

## 1. Konfigurasi

Sebelum menjalankan proyek, ada satu hal penting yang harus Anda konfigurasikan.

### a. Google Apps Script
Aplikasi ini mengambil semua datanya dari satu endpoint Google Apps Script. Pastikan Anda memiliki URL skrip yang sudah di-deploy.

Buka file `src/lib/config.ts` dan ganti nilai konstanta `APP_SCRIPT_URL` dengan URL Google Apps Script Anda.

```typescript
// src/lib/config.ts

export const APP_SCRIPT_URL = "URL_GOOGLE_APPS_SCRIPT_ANDA";
```

### b. Midtrans Client Key
Untuk menggunakan gateway pembayaran Midtrans, Anda perlu memasukkan `Client Key` Anda.

Buka file `src/app/layout.tsx` dan temukan tag `<script>` untuk Midtrans Snap. Ganti `data-client-key` dengan kunci milik Anda.

```tsx
// src/app/layout.tsx

<script 
  type='text/javascript' 
  src='https://app.sandbox.midtrans.com/snap/snap.js' 
  data-client-key='CLIENT_KEY_MIDTRANS_ANDA'
></script>
```
**Catatan**: Anda bisa mendapatkan `Client Key` dari dashboard Midtrans Anda (baik Sandbox maupun Produksi).

## 2. Menjalankan Proyek Secara Lokal

Untuk menjalankan proyek ini di komputer Anda, ikuti langkah-langkah berikut:

1.  **Install Dependensi**:
    Buka terminal di direktori proyek dan jalankan perintah:
    ```bash
    npm install
    ```

2.  **Jalankan Server Development**:
    Setelah instalasi selesai, jalankan perintah:
    ```bash
    npm run dev
    ```

3.  **Buka di Browser**:
    Buka browser Anda dan akses [http://localhost:3000](http://localhost:3000). Anda akan melihat aplikasi berjalan.

## 3. Menerbitkan ke GitHub

Untuk menyimpan kode Anda di GitHub, ikuti panduan ini:

1.  **Buat Repository Baru**:
    Pergi ke [GitHub](https://github.com/new) dan buat repository baru. Jangan inisialisasi dengan file README, .gitignore, atau lisensi.

2.  **Inisialisasi Git**:
    Di terminal, dalam direktori proyek Anda, jalankan:
    ```bash
    git init -b main
    ```

3.  **Tambahkan Semua File**:
    ```bash
    git add .
    ```

4.  **Buat Commit Pertama**:
    ```bash
    git commit -m "Initial commit: Setup E-Commerce Next.js Project"
    ```

5.  **Hubungkan ke Repository GitHub**:
    Ganti `<URL_REPOSITORY_ANDA>` dengan URL repository yang Anda buat tadi.
    ```bash
    git remote add origin <URL_REPOSITORY_ANDA>
    ```

6.  **Push ke GitHub**:
    ```bash
    git push -u origin main
    ```
Sekarang kode Anda sudah tersimpan dengan aman di GitHub.

## 4. Deployment ke Hosting

Proyek Next.js ini paling mudah di-deploy ke **Vercel**, platform dari pembuat Next.js.

### Menggunakan Vercel (Direkomendasikan)

1.  **Daftar/Login ke Vercel**:
    Kunjungi [vercel.com](https://vercel.com) dan buat akun menggunakan akun GitHub Anda.

2.  **Impor Proyek**:
    - Dari dashboard Vercel, klik "Add New... > Project".
    - Pilih repository GitHub yang baru saja Anda push.
    - Vercel akan otomatis mendeteksi bahwa ini adalah proyek Next.js dan mengatur semua konfigurasi build untuk Anda.

3.  **Deploy**:
    - Anda tidak perlu mengubah pengaturan apa pun. Cukup klik tombol **"Deploy"**.
    - Vercel akan memulai proses build dan deployment. Setelah beberapa saat, aplikasi Anda akan live di URL yang disediakan oleh Vercel.

Setiap kali Anda melakukan `git push` ke branch `main` di GitHub, Vercel akan secara otomatis mendeploy ulang versi terbaru dari aplikasi Anda.

## 5. Cara Kerja Integrasi Midtrans

Integrasi Midtrans dirancang untuk berinteraksi antara frontend (Next.js) dan backend (Google Apps Script).

1.  **Frontend (Checkout)**:
    - Saat pengguna mengklik tombol "Checkout" di `CartSidebar.tsx`, fungsi `handleCheckout` di `src/app/page.tsx` akan dipanggil.
    - Fungsi ini mengumpulkan detail pelanggan (nama, email, telepon) dan item di keranjang.
    - Data ini dikirim sebagai `payload` ke `APP_SCRIPT_URL` Anda dengan `action: "checkout"`.

2.  **Backend (Google Apps Script)**:
    - Skrip Anda harus menerima permintaan `POST` ini.
    - Skrip bertanggung jawab untuk:
        - Membuat transaksi baru di Midtrans menggunakan data yang diterima.
        - Mendapatkan `snapToken` dari Midtrans.
        - Menyimpan catatan pesanan (misalnya di Google Sheets) dengan status "pending".
        - Mengirim `snapToken` dan `orderId` kembali ke frontend sebagai respons JSON.

3.  **Frontend (Pembayaran)**:
    - `page.tsx` menerima `snapToken` dan memanggil `window.snap.pay(snapToken, ...)`.
    - Popup pembayaran Midtrans Snap akan muncul.
    - Setelah pembayaran berhasil (`onSuccess`), aplikasi akan mengirim permintaan `POST` lain ke `APP_SCRIPT_URL` dengan `action: "confirm"`, beserta `orderId` dan status transaksi.

4.  **Backend (Konfirmasi)**:
    - Skrip Anda menerima permintaan konfirmasi.
    - Skrip kemudian memperbarui status pesanan yang sesuai (misalnya di Google Sheets) menjadi "success" atau "paid" dan mengurangi stok produk.

Dengan alur ini, frontend tetap aman karena tidak pernah menangani kunci server (server key) Midtrans. Semua logika bisnis dan keamanan berada di sisi Google Apps Script.
