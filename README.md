# PixelPass - Password Manager 🔐

Full-stack password manager dengan pixel art theme dan soft color palette. Terenkripsi dengan AES-256.

## 🎨 Features

- ✅ Master password + biometric authentication
- ✅ AES-256 encryption untuk semua password
- ✅ Password generator otomatis (16 karakter)
- ✅ Categories dengan custom colors
- ✅ Activity history/audit log
- ✅ Auto-lock (1 menit inaktivitas)
- ✅ Clipboard auto-clear (30 detik)
- ✅ Pixel art theme dengan soft colors (blue, pink, purple)

## 🛠️ Tech Stack

**Frontend:**
- React + TypeScript + Vite
- Progressive Web App (PWA) - bisa diinstall di Android/iOS
- WebAuthn untuk biometric authentication
- Service Worker untuk offline support
- Pixel art themed UI components

**Backend:**
- FastAPI + Python
- MySQL + SQLAlchemy ORM
- bcrypt untuk master password hashing
- Fernet (AES-256) untuk password encryption

## 📦 Installation

### Backend Setup

1. Install dependencies:
```bash
cd backend
pip install -r requirements.txt
```

2. Setup MySQL database:
```sql
CREATE DATABASE password_manager;
```

3. Create `.env` file:
```
DATABASE_URL=mysql+pymysql://root:@localhost:3306/password_manager
SECRET_KEY=your-secret-key-here
MASTER_KEY_SALT=your-salt-here
```

4. Run server:
```bash
python main.py
# atau
uvicorn main:app --reload
```

Backend akan berjalan di `http://localhost:8000`

### Frontend PWA Setup

1. Install dependencies:
```bash
cd frontend-pwa
npm install
```

2. Update API URL di `src/services/api.ts`:
```typescript
const API_URL = 'http://localhost:8000';  // atau IP komputer untuk akses dari device lain
```

3. Run development server:
```bash
npm run dev
```

4. Akses PWA:
- **Desktop**: Buka `http://localhost:5173` di browser
- **Mobile**: Buka `http://YOUR_IP:5173` dari browser HP (pastikan 1 network WiFi)

5. Install PWA di Android:
- Buka di Chrome/Edge
- Tap menu (⋮) → "Install app" atau "Add to Home Screen"
- App akan muncul seperti native app di launcher!

## 🎮 Usage

1. **First Launch**: Setup master password (minimal 8 karakter)
2. **Enable Biometric**: Optional fingerprint/face unlock
3. **Add Password**: Tap + button, fill form, atau generate password
4. **View Password**: Tap password card untuk lihat detail
5. **Copy Password**: Masukkan master password untuk decrypt & copy
6. **Edit/Delete**: Dari detail screen
7. **Categories**: Manage kategori di tab Categories
8. **History**: Lihat audit log di tab History

## 🎨 Soft Color Palette

- Soft Blue: `#B4C7E7`
- Soft Pink: `#F4C2C2`
- Soft Purple: `#D5B3E0`
- Background: `#F0F4FF` & `#FAF5FF`
- Card: `#FFFFFF`

## 🔒 Security

- Master password hashed dengan bcrypt
- Passwords encrypted dengan AES-256 (Fernet)
- Key derivation dengan PBKDF2 (100,000 iterations)
- Secure storage dengan expo-secure-store
- Zero-knowledge architecture (server tidak bisa decrypt password)

## 📱 Deployment

**Backend**: Deploy ke Railway, Render, atau VPS

**Frontend PWA**: 
- Build production: `npm run build`
- Deploy ke Vercel, Netlify, atau GitHub Pages
- PWA otomatis bisa diinstall di Android/iOS dari browser

## 🐛 Troubleshooting

**Backend connection failed**: 
- Pastikan backend sudah running di port 8000
- Update API_URL di `src/services/api.ts`
- Pastikan firewall tidak blocking port 5173 (frontend) dan 8000 (backend)

**PWA tidak bisa diinstall**:
- Pastikan menggunakan HTTPS atau localhost
- Cek Service Worker terdaftar di DevTools → Application → Service Workers

**Biometric/WebAuthn not working**:
- WebAuthn hanya bekerja di HTTPS (kecuali localhost)
- Pastikan browser support WebAuthn (Chrome, Edge, Safari)
- Pastikan device memiliki fingerprint/face unlock

## 📄 License

MIT
