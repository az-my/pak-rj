document.addEventListener("DOMContentLoaded", () => {
    const startTimeField = document.getElementById("startTime");
    const endTimeField = document.getElementById("endTime");
    const overtimeDateField = document.getElementById("overtimeDate");
    const dayStatusField = document.getElementById("dayStatus");

    const apiUrl = "https://dayoffapi.vercel.app/api?year=2024";

    let publicHolidays = [];
    const fetchPublicHolidays = async () => {
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            publicHolidays = data.map((holiday) => holiday.tanggal);
        } catch (error) {
            console.error("Failed to fetch public holidays:", error);
        }
    };

    const isWeekend = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDay();
        return day === 0 || day === 6;
    };

    const isPublicHoliday = (dateString) => {
        return publicHolidays.includes(dateString);
    };

    const generateTimeOptions = (start, end) => {
        const options = [];
        for (let minutes = start; minutes <= end; minutes += 30) {
            const hours = Math.floor(minutes / 60);
            const mins = minutes % 60;
            options.push(`${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`);
        }
        return options;
    };

    const populateStartTime = (dayStatus) => {
        startTimeField.innerHTML = "";
        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.textContent = "Please Select";
        defaultOption.disabled = true;
        defaultOption.selected = true;
        startTimeField.appendChild(defaultOption);

        const minStartTime = dayStatus === "HK" ? 17 * 60 : 0;
        const maxStartTime = 24 * 60;

        const startOptions = generateTimeOptions(minStartTime, maxStartTime);
        startOptions.forEach((time) => {
            const option = document.createElement("option");
            option.value = time;
            option.textContent = time;
            startTimeField.appendChild(option);
        });
    };

    const populateEndTime = (startTime, dayStatus) => {
        endTimeField.innerHTML = "";
        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.textContent = "Please Select";
        defaultOption.disabled = true;
        defaultOption.selected = true;
        endTimeField.appendChild(defaultOption);
    
        const [startHour, startMinute] = startTime.split(":").map(Number);
        const startMinutes = startHour * 60 + startMinute;
    
        let maxRange;
        if (dayStatus === "HK") {
            maxRange = Math.min(4 * 60, 24 * 60 - startMinutes);
        } else if (dayStatus === "HL") {
            maxRange = Math.min(12 * 60, 24 * 60 - startMinutes);
        } else {
            maxRange = 12 * 60;
        }
    
        const maxEndTime = Math.min(startMinutes + maxRange, 24 * 60);
    
        const endOptions = generateTimeOptions(startMinutes + 30, maxEndTime);
        endOptions.forEach((time) => {
            const option = document.createElement("option");
            option.value = time;
            option.textContent = time;
            endTimeField.appendChild(option);
        });
    };

    const restrictDateSelection = () => {
        const currentDate = new Date();
        const previousMonthStart = new Date(Date.UTC(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
        const previousMonthEnd = new Date(Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), 0));
        
        overtimeDateField.min = previousMonthStart.toISOString().split("T")[0];
        overtimeDateField.max = previousMonthEnd.toISOString().split("T")[0];
    };

    if (overtimeDateField && dayStatusField) {
        restrictDateSelection();

        overtimeDateField.addEventListener("change", async (event) => {
            const selectedDate = event.target.value;
            if (selectedDate) {
                if (publicHolidays.length === 0) {
                    await fetchPublicHolidays();
                }

                const status = isWeekend(selectedDate) || isPublicHoliday(selectedDate) ? "HL" : "HK";
                dayStatusField.value = status;
                populateStartTime(status);
            } else {
                dayStatusField.value = "";
                startTimeField.innerHTML = "";
                endTimeField.innerHTML = "";
            }
        });
    }

    if (startTimeField && endTimeField) {
        startTimeField.addEventListener("change", (event) => {
            const selectedStartTime = event.target.value;
            const dayStatus = dayStatusField.value;

            if (selectedStartTime && dayStatus) {
                populateEndTime(selectedStartTime, dayStatus);
            }
        });
    }

    fetchPublicHolidays();
});
