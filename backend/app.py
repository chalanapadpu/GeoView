
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd

app = Flask(__name__)
CORS(app)

audience_data = pd.DataFrame()


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "success",
        "message": "GeoView API is running!"
    })


@app.route("/api/upload", methods=["POST"])
def upload():
    global audience_data

    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    try:
        data = pd.read_csv(request.files["file"])

        required_columns = [
            "platform", "video_title", "city",
            "state", "country", "latitude",
            "longitude", "views"
        ]

        missing = [
            col for col in required_columns
            if col not in data.columns
        ]

        if missing:
            return jsonify({
                "error": "Missing columns: " + ", ".join(missing)
            }), 400

        # Language is optional. Unknown means it was not provided.
        if "language" not in data.columns:
            data["language"] = "Unknown"

        data["language"] = (
            data["language"]
            .fillna("Unknown")
            .astype(str)
            .str.strip()
            .replace("", "Unknown")
        )

        data["views"] = pd.to_numeric(
            data["views"], errors="coerce"
        ).fillna(0)

        data["latitude"] = pd.to_numeric(
            data["latitude"], errors="coerce"
        )
        data["longitude"] = pd.to_numeric(
            data["longitude"], errors="coerce"
        )

        data = data.dropna(
            subset=["latitude", "longitude"]
        )

        audience_data = data

        return jsonify({
            "message": "Data uploaded successfully!",
            "rows": len(data)
        })

    except Exception as error:
        return jsonify({"error": str(error)}), 400


@app.route("/api/summary", methods=["GET"])
def summary():
    if audience_data.empty:
        return jsonify({"message": "Upload data first"}), 400

    city_views = audience_data.groupby("city")["views"].sum()

    known_languages = audience_data[
        audience_data["language"].str.lower() != "unknown"
    ]

    if known_languages.empty:
        top_language = "Not available"
    else:
        top_language = (
            known_languages.groupby("language")["views"]
            .sum()
            .idxmax()
        )

    return jsonify({
        "total_views": int(audience_data["views"].sum()),
        "total_locations": int(audience_data["city"].nunique()),
        "total_platforms": int(audience_data["platform"].nunique()),
        "top_city": str(city_views.idxmax()),
        "top_language": str(top_language)
    })


@app.route("/api/locations", methods=["GET"])
def locations():
    if audience_data.empty:
        return jsonify([])

    grouped = audience_data.groupby(
        ["city", "state", "country", "latitude", "longitude"],
        as_index=False
    )["views"].sum()

    return jsonify(grouped.to_dict(orient="records"))


@app.route("/api/languages", methods=["GET"])
def languages():
    if audience_data.empty:
        return jsonify([])

    known = audience_data[
        audience_data["language"].str.lower() != "unknown"
    ]

    grouped = (
        known.groupby("language", as_index=False)["views"]
        .sum()
        .sort_values("views", ascending=False)
    )

    return jsonify(grouped.to_dict(orient="records"))


@app.route("/api/recommendations", methods=["GET"])
def recommendations():
    if audience_data.empty:
        return jsonify([])

    recommendations = []

    known = audience_data[
        audience_data["language"].str.lower() != "unknown"
    ]

    if known.empty:
        recommendations.append({
            "title": "Language data needed",
            "message": (
                "Add verified language information to your analytics "
                "to receive language-based content recommendations."
            )
        })
    else:
        language_views = (
            known.groupby("language")["views"]
            .sum()
            .sort_values(ascending=False)
        )

        top_language = language_views.index[0]

        recommendations.append({
            "title": "Popular audience language",
            "message": (
                f"{top_language} has the highest recorded views. "
                "Consider testing more content in this language."
            )
        })

        if len(language_views) > 1:
            second_language = language_views.index[1]

            recommendations.append({
                "title": "Explore another language",
                "message": (
                    f"{second_language} also has audience engagement. "
                    "Try a regional video or subtitles in this language."
                )
            })

    return jsonify(recommendations)


if __name__ == "__main__":
    app.run(debug=True, port=5000)
