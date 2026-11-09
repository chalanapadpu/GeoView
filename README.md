# 🌍 GeoView – Geographical Audience Intelligence Platform

### Don't just count your views. Discover where they come from.

**GeoView** is an interactive geographical audience intelligence platform that helps video creators understand where their audience comes from, analyse recorded language engagement, and discover useful content insights through visual analytics.

## 🚀 Live Demo

🌐 **Live Website:** https://geo-view-two.vercel.app

💻 **GitHub Repository:** https://github.com/chalanapadpu/GeoView

## 📌 Problem Statement

Content creators often focus on total views and engagement numbers but may find it difficult to understand the geographical distribution of their audience.

Without clear regional insights, creators may miss opportunities to create location-focused content and connect better with their viewers.

## 💡 Proposed Solution

GeoView transforms uploaded audience analytics data into meaningful geographical and language-wise insights through an interactive dashboard.

Users can upload a CSV file and explore audience distribution, compare regional performance, and view rule-based content recommendations.

## ✨ Key Features

- **CSV Data Upload:** Upload audience analytics data for analysis.
- **Interactive Geographical Map:** Visualize audience distribution across locations.
- **City-wise Analytics:** Compare views across different cities.
- **Language-wise Analysis:** Understand engagement using recorded language data.
- **Regional Insights:** Explore geographical audience patterns.
- **Smart Recommendations:** Receive rule-based suggestions to improve content strategies.
- **Interactive Dashboard:** View important audience metrics in one place.

## 🛠️ Technologies Used

| Component | Technologies |
|---|---|
| Frontend | React.js, Vite, CSS |
| Backend | Python, Flask, Flask-CORS |
| Data Processing | Pandas |
| Maps | Leaflet, React-Leaflet |
| Charts | Chart.js, React-Chart.js-2 |
| Data Input | CSV |
| Frontend Hosting | Vercel |
| Backend Hosting | Render |
| Version Control | Git, GitHub |

## ⚙️ Project Architecture

1. The user uploads a CSV file through the React frontend.
2. The frontend sends the file to the Flask backend.
3. Pandas processes and analyses the uploaded data.
4. The backend generates summary statistics, location data, language insights, and recommendations.
5. The frontend displays the results using maps, charts, and dashboard components.

## 📂 Project Structure

```text
GeoView/
│
├── backend/
│   ├── app.py
│   └── requirements.txt
│
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       └── style.css
│
├── dataset/
│   └── sample_audience.csv
│
├── .gitignore
└── README.md
```

## ▶️ Run Locally

### Prerequisites

- Python 3.10 or later
- Node.js and npm
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/chalanapadpu/GeoView.git
cd GeoView
```

### 2. Start the Backend

```bash
cd backend
pip install -r requirements.txt
python app.py
```

Backend runs at:

`http://127.0.0.1:5000`

### 3. Start the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:

`http://localhost:5173`

## 📊 Sample Dataset

A sample CSV file is included in the `dataset` folder to demonstrate the platform.

The dataset contains fields such as:

- Platform
- Video title
- City
- State
- Country
- Latitude
- Longitude
- Views
- Language

**Note:** The prototype analyses uploaded CSV data. The included sample dataset is for demonstration and does not represent live audience analytics.

## 🔮 Future Enhancements

- Integration with YouTube Analytics API and other supported platforms.
- AI-powered content recommendations.
- Audience growth prediction.
- Advanced regional engagement analysis.
- Additional interactive visualizations.

## 👥 Team Aurora

**Project:** GeoView  
**Tagline:** Don't just count your views. Discover where they come from.

**Team Leader:** Chalana P

**Team Members:**
1. Chalana P
2. Anvita Bhat
3. Chaithra M K
4. Ananya Shenoy K

**Institution:** A J Institute of Engineering and Technology, Mangalore.

## 🎯 Expected Impact

GeoView aims to help content creators make more informed content decisions by turning audience data into understandable geographical insights and actionable recommendations.

---

⭐ If you find this project interesting, feel free to explore the repository and try the live demo!

**Built with curiosity, creativity, and code by Team Aurora.**
