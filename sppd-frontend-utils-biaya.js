document.addEventListener("DOMContentLoaded", () => {
    const tanggalMulaiInput = document.getElementById("tanggalMulai");
    const tanggalSelesaiInput = document.getElementById("tanggalSampai");
    const durasiInput = document.getElementById("durasi");
    const budgetBiayaHarian = 150000;
    const budgetBiayaPenginapanDefault = 250000;

    const totalBiayaHarianInput = document.getElementById("totalBiayaHarian");
    const totalBiayaPenginapanInput = document.getElementById("totalBiayaPenginapan");
    const totalBiayaSPPDInput = document.getElementById("totalBiayaSPPD");
    const hotelCheckbox = document.getElementById("hotel");
    const hotelSwitch = document.getElementById("hotelSwitch");
    const hotelStatus = document.getElementById("hotelStatus");

    const formatCurrency = (number) => {
        return number.toLocaleString("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).replace("Rp", "").trim();
    };

    const calculateDurasi = () => {
        const tanggalMulai = new Date(tanggalMulaiInput.value);
        const tanggalSelesai = new Date(tanggalSelesaiInput.value);

        if (!isNaN(tanggalMulai) && !isNaN(tanggalSelesai)) {
            const diffTime = tanggalSelesai - tanggalMulai;
            const durasi = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
            durasiInput.value = durasi;
            calculateCosts();
        }
    };

    const calculateCosts = () => {
        const durasi = parseInt(durasiInput.value) || 0;

        // Calculate total biaya harian regardless of hotel state
        const totalBiayaHarian = durasi * budgetBiayaHarian;
        totalBiayaHarianInput.value = formatCurrency(totalBiayaHarian);

        // Calculate total biaya penginapan based on hotel state
        const hotelValue = hotelCheckbox.checked ? budgetBiayaPenginapanDefault : 0;
        const totalBiayaPenginapan = durasi * hotelValue;
        totalBiayaPenginapanInput.value = formatCurrency(totalBiayaPenginapan);

        // Calculate total biaya SPPD
        const totalBiayaSPPD = totalBiayaHarian + totalBiayaPenginapan;
        totalBiayaSPPDInput.value = formatCurrency(totalBiayaSPPD);
    };

    const toggleHotelState = () => {
        hotelCheckbox.checked = !hotelCheckbox.checked; // Toggle the checkbox state
        if (hotelCheckbox.checked) {
            hotelStatus.textContent = "Yes";
            hotelSwitch.style.transform = "translateX(100%)";
            hotelSwitchBg.classList.remove("bg-gray-300");
            hotelSwitchBg.classList.add("bg-green-500");
        } else {
            hotelStatus.textContent = "No";
            hotelSwitch.style.transform = "translateX(0)";
            hotelSwitchBg.classList.remove("bg-green-500");
            hotelSwitchBg.classList.add("bg-gray-300");
        }
        calculateCosts(); // Recalculate costs whenever hotel state changes
    };
    
    

    // Event listener for hotel switch
    hotelSwitch.parentElement.addEventListener("click", toggleHotelState);

    // Calculate costs on duration input
    durasiInput.addEventListener("input", calculateCosts);

    // Calculate duration when tanggal mulai or tanggal selesai changes
    tanggalMulaiInput.addEventListener("change", calculateDurasi);
    tanggalSelesaiInput.addEventListener("change", calculateDurasi);

    // Initialize default state
    calculateCosts();
});
