let lastSkills = [];
let lastScore = 0;
let lastLevel = "";
let chartInstance = null;

function uploadResume() {

    const file = document.getElementById("file").files[0];

    if (!file) {
        alert("Select a file");
        return;
    }

    const formData = new FormData();
    formData.append("file", file);

    document.getElementById("output").innerText = "Analyzing...";

    fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData
    })
    .then(res => res.json())
    .then(data => {

        lastSkills = data.skills || [];
        lastScore = data.score || 0;
        lastLevel = data.level || "";

        document.getElementById("output").innerText =
            `Skills: ${lastSkills.join(", ") || "None"}\n` +
            `Score: ${lastScore}%\n` +
            `Level: ${lastLevel}`;

        drawChart(lastScore);
    })
    .catch(() => {
        document.getElementById("output").innerText = "Backend error";
    });
}

/* ---------------- GRAPH ---------------- */
function drawChart(score) {

    const ctx = document.getElementById("atsChart");

    if (!ctx) return;

    if (chartInstance) {
        chartInstance.destroy();
    }

    chartInstance = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: ["Score", "Remaining"],
            datasets: [{
                data: [score, 100 - score],
                backgroundColor: ["#00ff99", "#334155"]
            }]
        },
        options: {
            cutout: "70%",
            plugins: {
                legend: { display: false }
            }
        }
    });
}

/* ---------------- DOWNLOAD ---------------- */
function downloadReport() {

    fetch("http://localhost:5000/download", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            skills: lastSkills,
            score: lastScore,
            level: lastLevel
        })
    })
    .then(res => {
        if (!res.ok) throw new Error();
        return res.blob();
    })
    .then(blob => {

        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");

        a.href = url;
        a.download = "resume_report.json";

        document.body.appendChild(a);
        a.click();
        a.remove();
    })
    .catch(() => {
        alert("Download failed");
    });
}

/* ---------------- JOB MATCH ---------------- */
function matchJob() {

    const jobInput = document.getElementById("jobInput").value || "";
    const jobSkills = jobInput.split(",").map(s => s.trim()).filter(Boolean);

    fetch("http://localhost:5000/match", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            skills: lastSkills,
            job_skills: jobSkills
        })
    })
    .then(res => res.json())
    .then(data => {
        alert(
            `Match: ${data.match_score}%\nMissing: ${data.missing.join(", ")}`
        );
    })
    .catch(() => {
        alert("Match failed");
    });
}