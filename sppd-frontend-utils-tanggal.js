document.addEventListener("DOMContentLoaded", () => {
    const tanggalMulaiInput = document.getElementById("tanggalMulai");
    const tanggalSampaiInput = document.getElementById("tanggalSampai");

    // Restrict date selection to the previous month using UTC
    const restrictToPreviousMonth = (inputElement) => {
        const currentDate = new Date();

        // Calculate the first and last days of the previous month using UTC
        const previousMonthStart = new Date(Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth() - 1, 1));
        const previousMonthEnd = new Date(Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), 0));

        // Set min and max attributes for the input element
        inputElement.min = previousMonthStart.toISOString().split("T")[0];
        inputElement.max = previousMonthEnd.toISOString().split("T")[0];

        console.log("Previous Month Allowed Range (UTC):", {
            min: inputElement.min,
            max: inputElement.max,
        });
    };

    // Apply restrictions to both inputs
    restrictToPreviousMonth(tanggalMulaiInput);
    restrictToPreviousMonth(tanggalSampaiInput);

    // Update Tanggal Sampai min date based on Tanggal Mulai
    tanggalMulaiInput.addEventListener("change", () => {
        tanggalSampaiInput.min = tanggalMulaiInput.value;
        if (tanggalSampaiInput.value && new Date(tanggalSampaiInput.value) < new Date(tanggalMulaiInput.value)) {
            alert("Tanggal Sampai harus lebih besar atau sama dengan Tanggal Mulai.");
            tanggalSampaiInput.value = "";
        }
    });

    tanggalSampaiInput.addEventListener("change", () => {
        if (new Date(tanggalSampaiInput.value) < new Date(tanggalMulaiInput.value)) {
            alert("Tanggal Sampai harus lebih besar atau sama dengan Tanggal Mulai.");
            tanggalSampaiInput.value = "";
        }
    });
});
