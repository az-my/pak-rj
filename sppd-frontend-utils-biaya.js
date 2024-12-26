document.addEventListener("DOMContentLoaded", () => {
    const durasiInput = document.getElementById("durasi");
    const budgetBiayaHarian = 150000;
    const budgetBiayaPenginapan = 250000;

    const totalBiayaHarianInput = document.getElementById("totalBiayaHarian");
    const totalBiayaPenginapanInput = document.getElementById("totalBiayaPenginapan");
    const totalBiayaSPPDInput = document.getElementById("totalBiayaSPPD");
    const hotelCheckbox = document.getElementById("hotel");

    const formatCurrency = (number) => {
        return number.toLocaleString("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).replace("Rp", "").trim();
    };

    const calculateCosts = () => {
        const durasi = parseInt(durasiInput.value) || 0;
        const totalBiayaHarian = durasi * budgetBiayaHarian;
        const totalBiayaPenginapan = hotelCheckbox.checked ? durasi * budgetBiayaPenginapan : 0;
        const totalBiayaSPPD = totalBiayaHarian + totalBiayaPenginapan;

        totalBiayaHarianInput.value = formatCurrency(totalBiayaHarian);
        totalBiayaPenginapanInput.value = formatCurrency(totalBiayaPenginapan);
        totalBiayaSPPDInput.value = formatCurrency(totalBiayaSPPD);
    };

    durasiInput.addEventListener("input", calculateCosts);
    hotelCheckbox.addEventListener("change", calculateCosts);
});