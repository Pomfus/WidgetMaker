# IPS Ticker Widget Builder

An aviation-themed, highly customizable OBS widget builder for YouTube Creators. This tool allows you to transform your YouTube "Members list" CSV export into a professional, animated scrolling ticker with 100+ HUD-style themes.

## 🚀 Getting Started

### 1. Requirements
- A **YouTube Members List CSV**: Export this from your YouTube Studio > Earn > Memberships > See All > Export List.
- **OBS Studio**: To host the generated browser source.
- **Gemini API Key**: Used to automatically analyze your CSV structure and generate community insights.

### 2. Setup
1. Fork or Clone this repository.
2. Open `index.tsx` and paste your Gemini API Key in the `process.env.API_KEY` placeholder.
3. Host the folder using GitHub Pages, a local server, or use the provided Electron wrapper.

### 3. Usage
1. **Upload**: Drag and drop your `Members_list.csv` into the builder.
2. **Customize**: Use the **Control Tower** to select from 100+ tactical themes, adjust scroll speed, font sizing, and HUD geometry.
3. **Deploy**: Click "Deploy Widget Package" to download a standalone `.html` file.
4. **OBS Setup**:
   - Add a new **Browser Source** in OBS.
   - Check **Local File** and select your downloaded `.html` file.
   - Match the **Width** and **Height** to the dimensions you set in the builder.

## 🛠 Features
- **100+ Tactical Themes**: From "Fighter Wing" to "Cyber Ops".
- **Intelligent CSV Analysis**: Powered by Google Gemini to handle changing YouTube export formats.
- **Standalone Export**: Generates a zero-dependency HTML file that works offline in OBS.
- **HUD HUD Interaction**: Real-time preview with vertical alignment and letter-spacing controls.

## 🔒 Security Note
This is a client-side application. If you host the builder publicly, your API key will be embedded in the JS source. For maximum security, host the builder locally or on a private server. The *exported* widgets do not contain your API key.

---
*Created for the IPS Community. Fly safe.*