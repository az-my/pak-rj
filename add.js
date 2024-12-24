const API_ADD = "https://rj.up.railway.app/api/google-sheets/add";

// Handle form submission
const form = document.getElementById("entryForm");
const formMessage = document.getElementById("formMessage");

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch(API_ADD, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error(await response.text());
        form.reset();
        formMessage.textContent = "Entry added successfully!";
        formMessage.classList.remove("hidden", "text-red-600");
        formMessage.classList.add("text-green-600");

        // Trigger data reload after successful submission
        fetchData();
    } catch (error) {
        formMessage.textContent = `Error: ${error.message}`;
        formMessage.classList.remove("hidden", "text-green-600");
        formMessage.classList.add("text-red-600");
    }
});
