document.addEventListener("DOMContentLoaded", () => {
    const names = [
        "NASRULLAH",
        "ERDIANSYAH",
        "SUNARYO",
        "SYAMAUN",
        "EDI DARMAWAN",
        "JUNAIDI",
        "AKMALUL BASYAR",
        "YANI MULIA",
        "MUHAMMAD ICHSAN",
        "RIZAL SAPUTRA",
        "ROMI SAFRUDDIN",
        "FAISAL ANWAR",
        "VANY ALWAHABY",
        "UWIS KARNI",
        "SYAHRIL",
        "HENDRA",
        "NUGRAHA RAMADHAN"
    ];

    // Sort names alphabetically
    names.sort();

    // Get the select element
    const nameSelect = document.getElementById("name");

    if (nameSelect) {
        // Add an option for each name
        names.forEach((name) => {
            const option = document.createElement("option");
            option.value = name;
            option.textContent = name;
            nameSelect.appendChild(option);
        });
    }
});
