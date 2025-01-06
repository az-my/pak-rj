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

        const date = new Date(dateString); // Parse yyyy-mm-dd directly
        if (!isNaN(date)) {
            return daysInIndonesian[date.getDay()];
        }

        return ""; // Return empty string if date is invalid
    };

    // Event listener to update the "Hari" field when "Tanggal Lembur" changes
    if (overtimeDateField && dayField) {
        overtimeDateField.addEventListener("change", (event) => {
            const selectedDate = event.target.value;
            console.log("Selected Date (yyyy-mm-dd):", selectedDate); // Log the input date
            const dayName = getDayNameInIndonesian(selectedDate);
            console.log("Day Name in Indonesian:", dayName); // Log the day name
            dayField.value = dayName;
            console.log("Day Field Updated to:", dayField.value); // Log the updated value in the day field
        });
    } else {
        console.log("Fields not found:", {
            overtimeDateField,
            dayField
        });
    }
});
