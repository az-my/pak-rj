const API_SPPD_ADD = "https://rj.up.railway.app/api/google-sheets/sppd-add";

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

const alertMessage = document.createElement("span");
alertMessage.id = "alert-message";
alert.appendChild(alertMessage);

closeAlert.addEventListener("click", () => {
    alertContainer.classList.add("hidden");
});

// Helper function to format a date as DD/MM/YYYY
const formatDateToDDMMYYYY = (dateStr) => {
    const [year, month, day] = dateStr.split("-").map(Number); // Assuming the input is in YYYY-MM-DD format
    return `${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}/${year}`;
};

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const hotelCheckbox = document.getElementById("hotel");

    const tanggalMulai = formatDateToDDMMYYYY(formData.get("tanggalMulai"));
    const tanggalSampai = formatDateToDDMMYYYY(formData.get("tanggalSampai"));

    const data = {
        namaDriver: formData.get("namaDriver"),
        asalBerangkat: document.getElementById("asalBerangkat").value,
        unit: document.getElementById("unit").value,
        pemberiTugas: document.getElementById("pemberiTugas").value,
        tujuan: formData.get("tujuan"),
        maksud_perjalanan: formData.get("maksud_perjalanan"),
        tanggalMulai,
        tanggalSampai,
        durasi: document.getElementById("durasi").value,
        budgetBiayaHarian: document.getElementById("budgetBiayaHarian").value,
        budgetBiayaPenginapan: document.getElementById("budgetBiayaPenginapan").value,
        totalBiayaHarian: document.getElementById("totalBiayaHarian").value,
        totalBiayaPenginapan: document.getElementById("totalBiayaPenginapan").value,
        totalBiayaSPPD: document.getElementById("totalBiayaSPPD").value,
        hotel: hotelCheckbox.checked ? "Yes" : "No",
    };

    console.log("Submitted Data:", JSON.stringify(data, null, 2));

    try {
        const response = await fetch(API_SPPD_ADD, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.ok) {
            alertTitle.textContent = "Success";
            alertMessage.textContent = result.message;
            alert.className =
                "bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative";
            alertContainer.classList.remove("hidden");
            // Optional: Refresh data if fetchData is defined
            if (typeof fetchData === "function") {
                fetchData();
            }
            // Clear form and reload page after 3 seconds
            setTimeout(() => {
                form.reset();
                alertContainer.classList.add("hidden");
                // location.reload(); // Reload the page
            }, 3000); // 3 seconds delay
        } else {
            alertTitle.textContent = "Error";
            alertMessage.textContent = result.error || "An error occurred.";
            alert.className =
                "bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative";
            alertContainer.classList.remove("hidden");
        }
    } catch (error) {
        alertTitle.textContent = "Error";
        alertMessage.textContent = "An error occurred while processing your request.";
        alert.className =
            "bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative";
        alertContainer.classList.remove("hidden");
    }
});
