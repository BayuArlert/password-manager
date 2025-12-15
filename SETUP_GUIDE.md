# Setup Guide - PixelPass Password Manager 🔐

## ❗ Catatan Penting Sebelum Mulai

**Backend sudah siap!** Dependencies sudah terinstall dengan sukses. Sekarang tinggal setup MySQL database.

---

## 🗄️ Setup MySQL Database

### Option 1: Install MySQL Server (Recommended)

1. **Download MySQL**:
   - Download dari: https://dev.mysql.com/downloads/installer/
   - Pilih "MySQL Installer for Windows"
   - Install MySQL Server + MySQL Workbench

2. **Start MySQL Service**:
   ```powershell
   # Check if MySQL service is running
   Get-Service -Name MySQL*
   
   # Start MySQL service
   net start MySQL80  # atau MySQL nama service Anda
   ```

3. **Create Database**:
   ```bash
   # Login ke MySQL
   mysql -u root -p
   
   # Create database
   CREATE DATABASE password_manager;
   exit;
   ```

4. **Update .env file**:
   ```bash
   cd backend
   cp .env.example .env
   ```
   
   Edit `.env`:
   ```
   DATABASE_URL=mysql+pymysql://root@localhost:3306/password_manager
   SECRET_KEY=ganti-dengan-secret-key-random-panjang
   MASTER_KEY_SALT=ganti-dengan-salt-random
   ```

### Option 2: Using XAMPP (Easier)

1. **Download XAMPP**:
   - Download dari: https://www.apachefriends.org/
   - Install XAMPP

2. **Start MySQL**:
   - Buka XAMPP Control Panel
   - Klik "Start" pada MySQL

3. **Create Database**:
   - Klik "Admin" pada MySQL di XAMPP
   - Buka phpMyAdmin
   - Create database: `password_manager`

4. **Update .env**:
   ```
   DATABASE_URL=mysql+pymysql://root:@localhost:3306/password_manager
   SECRET_KEY=ganti-dengan-secret-key-random-panjang
   MASTER_KEY_SALT=ganti-dengan-salt-random
   ```
   (default XAMPP MySQL tidak pakai password)

---

## 🚀 Run Backend

Setelah MySQL running:

```bash
cd backend
python main.py
```

Backend akan running di: **http://localhost:8000**

API Docs: **http://localhost:8000/docs**

Jika sukses, Anda akan lihat:
```
🚀 Initializing database...
✅ Database initialized!
INFO: Application startup complete.
INFO: Uvicorn running on http://0.0.0.0:8000
```

---

## 📱 Setup Frontend PWA

1. **Install Node.js** (jika belum):
   - Download dari: https://nodejs.org/
   - Install versi LTS

2. **Install Dependencies**:
   ```bash
   cd frontend-pwa
   npm install
   ```

3. **Update API URL**:
   
   Edit `frontend-pwa/src/services/api.ts`:
   ```typescript
   // Untuk development:
   const API_URL = 'http://localhost:8000';
   
   // Untuk akses dari HP (cek IP dengan: ipconfig):
   const API_URL = 'http://192.168.1.100:8000';  // Ganti dengan IP Anda
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```
   
   PWA akan running di: **http://localhost:5173**

5. **Akses dari Desktop**:
   - Buka browser: `http://localhost:5173`
   - Install PWA: Klik icon install di address bar (Chrome/Edge)

6. **Akses dari Android**:
   - Pastikan HP dan komputer dalam 1 network WiFi
   - Buka Chrome/Edge di HP
   - Akses: `http://YOUR_IP:5173` (ganti YOUR_IP dengan IP komputer)
   - Tap menu (⋮) → "Install app" atau "Add to Home Screen"
   - App akan muncul di launcher seperti native app!

7. **Allow Firewall** (jika perlu):
   ```powershell
   netsh advfirewall firewall add rule name="Vite Dev Server" dir=in action=allow protocol=TCP localport=5173
   ```

---

## ✅ Checklist

- [ ] MySQL server installed & running
- [ ] Database `password_manager` created
- [ ] `.env` file sudah dikonfigurasi
- [ ] Backend running di http://localhost:8000
- [ ] Node.js & npm terinstall
- [ ] Frontend PWA dependencies installed (`npm install` di folder `frontend-pwa`)
- [ ] API URL di `api.ts` sudah diupdate
- [ ] Frontend PWA running (`npm run dev`)
- [ ] PWA accessible di http://localhost:5173
- [ ] (Optional) PWA installed di Android via "Add to Home Screen"

---

## 🐛 Troubleshooting

### Backend Errors

**"Can't connect to MySQL"**:
- Pastikan MySQL service running (`net start MySQL80`)
- Check database sudah dibuat
- Check `.env` DATABASE_URL sudah benar

**"ModuleNotFoundError"**:
```bash
pip install -r requirements.txt
```

### Frontend Errors

**"Cannot find module"**:
```bash
npm install
```

**"Network error" di PWA**:
- Pastikan backend running di port 8000
- Pastikan frontend running di port 5173
- Jika akses dari HP: pastikan phone & komputer dalam 1 network WiFi
- Update API_URL dengan IP komputer (bukan localhost) untuk akses dari HP
- Allow firewall Windows:
  ```powershell
  # Backend
  netsh advfirewall firewall add rule name="Python API" dir=in action=allow protocol=TCP localport=8000
  
  # Frontend PWA
  netsh advfirewall firewall add rule name="Vite Dev Server" dir=in action=allow protocol=TCP localport=5173
  ```

---

## 🎯 Next Steps

Setelah semua running:

1. Buka PWA di browser (`http://localhost:5173`)
2. Install PWA ke device (desktop atau Android)
3. Create master password (first launch)
4. Enable biometric/WebAuthn (optional)
5. Add password pertama!
6. Test copy password feature
7. Test offline functionality (Service Worker)

---

**Need help?** Error yang Anda alami sebelumnya sudah fix:
- ✅ Pydantic compatibility untuk Python 3.13 ✓
- ✅ PBKDF2HMAC import ✓
- ⏳ MySQL connection (tinggal start MySQL server)
