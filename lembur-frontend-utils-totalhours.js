document.addEventListener("DOMContentLoaded", () => {
    const dayStatusField = document.getElementById("dayStatus");
    const durationField = document.getElementById("duration");
    const totalHoursField = document.getElementById("totalHours");

    // Add a message container for validation messages
    const validationMessageContainer = document.createElement("p");
    validationMessageContainer.style.color = "red";
    validationMessageContainer.style.fontSize = "14px";
    totalHoursField.parentElement.appendChild(validationMessageContainer);

    // Helper function to format numbers in Indonesian format
    const formatIndonesianNumber = (value) => {
        return new Intl.NumberFormat('id-ID', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(value);
    };

    // Function to calculate total hours based on rules
    const calculateTotalHours = (dayStatus, duration) => {
        const totalDuration = parseFloat(duration.replace(",", ".")); // Handle comma as decimal separator
        let totalHours = 0;

        if (dayStatus === "HL") {
            // Holiday Calculation
            if (totalDuration <= 8) {
                totalHours = totalDuration * 2;
            } else if (totalDuration <= 9) {
                totalHours = 8 * 2 + (totalDuration - 8) * 3;
            } else {
                totalHours = 8 * 2 + 1 * 3 + (totalDuration - 9) * 4;
            }
        } else if (dayStatus === "HK") {
            // Working Day Calculation
            if (totalDuration <= 1) {
                totalHours = totalDuration * 1.5;
            } else {
                totalHours = 1 * 1.5 + (totalDuration - 1) * 2;
            }
        }

        return formatIndonesianNumber(totalHours); // Format total hours in Indonesian locale
    };

    // Function to validate and update Total Hours
    const updateTotalHours = () => {
        const dayStatus = dayStatusField.value.trim();
        const duration = durationField.value.trim();

        // Clear previous validation message
        validationMessageContainer.textContent = "";

        // Validate inputs
        if (!dayStatus) {
            validationMessageContainer.textContent = "Status Hari tidak boleh kosong.";
            totalHoursField.value = "";
            return;
        }

        if (!duration) {
            validationMessageContainer.textContent = "Durasi tidak boleh kosong.";
            totalHoursField.value = "";
            return;
        }

        // Calculate and update total hours
        const totalHours = calculateTotalHours(dayStatus, duration);
        totalHoursField.value = totalHours;

        // Dispatch change event to trigger Total Cost update
        const event = new Event("change");
        totalHoursField.dispatchEvent(event);
    };

    // Add event listeners for changes in Day Status, Duration, or Tanggal Lembur
    if (dayStatusField && durationField && totalHoursField) {
        dayStatusField.addEventListener("change", updateTotalHours);
        durationField.addEventListener("change", updateTotalHours);
    }

    // Recalculate total hours whenever the Tanggal Lembur (date) changes
    const overtimeDateField = document.getElementById("overtimeDate");
    if (overtimeDateField) {
        overtimeDateField.addEventListener("change", () => {
            // Force recalculation by triggering change on Duration and Day Status
            const event = new Event("change");
            dayStatusField.dispatchEvent(event);
            durationField.dispatchEvent(event);
        });
    }
});
