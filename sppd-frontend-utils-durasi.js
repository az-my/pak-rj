
document.addEventListener("DOMContentLoaded", () => {
    const tanggalMulaiInput = document.getElementById("tanggalMulai");
    const tanggalSampaiInput = document.getElementById("tanggalSampai");
    const durasiDisplay = document.getElementById("durasi");

    const calculateDurasi = () => {
        console.clear(); // Clear console for cleaner logs
        console.log("=== Durasi Calculation Process ===");

        if (tanggalMulaiInput.value && tanggalSampaiInput.value) {
            const startDate = moment(tanggalMulaiInput.value, "YYYY-MM-DD");
            const endDate = moment(tanggalSampaiInput.value, "YYYY-MM-DD");

            // console.log("Input Received:");
            // console.log("Start Date:", tanggalMulaiInput.value);
            // console.log("End Date:", tanggalSampaiInput.value);

            if (endDate.isSameOrAfter(startDate)) {
                const diffDays = endDate.diff(startDate, "days") + 1; // Include both start and end dates

                // console.log("Calculation Details:");
                // console.log("Start Date (Moment):", startDate.format("YYYY-MM-DD"));
                // console.log("End Date (Moment):", endDate.format("YYYY-MM-DD"));
                // console.log("Final Duration (days):", diffDays);

                // Set the calculated duration into the element's innerHTML
                durasiDisplay.value = diffDays;
            } else {
                console.log("Error: End Date is earlier than Start Date.");
                alert("Tanggal Sampai harus lebih besar atau sama dengan Tanggal Mulai.");
                tanggalSampaiInput.value = "";
                durasiDisplay.innerHTML = "";
            }
        } else {
            console.log("One or both date inputs are empty.");
            durasiDisplay.innerHTML = "";
        }

        // console.log("Final Output:");
        // console.log("Durasi Display Value:", durasiDisplay.innerHTML);
    };

    tanggalMulaiInput.addEventListener("change", calculateDurasi);
    tanggalSampaiInput.addEventListener("change", calculateDurasi);
});

