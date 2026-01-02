# 📚 ReadSphere

An AI-powered reading platform — built to track reading progress, explore books by genre, and provide intelligent book assistance using AI.

ReadSphere is designed as a **full-stack product**, combining a modern Next.js frontend with a Python-based backend for ML/AI services.

---

## 🚀 Vision

> *To build a smart, personalized reading ecosystem where users don’t just read books — they understand, track, and grow with them.*

ReadSphere aims to:

* Track user reading (pages, progress, completion)
* Provide AI-powered book summaries & recommendations
* Offer genre-wise discovery with rich UI
* Become a scalable, real-world SaaS product

---

## 🏗️ Tech Stack

### Frontend

* **Next.js 15 (App Router)**
* **TypeScript**
* **Tailwind CSS**
* **Framer Motion** (animations)
* **Supabase** (database)
* **Clerk** (authentication)

### Backend

* **Python**
* **FastAPI**
* **Uvicorn**
* **Machine Learning / NLP services** (book summaries, recommendations)

---

## 📂 Project Structure

```
ReadSphere/
├── frontend/          # Next.js application
│   ├── app/
│   ├── components/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── backend/           # FastAPI / ML service
│   ├── main.py
│   ├── requirements.txt
│   └── ...
│
├── .gitignore
├── .env.example
└── README.md
```

---

## ✨ Key Features

### 📖 Reading Experience

* Genre-based book browsing
* Responsive book cards
* Animated UI with subtle backgrounds

### 📊 Progress Tracking (Planned)

* Page-by-page tracking
* Completion detection
* Reading streaks & stats

### 🤖 AI Capabilities (Planned)

* Book summaries on demand
* Smart recommendations
* Site-wide chatbot assistant

---

## 🧪 Local Development

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

---

## 🔐 Environment Variables

Environment variables are **not committed**.

Create your own using:

```
.env.example
```

---

## 📌 Roadmap

* [ ] Reading progress tracking
* [ ] PDF reader with page detection
* [ ] AI chatbot on every page
* [ ] User dashboards & analytics
* [ ] Public deployment
