# Panduan Deployment 100% BEBAS KARTU KREDIT (PythonAnywhere + Vercel)

Solusi ini menggunakan **PythonAnywhere** untuk Backend+Database dan **Vercel** untuk Frontend. Keduanya memiliki tier gratis yang **tidak meminta kartu kredit**.

## Langkah 1: Backend & Database (PythonAnywhere)

1. **Daftar Akun**
   - Buka [www.pythonanywhere.com](https://www.pythonanywhere.com/)
   - Klik "Pricing & Signup" -> "Create a Beginner account".
   - Isi data (gratis, tanpa kartu kredit).

2. **Upload Kode**
   - Setelah login, buka tab **"Consoles"** -> **"Bash"**.
   - Clone kode Anda dari GitHub:
     ```bash
     git clone https://github.com/username-anda/repo-anda.git mysite
     ```
     *(Ganti URL dengan repository GitHub Anda)*

3. **Install Dependencies**
   - Di console bash tadi, jalankan:
     ```bash
     cd mysite/backend
     pip install -r requirements.txt
     ```

4. **Konfigurasi Web App**
   - Buka tab **"Web"**.
   - Klik **"Add a new web app"**.
   - Pilih **"Manual configuration (including Flask, Bottle, etc.)"**.
   - Pilih **Python 3.10** (atau versi terbaru yang tersedia).
   - Setelah web app dibuat, scroll ke bawah bagian **"Code"**:
     - **Source code**: `/home/usernameAnda/mysite/backend`
     - **WSGI configuration file**: Klik link file tersebut (biasanya `/var/www/..._wsgi.py`).
   - Hapus semua isi file WSGI bawaan, ganti dengan ini:
     ```python
     import sys
     path = '/home/usernameAnda/mysite/backend'
     if path not in sys.path:
         sys.path.append(path)

     from wsgi import application
     ```
     *(Ganti `usernameAnda` dengan username PythonAnywhere Anda)*
   - Klik **Save**.

5. **Setup Database MySQL (GRATIS)**
   - Buka tab **"Databases"**.
   - Di bagian "Create a database", masukkan nama (misal `pwdmgr`) lalu klik **Create**.
   - Catat detail koneksi:
     - **Host**: `usernameAnda.mysql.pythonanywhere-services.com`
     - **Username**: `usernameAnda`
     - **Password**: (Password yang Anda set di tab Database)
     - **Database Name**: `usernameAnda$pwdmgr`

6. **Sambungkan Aplikasi ke Database**
   - Kembali ke tab **"Files"**.
   - Masuk ke folder `mysite/backend`.
   - Buat file baru bernama `.env`.
   - Isi dengan format ini:
     ```env
     DATABASE_URL=mysql+pymysql://usernameAnda:passwordDB@usernameAnda.mysql.pythonanywhere-services.com/usernameAnda$pwdmgr
     MASTER_KEY_SALT=rahasia123
     ```
   - Klik **Save**.
   - Buka tab **"Web"** lagi, lalu klik tombol hijau **"Reload"**.

   ✅ **Backend Selesai!** Alamat API Anda adalah `http://usernameAnda.pythonanywhere.com`.

---

## Langkah 2: Frontend (Vercel)

1. **Update Kode API Frontend**
   - Di laptop Anda, edit file `c:\Users\USER\Documents\app_manage_pw\frontend-pwa\src\services\api.ts`.
   - Ganti `API_URL` menjadi alamat PythonAnywhere Anda:
     ```typescript
     const API_URL = import.meta.env.PROD
         ? 'https://usernameAnda.pythonanywhere.com' 
         : 'http://localhost:8000';
     ```
   - Push perubahan ini ke GitHub.

2. **Deploy Vercel**
   - Buka [Vercel.com](https://vercel.com/) (Daftar pakai GitHub, gratis tanpa CC).
   - "New Project" -> Import repository GitHub Anda.
   - Root Directory: Pilih folder `frontend-pwa` (klik Edit).
   - Klik **Deploy**.

   ✅ **Selesai!** Aplikasi Anda sekarang online selamanya di alamat Vercel (misal `https://pwdmgr.vercel.app`).
