document.addEventListener("DOMContentLoaded", () => {
    const overtimeDateField = document.getElementById("overtimeDate");
    const dayField = document.getElementById("day");

    // Function to get the name of the day in Indonesian
    const getDayNameInIndonesian = (dateString) => {
        const daysInIndonesian = [
            "Minggu",
            "Senin",
            "Selasa",
            "Rabu",
            "Kamis",
            "Jumat",
            "Sabtu"
        ];

        const date = new Date(dateString);
        if (!isNaN(date)) {
            return daysInIndonesian[date.getDay()];
        }

        return ""; // Return empty string if date is invalid
    };

    // Event listener to update the "Hari" field when "Tanggal Lembur" changes
    if (overtimeDateField && dayField) {
        overtimeDateField.addEventListener("change", (event) => {
            const selectedDate = event.target.value;
            const dayName = getDayNameInIndonesian(selectedDate);
            dayField.value = dayName;
        });
    }
});
