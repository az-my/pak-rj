document.addEventListener("DOMContentLoaded", () => {
    const tanggalMulaiInput = document.getElementById("tanggalMulai");
    const tanggalSampaiInput = document.getElementById("tanggalSampai");

    // Validate Tanggal Sampai to be after Tanggal Mulai
    tanggalMulaiInput.addEventListener("change", () => {
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
