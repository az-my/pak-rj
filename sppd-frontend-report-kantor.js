const fetchData = async () => {
    try {
        const response = await fetch("https://rj.up.railway.app/api/google-sheets/sppd-read");
        const result = await response.json();

        console.log("API Response:", result.data); // Log API response for debugging

        if (result.data && Array.isArray(result.data) && result.data.length > 1) {
            const dataRows = result.data.slice(1); // Remove the header row from the data

            // Process the data as needed
            const processedData = dataRows.map((row, index) => ({
                No: index + 1,
                NamaDriver: row[2], // Corrected index for NamaDriver
                JumlahSPPD: row[16],
                JumlahHari: row[2],
                Ket: row[20] || '' // Ensure Ket is not undefined
            }));

            // Example: Log the processed data
            console.log("Processed Data:", processedData);

            // Create summary data
            const summaryData = processedData.reduce((acc, row) => {
                const driver = acc.find(d => d.NamaDriver === row.NamaDriver);
                if (driver) {
                    driver.JumlahSPPD += parseInt(row.JumlahSPPD.replace(/\./g, ''), 10) || 0;
                    driver.JumlahHari += 1;
                } else {
                    acc.push({
                        NamaDriver: row.NamaDriver,
                        JumlahSPPD: parseInt(row.JumlahSPPD.replace(/\./g, ''), 10) || 0,
                        JumlahHari: 1,
                        Ket: row.Ket // Ensure Ket is carried over to summary data
                    });
                }
                return acc;
            }, []);

            // Log summary data
            console.log("Summary Data:", summaryData);

            // Calculate total amount
            const totalAmount = summaryData.reduce((sum, driver) => sum + driver.JumlahSPPD, 0);

            // Log total amount
            console.log("Total Amount:", totalAmount);

            // Render summary data in the table
            renderTable(summaryData, totalAmount);
        } else {
            console.error("Invalid or empty data received from API.");
        }
    } catch (error) {
        console.error("Error fetching data:", error.message);
    }
};

function renderTable(data, totalAmount) {
    const tableBody = document.getElementById('data-table-body');
    tableBody.innerHTML = ''; // Clear existing data

    data.forEach((row, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="border border-gray-500 px-2 py-1  w-auto">${index + 1}</td>
            <td class="border border-gray-500 px-2 py-1  w-auto">${row.NamaDriver}</td>
            <td class="border border-gray-500 px-2 py-1  w-auto text-right">${row.JumlahSPPD.toLocaleString('id-ID')}</td>
            <td class="border border-gray-500 px-2 py-1  w-auto">${row.JumlahHari}</td>
            <td class="border border-gray-500 px-2 py-1  w-auto">${row.Ket}</td>
        `;
        tableBody.appendChild(tr);
    });

    // Update total amount
    document.getElementById('total-amount').textContent = totalAmount.toLocaleString('id-ID');
    document.getElementById('terbilang').textContent += ' ' + convertToWords(totalAmount);
}

// Function to convert number to words in Indonesian
function convertToWords(number) {
    const units = ["", "satu", "dua", "tiga", "empat", "lima", "enam", "tujuh", "delapan", "sembilan"];
    const teens = ["sepuluh", "sebelas", "dua belas", "tiga belas", "empat belas", "lima belas", "enam belas", "tujuh belas", "delapan belas", "sembilan belas"];
    const tens = ["", "", "dua puluh", "tiga puluh", "empat puluh", "lima puluh", "enam puluh", "tujuh puluh", "delapan puluh", "sembilan puluh"];
    const thousands = ["", "ribu", "juta", "miliar", "triliun"];

    if (number === 0) return "nol";

    // Remove thousand separators
    number = parseInt(number.toString().replace(/\./g, ''), 10);
    console.log("Number (after removing separators):", number);

    let words = "";
    let i = 0;

    while (number > 0) {
        let remainder = number % 1000;
        if (remainder !== 0) {
            let part = convertHundreds(remainder);
            words = part + " " + thousands[i] + " " + words;
        }
        number = Math.floor(number / 1000);
        i++;
    }

    console.log("Words:", words.trim());
    return words.trim();
}

function convertHundreds(number) {
    const units = ["", "satu", "dua", "tiga", "empat", "lima", "enam", "tujuh", "delapan", "sembilan"];
    const teens = ["sepuluh", "sebelas", "dua belas", "tiga belas", "empat belas", "lima belas", "enam belas", "tujuh belas", "delapan belas", "sembilan belas"];
    const tens = ["", "", "dua puluh", "tiga puluh", "empat puluh", "lima puluh", "enam puluh", "tujuh puluh", "delapan puluh", "sembilan puluh"];

    let words = "";

    if (number > 99) {
        words += units[Math.floor(number / 100)] + " ratus ";
        number %= 100;
    }

    if (number > 19) {
        words += tens[Math.floor(number / 10)] + " ";
        number %= 10;
    } else if (number > 9) {
        words += teens[number - 10] + " ";
        number = 0;
    }

    words += units[number];
    return words.trim();
}

// Call fetchData function when the script is loaded
fetchData();

// Call fetchData function when the script is loaded
fetchData();