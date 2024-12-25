const API_ADD = "https://rj.up.railway.app/api/google-sheets/add";

const form = document.getElementById("overtimeForm");
const formMessage = document.getElementById("formMessage");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    // Retrieve form data
    const data = {
        name: formData.get("name"),
        unit: document.getElementById("unit").value, // Manually retrieve disabled field
        description: formData.get("jobDescription"),
        date: formData.get("overtimeDate"),
        day: document.getElementById("day").value, // Manually retrieve disabled field
        day_status: document.getElementById("dayStatus").value, // Manually retrieve disabled field
        start_time: formData.get("startTime"),
        end_time: formData.get("endTime"),
        duration_hours: document.getElementById("duration").value, // Already formatted
        total_hours: document.getElementById("totalHours").value, // Already formatted
        hourly_rate: document.getElementById("hourlyWage").value, // Already formatted
        total_cost: document.getElementById("totalCost").value, // Already formatted
    };

    // Log the submitted data for debugging
    console.log("Submitted Data:", JSON.stringify(data, null, 2));

    try {
        const response = await fetch(API_ADD, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (!response.ok) throw new Error(await response.text());

        const responseData = await response.json();
        console.log("Backend Response Data:", JSON.stringify(responseData, null, 2)); // Log backend response JSON

        form.reset();
        formMessage.textContent = "Entry added successfully!";
        formMessage.classList.remove("hidden", "text-red-600");
        formMessage.classList.add("text-green-600");
        fetchData(); // Refresh the data list
    } catch (error) {
        console.error("Submission Error:", error.message);
        formMessage.textContent = `Error: ${error.message}`;
        formMessage.classList.remove("hidden", "text-green-600");
        formMessage.classList.add("text-red-600");
    }
});
