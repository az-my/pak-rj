document.addEventListener("DOMContentLoaded", () => {
    // Elements related to durasi calculation
    const tanggalMulaiInput = document.getElementById("tanggalMulai");
    const tanggalSampaiInput = document.getElementById("tanggalSampai");
    const durasiDisplay = document.getElementById("durasi");

    // Elements related to biaya calculation
    const budgetBiayaPenginapanInput = document.getElementById("budgetBiayaPenginapan");
    const totalBiayaPenginapanInput = document.getElementById("totalBiayaPenginapan");
    const budgetBiayaHarianInput = document.getElementById("budgetBiayaHarian");
    const totalBiayaHarianInput = document.getElementById("totalBiayaHarian");
    const totalBiayaSPPDInput = document.getElementById("totalBiayaSPPD");
    const hotelCheckbox = document.getElementById("hotel");
    const hotelSwitchBg = document.getElementById("hotelSwitchBg");
    const hotelSwitch = document.getElementById("hotelSwitch");
    const hotelStatus = document.getElementById("hotelStatus");

    // Error display container
    const errorContainer = document.getElementById("errorContainer") || createErrorContainer();

    function createErrorContainer() {
        const container = document.createElement("div");
        container.id = "errorContainer";
        container.style.color = "red";
        container.style.marginTop = "10px";
        document.body.insertBefore(container, document.body.firstChild);
        return container;
    }

    function displayError(message) {
        errorContainer.innerText = message;
    }

    function clearError() {
        errorContainer.innerText = "";
    }

    // Helper function to parse monetary values
    const parseMonetaryValue = (value) => {
        try {
            const parsedValue = parseFloat(value.replace(/[.,]/g, '').replace(/\s+/g, '')) || 0;
            console.log(`Parsed Monetary Value (${value}):`, parsedValue);
            return parsedValue;
        } catch (error) {
            console.error("Error parsing monetary value:", error.message);
            displayError("Failed to parse monetary value. Please check the input format.");
            return 0;
        }
    };

    // Helper function to format values in Indonesian currency format
    const formatCurrencyIDR = (value) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value).replace(/Rp\s?/, '');
    };

    // Calculate Durasi
    const calculateDurasi = () => {
        try {
            clearError();
            console.log("=== Durasi Calculation Process ===");

            if (tanggalMulaiInput.value && tanggalSampaiInput.value) {
                const startDate = moment(tanggalMulaiInput.value, "YYYY-MM-DD");
                const endDate = moment(tanggalSampaiInput.value, "YYYY-MM-DD");

                if (endDate.isSameOrAfter(startDate)) {
                    const diffDays = endDate.diff(startDate, "days") + 1; // Include both start and end dates
                    durasiDisplay.value = diffDays;
                } else {
                    throw new Error("End date is earlier than start date.");
                }
            } else {
                throw new Error("Please select both start and end dates.");
            }
        } catch (error) {
            console.error("Error calculating duration:", error.message);
            displayError(error.message);
            durasiDisplay.value = "";
        }
    };

    // Calculate Total Biaya Penginapan
    const calculateTotalBiayaPenginapan = () => {
        try {
            clearError();
            console.log("=== Calculate Total Biaya Penginapan ===");

            const durasi = parseInt(durasiDisplay.value, 10) || 0;
            if (isNaN(durasi) || durasi <= 0) {
                throw new Error("Invalid duration. Please ensure the dates are correctly filled.");
            }

            const budgetBiayaPenginapan = parseMonetaryValue(budgetBiayaPenginapanInput.value);
            if (isNaN(budgetBiayaPenginapan) || budgetBiayaPenginapan < 0) {
                throw new Error("Invalid budget for biaya penginapan. Please enter a positive number.");
            }

            let totalBiayaPenginapan = 0;
            if (hotelCheckbox.checked) {
                totalBiayaPenginapan = durasi * budgetBiayaPenginapan;
            } else {
                console.log("Hotel is not selected. Setting Total Biaya Penginapan to 0.");
            }

            totalBiayaPenginapanInput.value = formatCurrencyIDR(totalBiayaPenginapan);
        } catch (error) {
            console.error("Error calculating Total Biaya Penginapan:", error.message);
            displayError(error.message);
            totalBiayaPenginapanInput.value = "0";
        }
    };

    const calculateTotalBiayaHarian = () => {
        try {
            clearError();
            console.log("=== Calculate Total Biaya Harian ===");

            const durasi = parseInt(durasiDisplay.value, 10);
            if (isNaN(durasi) || durasi <= 0) {
                throw new Error("Invalid duration. Please ensure the dates are correctly filled.");
            }

            const budgetBiayaHarian = parseMonetaryValue(budgetBiayaHarianInput.value);
            if (isNaN(budgetBiayaHarian) || budgetBiayaHarian < 0) {
                throw new Error("Invalid budget for biaya harian. Please enter a positive number.");
            }

            const totalBiayaHarian = durasi * budgetBiayaHarian;
            totalBiayaHarianInput.value = formatCurrencyIDR(totalBiayaHarian);
        } catch (error) {
            console.error("Error calculating Total Biaya Harian:", error.message);
            displayError(error.message);
            totalBiayaHarianInput.value = "0";
        }
    };

    // Calculate Total Biaya SPPD
    const calculateTotalBiayaSPPD = () => {
        try {
            clearError();
            console.log("=== Calculate Total Biaya SPPD ===");

            const totalBiayaPenginapan = parseFloat(totalBiayaPenginapanInput.value.replace(/\./g, '').replace(/\s+/g, '')) || 0;
            if (isNaN(totalBiayaPenginapan) || totalBiayaPenginapan < 0) {
                throw new Error("Total Biaya Penginapan is invalid. Please check the input.");
            }

            const totalBiayaHarian = parseFloat(totalBiayaHarianInput.value.replace(/\./g, '').replace(/\s+/g, '')) || 0;
            if (isNaN(totalBiayaHarian) || totalBiayaHarian < 0) {
                throw new Error("Total Biaya Harian is invalid. Please check the input.");
            }

            const totalBiayaSPPD = totalBiayaPenginapan + totalBiayaHarian;
            totalBiayaSPPDInput.value = formatCurrencyIDR(totalBiayaSPPD);
        } catch (error) {
            console.error("Error calculating Total Biaya SPPD:", error.message);
            displayError(error.message);
            totalBiayaSPPDInput.value = "0";
        }
    };

    // Trigger all calculations
    const triggerAllCalculations = () => {
        try {
            calculateDurasi();
            calculateTotalBiayaPenginapan();
            calculateTotalBiayaHarian();
            calculateTotalBiayaSPPD();
        } catch (error) {
            console.error("Error triggering calculations:", error.message);
            displayError("An error occurred during calculations. Please review your inputs.");
        }
    };

    const toggleHotel = () => {
        // Toggle checkbox state
        hotelCheckbox.checked = !hotelCheckbox.checked;

        // Update switch and status
        if (hotelCheckbox.checked) {
            hotelSwitchBg.classList.remove("bg-gray-300");
            hotelSwitchBg.classList.add("bg-green-500");
            hotelSwitch.style.transform = "translateX(100%)";
            hotelStatus.textContent = "Yes";
        } else {
            hotelSwitchBg.classList.remove("bg-green-500");
            hotelSwitchBg.classList.add("bg-gray-300");
            hotelSwitch.style.transform = "translateX(0)";
            hotelStatus.textContent = "No";
        }

        // Trigger recalculations
        triggerAllCalculations();
    };

    // Add event listeners for recalculating costs and duration when inputs change
    tanggalMulaiInput.addEventListener("change", triggerAllCalculations);
    tanggalSampaiInput.addEventListener("change", triggerAllCalculations);
    budgetBiayaPenginapanInput.addEventListener("input", triggerAllCalculations);
    budgetBiayaHarianInput.addEventListener("input", triggerAllCalculations);
    hotelSwitchBg.addEventListener("click", toggleHotel);

    // Initial calculations on page load
    console.log("=== Initial Calculations ===");
    triggerAllCalculations();
});
