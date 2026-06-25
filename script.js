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

   fetch("https://ai-resume-analyzer-6-ksi1.onrender.com/upload", {
  method: "POST",
  body: formData
})
.then(res => res.json())
.then(data => {
    console.log(data);

    document.getElementById("result").innerHTML =
        "Score: " + data.score + "<br>" +
        "Skills: " + data.skills;
})
.catch(err => {
    console.error(err);
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
function analyzeResume(text){
    let skills = ["html","css","javascript","python"];
    let score = 0;

    skills.forEach(skill=>{
        if(text.toLowerCase().includes(skill)){
            score += 25;
        }
    });

    return "Score: " + score + "%";
}
