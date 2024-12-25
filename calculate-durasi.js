document.addEventListener("DOMContentLoaded", () => {
    const tanggalMulaiInput = document.getElementById("tanggalMulai");
    const tanggalSampaiInput = document.getElementById("tanggalSampai");
    const durasiInput = document.getElementById("durasi");

    const calculateDurasi = () => {
        if (tanggalMulaiInput.value && tanggalSampaiInput.value) {
            const startDate = new Date(tanggalMulaiInput.value);
            const endDate = new Date(tanggalSampaiInput.value);

            if (endDate >= startDate) {
                const diffTime = Math.abs(endDate - startDate);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Include the start date
                durasiInput.value = diffDays;
            } else {
                alert("Tanggal Sampai harus lebih besar atau sama dengan Tanggal Mulai.");
                tanggalSampaiInput.value = "";
                durasiInput.value = "";
            }
        } else {
            durasiInput.value = "";
        }
    };

    tanggalMulaiInput.addEventListener("change", calculateDurasi);
    tanggalSampaiInput.addEventListener("change", calculateDurasi);
});
