
let chart; // global chart variable

function uploadResume() {

    let fileInput = document.getElementById("fileInput");

    if (fileInput.files.length === 0) {
        alert("Please select a file");
        return;
    }

    let formData = new FormData();
    formData.append("file", fileInput.files[0]);

    fetch("https://ai-resume-analyzer-6-ksi1.onrender.com/upload", {
        method: "POST",
        body: formData
    })
    .then(res => res.json())
    .then(data => {

        console.log(data);

        // SCORE
        let score = data.score || 0;
        document.getElementById("score").innerText = score + "%";

        // OUTPUT TEXT
        document.getElementById("output").innerText =
            "Skills Found: " + data.skills;

        // CHART UPDATE
        updateChart(score);

    })
    .catch(err => {
        console.error(err);
        alert("Error connecting to server");
    });
}


// ---------------- CHART ----------------
function updateChart(score) {

    let ctx = document.getElementById("atsChart").getContext("2d");

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {
        type: "doughnut",
        data: {
            datasets: [{
                data: [score, 100 - score],
                backgroundColor: ["#00ff99", "#333"]
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


// ---------------- DOWNLOAD ----------------
function downloadReport() {

    let score = document.getElementById("score").innerText;
    let skills = document.getElementById("output").innerText;

    let data = {
        score: score,
        skills: skills
    };

    fetch("https://ai-resume-analyzer-6-ksi1.onrender.com/download", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(res => res.blob())
    .then(blob => {

        let url = window.URL.createObjectURL(blob);
        let a = document.createElement("a");

        a.href = url;
        a.download = "resume_report.json";
        document.body.appendChild(a);
        a.click();
        a.remove();

    })
    .catch(err => {
        console.error(err);
        alert("Download failed");
    });
}
