# GEAR UP — India-First AI-Powered Two-Wheeler Marketplace

> **"Buy smarter. Sell better. Ride with confidence."**

GEAR UP is an intelligent used two-wheeler marketplace connecting individual buyers, sellers, certified inspection partners, and local dealers across major Indian cities (Chandigarh, Mohali, Panchkula, Delhi NCR, Bengaluru, Pune, Mumbai, Jaipur).

---

## 🗺️ 1. Google Maps Platform & Interactive Discovery (`/explore`)

### Google Maps Platform Architecture
- **Dual Engine Architecture**: Supports live **Google Maps JavaScript API** with an automatic, zero-crash fallback to high-accuracy **OpenStreetMap / CartoDB** tiles.
- **Engine Switcher**: Users can toggle between *Google Maps* and *OSM Tiles* directly from the map control toolbar.
- **Marker Synchronization**:
  - Custom SVG markers for **Motorcycles**, **Scooters**, and **Electric EVs** with asking price badges.
  - Clicking a marker opens a preview card (image, model, price, distance, and "View Details" button).
  - Clicking a card centers and highlights the corresponding map marker.
- **Dynamic Radius Filtering**:
  - Radius circles: `2 km`, `5 km`, `10 km`, `15 km`, `25 km`, `50 km`, `Anywhere`, plus a **Custom Radius Slider** (1–100 km).
  - Visible translucent radius overlay drawn around the search center.
  - Distances computed using true **Haversine** geometric formulas from exact coordinates.
- **Relocate Search Center**:
  - Tap anywhere on the map to relocate the search center.
  - Quick-switch between popular Indian hubs (Chandigarh, Delhi, Bangalore, etc.).
  - "Current Location" button with explicit browser GPS permission.

### Google Maps Cloud Setup Instructions
To activate the live Google Maps Platform layer:
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create or select your Google Cloud project and enable **Billing**.
3. Enable the following APIs in **APIs & Services > Library**:
   - **Maps JavaScript API**
   - **Places API** (for address autocomplete)
   - **Geocoding API**
4. Navigate to **APIs & Services > Credentials** and click **Create Credentials > API Key**.
5. Set API Restrictions:
   - Restrict key to *Maps JavaScript API*, *Places API*, and *Geocoding API*.
   - Under *Application restrictions*, restrict to HTTP referrers:
     - `http://localhost:5173/*` (Local dev)
     - `https://yourdomain.com/*` (Production)
6. Add the key to `client/.env`:
   ```bash
   VITE_GOOGLE_MAPS_API_KEY=AIzaSyYourSecretKeyHere
   ```
*(Note: If the key is omitted or billing is not yet enabled, GEAR UP automatically runs the OpenStreetMap fallback so the map never crashes or stays blank).*

---

## 🤖 2. AI Bike Buddy — Two-Wheeler Mechanic & Expert Assistant (`/ai-buddy`)

AI Buddy specializes exclusively in two-wheelers, functioning as a 24/7 master mechanic, riding expert, and ownership advisor.

### Technical & Mechanical Capabilities
- **Engine & Starting**: Troubleshoots rapid clicking sounds, starter relay chatter, dead batteries, spark plug carbon fouling, and carburetor/FI priming issues.
- **Battery & Electricals**: 12V multimeter testing thresholds, RR unit (regulator-rectifier) failure, stator coil diagnostics, and parasitic draw.
- **Brakes & Tyres**: Spongy hydraulic levers, air bleeding, disc rotor squeal, combi-brake equalizer tension, cold tyre pressures (22-25 PSI Front / 28-36 PSI Rear).
- **Scooter CVT & Transmission**: Clutch judder on 10–25 km/h pickup, worn variator rollers with flat spots, and drive belt slip.
- **Electric EVs**: Lithium-ion BMS cell balancing cycles, thermal throttling in Indian summers (42°C+), and regenerative braking optimization.
- **Sudden Mileage Drops**: Clogged air filters, binding drum brakes, dragging pads, and airbox leaks.
- **Drive Chain & Suspension**: Permissible chain slack (20–25mm), O-ring lubrication, front fork oil seal leaks, and steering head cone-set bearing wobble.

### Advanced AI Features
1. **📸 Image Understanding**: Attach photos of tyre wear, warning lights, oil leaks, or brake pads for instant cosmetic analysis.
2. **🎙️ Audio Engine Understanding**: Record unusual engine sounds or ask questions via microphone.
3. **🏍️ Personalized Vehicle Profile**: Select your bike (e.g. *Royal Enfield Classic 350, Honda Activa 6G, Ather 450X, Pulsar NS200*) to tailor all advice to that specific engine and powertrain.
4. **⚠️ Critical Safety Disclaimers**: Explicit warnings for safety-critical components (hydraulic brake failure, loose drive chains, tyre sidewall bulges).
5. **🛒 Marketplace Integration**: Seamlessly recommends matching verified rides from the live GEAR UP database.

---

## 🔒 3. Git Configuration & Security

The repository includes a clean, hardened `.gitignore` ensuring that credentials, environment secrets, and build outputs are never committed.

### Excluded Artifacts:
- `node_modules/`, `dist/`, `.vite/`, `.next/`, `build/`
- `.env`, `.env.local`, `.env.*.local`, `*.pem`, `*.key`
- Serverpod secrets (`serverpod_backend/config/passwords.yaml`)
- Flutter build outputs (`flutter_mobile/build/`, `.dart_tool/`)
- OS files (`.DS_Store`, `Thumbs.db`)

### How to Remove Accidentally Committed Secrets:
If an environment file or credential was ever tracked by Git in the past, run:
```bash
# Untrack without deleting the local file on your machine
git rm --cached .env
git rm --cached client/.env
git commit -m "chore: remove sensitive environment files from git tracking"
```

---

## 🏃 4. Running the Project

### Start Development Server
```bash
cd client
npm run dev
```
Open **[http://localhost:5173/](http://localhost:5173/)** in your browser.

### Verify Production Build
```bash
cd client
npm run build
```
