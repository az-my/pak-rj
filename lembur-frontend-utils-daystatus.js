document.addEventListener("DOMContentLoaded", () => {
    const overtimeDateField = document.getElementById("overtimeDate");
    const dayStatusField = document.getElementById("dayStatus");

    // API URL for fetching public holidays
    const apiUrl = "https://dayoffapi.vercel.app/api";

    // Fetch public holidays from the API
    let publicHolidays = [];
    const fetchPublicHolidays = async () => {
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();

            // Extract holiday dates
            publicHolidays = data.map((holiday) => holiday.tanggal);
        } catch (error) {
            console.error("Failed to fetch public holidays:", error);
        }
    };

    // Check if the date is a weekend
    const isWeekend = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDay(); // Sunday is 0, Saturday is 6
        return day === 0 || day === 6;
    };

    // Check if the date is a public holiday
    const isPublicHoliday = (dateString) => {
        return publicHolidays.includes(dateString);
    };

    // Event listener to update "Status Hari" when "Tanggal Lembur" changes
    if (overtimeDateField && dayStatusField) {
        overtimeDateField.addEventListener("change", async (event) => {
            const selectedDate = event.target.value;

            if (selectedDate) {
                // Ensure holidays are fetched before checking
                if (publicHolidays.length === 0) {
                    await fetchPublicHolidays();
                }

                const status = isWeekend(selectedDate) || isPublicHoliday(selectedDate) ? "HL" : "HK";
                dayStatusField.value = status;
            } else {
                dayStatusField.value = ""; // Clear the field if no date is selected
            }
        });
    }

    // Initial fetch of public holidays
    fetchPublicHolidays();
});
