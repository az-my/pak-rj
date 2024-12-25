const API_ADD = "https://rj.up.railway.app/api/google-sheets/add";

const form = document.getElementById("sppdForm");

const alertContainer = document.createElement("div");
alertContainer.id = "alert-container";
alertContainer.classList.add("hidden", "fixed", "top-5", "left-1/2", "transform", "-translate-x-1/2", "z-50");
document.body.appendChild(alertContainer);

const alert = document.createElement("div");
alert.id = "alert";
alertContainer.appendChild(alert);

const closeAlert = document.createElement("button");
closeAlert.textContent = "×";
closeAlert.classList.add("absolute", "top-2", "right-3", "text-xl", "text-gray-600", "hover:text-gray-800");
alert.appendChild(closeAlert);

const alertTitle = document.createElement("strong");
alertTitle.id = "alert-title";
alert.appendChild(alertTitle);

const alertMessage = document.createElement("p");
alertMessage.id = "alert-message";
alert.appendChild(alertMessage);

// Function to show alert
function showAlert(type, title, message) {
    alertTitle.textContent = title;
    alertMessage.textContent = message;

    if (type === "success") {
        alert.className =
            "max-w-sm w-full bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative";
    } else if (type === "error") {
        alert.className =
            "max-w-sm w-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative";
    }

    alertContainer.classList.remove("hidden");

    setTimeout(() => {
        alertContainer.classList.add("hidden");
    }, 3000);
}

closeAlert.addEventListener("click", () => {
    alertContainer.classList.add("hidden");
});

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    const data = {
        nama_driver: formData.get("namaDriver"),
        asal_berangkat: document.getElementById("asalBerangkat").value,
        unit: document.getElementById("unit").value,
        pemberi_tugas: document.getElementById("pemberiTugas").value,
        tujuan: formData.get("tujuan"),
        tanggal_mulai: formData.get("tanggalMulai"),
        tanggal_sampai: formData.get("tanggalSampai"),
        durasi: document.getElementById("durasi").value,
        budget_biaya_harian: document.getElementById("budgetBiayaHarian").value,
        budget_biaya_penginapan: document.getElementById("budgetBiayaPenginapan").value,
        total_biaya_harian: document.getElementById("totalBiayaHarian").value,
        total_biaya_penginapan: document.getElementById("totalBiayaPenginapan").value,
        total_biaya_sppd: document.getElementById("totalBiayaSPPD").value,
    };

    try {
        const response = await fetch(API_ADD, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (!response.ok) throw new Error(await response.text());

        const responseData = await response.json();

        form.reset();
        showAlert("success", "Success", "Entry added successfully!");
    } catch (error) {
        console.error("Submission Error:", error.message);
        showAlert("error", "Error", error.message);
    }
});
