import os
import pdfplumber
import docx
import pytesseract
from PIL import Image

# OCR path (Windows)
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

# ---------------- SKILLS ----------------
SKILLS = [
    "python", "machine learning", "deep learning",
    "tensorflow", "keras", "pandas", "numpy",
    "flask", "django", "sql", "html", "css",
    "javascript", "aws", "mongodb"
]

# ---------------- TEXT EXTRACTION ----------------
def extract_text(file_path):

    text = ""
    ext = os.path.splitext(file_path)[1].lower()

    try:
        print("File received:", file_path)
        print("File type:", ext)

        # -------- PDF --------
        if ext == ".pdf":
            with pdfplumber.open(file_path) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text

        # -------- DOCX --------
        elif ext == ".docx":
            doc = docx.Document(file_path)
            for para in doc.paragraphs:
                text += para.text + " "

        # -------- IMAGE --------
        elif ext in [".png", ".jpg", ".jpeg"]:
            img = Image.open(file_path)
            text = pytesseract.image_to_string(img)

        else:
            print("Unsupported file type")

    except Exception as e:
        print("ERROR in extract_text:", e)
        return ""

    print("Extracted text length:", len(text))
    return text.lower()

# ---------------- SKILL EXTRACTION ----------------
def extract_skills(text):

    found = []

    for skill in SKILLS:
        if skill in text:
            found.append(skill)

    return found

# ---------------- SCORE CALC ----------------
def calculate_score(found_skills):

    total = len(SKILLS)

    if total == 0:
        return {"score": 0, "level": "Needs Improvement ❌"}

    score = (len(found_skills) / total) * 100

    # bonus logic
    if len(found_skills) >= 8:
        score += 5
    if len(found_skills) >= 12:
        score += 10

    score = min(int(score), 100)

    # level
    if score >= 80:
        level = "Excellent 🔥"
    elif score >= 60:
        level = "Good 👍"
    elif score >= 40:
        level = "Average ⚡"
    else:
        level = "Needs Improvement ❌"

    return {
        "score": score,
        "level": level
    }