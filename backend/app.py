from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
import json

from utils import extract_text, extract_skills, calculate_score

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# ---------------- HOME ----------------
@app.route("/")
def home():
    return "Resume Analyzer Running 🚀"

# ---------------- UPLOAD ----------------
@app.route("/upload", methods=["POST"])
def upload_resume():

    print("UPLOAD REQUEST RECEIVED")

    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]

    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)

    print("Saved file:", file.filename)

    # extract text
    text = extract_text(file_path)

    if not text.strip():
        return jsonify({
            "skills": [],
            "score": 0,
            "level": "Could not read file ❌"
        })

    # process
    skills = extract_skills(text)
    result = calculate_score(skills)

    return jsonify({
        "skills": skills,
        "score": result["score"],
        "level": result["level"]
    })

# ---------------- DOWNLOAD ----------------
@app.route("/download", methods=["POST"])
def download_report():

    try:
        data = request.json

        file_path = "resume_report.json"

        with open(file_path, "w") as f:
            json.dump(data, f, indent=4)

        return send_file(
            file_path,
            as_attachment=True,
            download_name="resume_report.json"
        )

    except Exception as e:
        print("Download error:", e)
        return jsonify({"error": "download failed"}), 500

# ---------------- RUN SERVER ----------------
if __name__ == "__main__":
    print("Server starting...")
    app.run(debug=True)