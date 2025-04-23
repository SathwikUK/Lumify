# ✨ Lumify - Low-Light Image Enhancer & Face Detector

Lumify is a web application for enhancing low-light images and detecting faces. It uses a PyTorch neural network(ZERO-DCE) and Flask for backend inference, and a beautiful React + Vite interface on the frontend.

---

## 🚀 Features
- 🌙 **Low-Light Image Enhancement** with Deep Curve Estimation
- 😎 **Face Detection & Annotation** with automatic bounding boxes
- 💾 **Download & Save** enhanced and annotated images
- 🖱️ **Drag-and-Drop / Click-to-Select** user experience

---

## 🧰 Tech Stack
- 🎨 **Frontend**: React, Vite, Axios, Framer Motion, Three.js
- 🧠 **Backend**: Flask, PyTorch, Pillow, face_recognition

---

## ⚙️ Prerequisites
Make sure your system has:
- 🟢 **Node.js** (v16 or above) and **npm**
- 🐍 **Python** (v3.12.7 or above)
- 🧱 **git**
- 🧰 **Visual Studio Build Tools** (for compiling native extensions)
- 🛠️ **CMake** (v3.15+)
- ⚡ (Optional) **CUDA-enabled GPU** for faster performance

---

## 📦 Installation

### 📁 Clone the Repository
```bash
git clone <your-repo-url>
cd Lumify
```

### 🔧 Backend Setup
```bash
cd server
python3 -m venv venv
source venv/bin/activate       # or venv\Scripts\activate (Windows)
pip install --upgrade pip
pip install -r requirements.txt
```

🧠 **Model Setup**  
Place `Epoch99.pth` in `server/snapshots/` and update `model_path` in `app.py`:
```python
model_path = os.path.join(os.getcwd(), 'snapshots', 'Epoch99.pth')
```

🔁 **(Optional) Train Model**
```bash
python lowlight_train.py \
  --data_dir data \
  --snapshots_folder snapshots \
  --epochs 100 \
  --batch_size 8
```

🚀 **Run Backend**
```bash
python app.py
```

### 🎨 Frontend Setup
```bash
cd ../client
npm install
npm run dev
```

---

## 🧪 Usage Guide

1. 🌐 Open `http://localhost:5173`
2. 🖼️ Upload an image on **Enhance** page
3. 🧪 Click **Enhance**
4. 🧍 View detected faces with bounding boxes
5. 💾 Use the download icon to save the result

---

## 🏗️ Build for Production

- **Frontend**:  
```bash
npm run build
```

- **Backend**:  
Use Gunicorn + environment configs for deployment.

---

## Project Structure
```
Lumify/
├── client/               # React + Vite frontend application
│   ├── public/           # Static assets
│   └── src/              # Components, pages, styles
├── server/               # Flask backend and PyTorch model
│   ├── data/             # Low-light dataset for training/testing
│   ├── snapshots/        # Saved model checkpoints
│   ├── uploads/          # Temporary uploaded images
│   ├── model.py          # Network architecture
│   ├── dataloader.py     # Dataset loader
│   ├── lowlight_train.py # Training script
│   ├── lowlight_test.py  # Testing script
│   └── app.py            # Flask application
└── README.md             # Project overview and setup
```



## 🛠️ Troubleshooting

- ❌ `ModelNotFoundError` → Check model path in `app.py`
- 🚫 CORS → Make sure `Flask-CORS` allows frontend origin
- ⚙️ Dependency issues → Double-check Python & Node versions

---



## 🙏 Acknowledgements
- 🧪 Deep Curve Estimation (low-light research)
- 🧍‍♂️ face_recognition
- ⚡ Vite & Framer Motion (amazing frontend experience)

  ---
  <p align="center">
  Made with ❤️ by BARS</a>
</p>

