
import React, { useState } from "react";
import axios from "axios";

import {
    MapContainer,
    TileLayer,
    CircleMarker,
    Popup
} from "react-leaflet";

import { Bar, Pie } from "react-chartjs-2";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Tooltip,
    Legend
} from "chart.js";

import "leaflet/dist/leaflet.css";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Tooltip,
    Legend
);

const API = "http://127.0.0.1:5000";

function App() {
    const [summary, setSummary] = useState(null);
    const [locations, setLocations] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [message, setMessage] = useState("");

    const uploadFile = async (event) => {
        const file = event.target.files[0];

        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            setMessage("Uploading data...");

            await axios.post(`${API}/api/upload`, formData);

            const [
                summaryResponse,
                locationResponse,
                languageResponse,
                recommendationResponse
            ] = await Promise.all([
                axios.get(`${API}/api/summary`),
                axios.get(`${API}/api/locations`),
                axios.get(`${API}/api/languages`),
                axios.get(`${API}/api/recommendations`)
            ]);

            setSummary(summaryResponse.data);
            setLocations(locationResponse.data);
            setLanguages(languageResponse.data);
            setRecommendations(recommendationResponse.data);

            setMessage("Data uploaded successfully!");

        } catch (error) {
            setMessage(
                error.response?.data?.error ||
                "Unable to connect to backend."
            );
        }
    };

    const cityChartData = {
        labels: locations.map(item => item.city),
        datasets: [{
            label: "Views",
            data: locations.map(item => item.views)
        }]
    };


    const languageColors = [
        "#8B5CF6", // Purple
        "#22D3EE", // Cyan
        "#F59E0B", // Orange
        "#EC4899", // Pink
        "#10B981", // Green
        "#6366F1", // Indigo
        "#EF4444"  // Red
    ];

    const languageChartData = {
        labels: languages.map(item => item.language),
        datasets: [{
            label: "Language-wise views",
            data: languages.map(item => item.views),
            backgroundColor: languages.map(
                (_, index) => languageColors[index % languageColors.length]
            ),
            borderColor: "#172037",
            borderWidth: 3,
            hoverOffset: 12
        }]
    };

    return (
        <div className="app">

            <header>
                <h1>GeoView ✦</h1>
                <p>
                    Discover your audience.
                    Understand your reach.
                    Grow smarter.
                </p>
            </header>

            <main>

                <section className="upload">
                    <h2>Audience Analytics</h2>
                    <p>
                        Upload your social media analytics CSV file.
                    </p>

                    <input
                        type="file"
                        accept=".csv"
                        onChange={uploadFile}
                    />

                    <p>{message}</p>
                </section>

                {summary && (
                    <>

                        <section className="stats">

                            <div className="stat-card">
                                <h3>Total Views</h3>
                                <p>
                                    {summary.total_views.toLocaleString()}
                                </p>
                            </div>

                            <div className="stat-card">
                                <h3>Audience Locations</h3>
                                <p>{summary.total_locations}</p>
                            </div>

                            <div className="stat-card">
                                <h3>Platforms</h3>
                                <p>{summary.total_platforms}</p>
                            </div>

                            <div className="stat-card">
                                <h3>Top City</h3>
                                <p>{summary.top_city}</p>
                            </div>

                            <div className="stat-card">
                                <h3>Top Language</h3>
                                <p>{summary.top_language}</p>
                            </div>

                        </section>

                        <section className="panel">
                            <h2>Geographical Audience Map</h2>

                            <MapContainer
                                center={[20, 78]}
                                zoom={4}
                                style={{
                                    height: "450px",
                                    width: "100%"
                                }}
                            >
                                <TileLayer
                                    attribution="&copy; OpenStreetMap contributors"
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />

                                {locations.map((item, index) => (
                                    <CircleMarker
                                        key={index}
                                        center={[
                                            item.latitude,
                                            item.longitude
                                        ]}
                                        radius={Math.max(
                                            6,
                                            Math.min(25, item.views / 1000)
                                        )}
                                    >
                                        <Popup>
                                            <strong>{item.city}</strong>
                                            <br />
                                            Views: {item.views}
                                        </Popup>
                                    </CircleMarker>
                                ))}
                            </MapContainer>
                        </section>

                        <section className="panel">
                            <h2>City-wise View Comparison</h2>
                            <Bar data={cityChartData} />
                        </section>

                        <section className="panel">
                            <h2>Language Intelligence</h2>

                            {languages.length > 0 ? (
                                <>
                                    <p>
                                        Distribution of views by
                                        recorded language.
                                    </p>

                                    <Pie
                                        data={languageChartData}
                                        options={{
                                            responsive: true,
                                            plugins: {
                                                legend: {
                                                    position: "bottom",
                                                    labels: {
                                                        color: "#F8FAFC",
                                                        padding: 20,
                                                        usePointStyle: true,
                                                        font: {
                                                            size: 13
                                                        }
                                                    }
                                                },
                                                tooltip: {
                                                    callbacks: {
                                                        label: function (context) {
                                                            return context.label + ": " +
                                                                context.parsed.toLocaleString() + " views";
                                                        }
                                                    }
                                                }
                                            }
                                        }}
                                    />
                                    <div className="language-list">
                                        {languages.map((item, index) => (
                                            <div
                                                className="recommendation"
                                                key={index}
                                            >
                                                <h3>{item.language}</h3>
                                                <p>
                                                    {item.views.toLocaleString()}
                                                    {" "}views
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <p>
                                    No verified language data is available.
                                    Add a language column to your CSV.
                                </p>
                            )}
                        </section>

                        <section className="panel">
                            <h2>Audience Recommendations</h2>

                            {recommendations.map((item, index) => (
                                <div
                                    className="recommendation"
                                    key={index}
                                >
                                    <h3>{item.title}</h3>
                                    <p>{item.message}</p>
                                </div>
                            ))}
                        </section>

                    </>
                )}

            </main>

            <footer>
                <p>
                    GeoView | AI-Powered Geographical Video
                    Audience Intelligence
                </p>
            </footer>

        </div>
    );
}

export default App;
