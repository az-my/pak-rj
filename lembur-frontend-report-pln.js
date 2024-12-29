// Function to format numbers with Indonesian locale, rounded, no decimals
const formatIDR = (number) => {
    return new Intl.NumberFormat('id-ID', {
        maximumFractionDigits: 0, // No decimal places
        minimumFractionDigits: 0,
        useGrouping: true, // Add thousand separators
    }).format(Math.round(number)); // Round the number
};

const fetchData = async () => {
    try {
        const response = await fetch("https://rj.up.railway.app/api/google-sheets/list");
        const result = await response.json();

        console.log("API Response:", result.data); // Debugging

        // Function to validate and get current and next month
        const getMonthNames = (dateStr) => {
            console.log("Date String:", dateStr); // Debug log

            // Regular expression for DD/MM/YYYY format
            const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
            if (!dateRegex.test(dateStr)) {
                console.error("Date format is invalid:", dateStr);
                throw new Error("Invalid date format");
            }

            // Split date string
            const [day, month, year] = dateStr.split('/').map(Number);

            // Validate day, month, and year
            if (month < 1 || month > 12 || day < 1 || day > 31) {
                console.error("Invalid day or month values:", { day, month, year });
                throw new Error("Invalid date values");
            }

            // Check if the date is valid using JavaScript's Date object
            const date = new Date(year, month - 1, day); // Months are 0-indexed in JS
            if (
                date.getFullYear() !== year ||
                date.getMonth() + 1 !== month || // Add 1 since JS months are 0-indexed
                date.getDate() !== day
            ) {
                console.error("Invalid date:", dateStr);
                throw new Error("Invalid date");
            }

            // Extract month names
            const months = [
                "Januari", "Februari", "Maret", "April", "Mei", "Juni",
                "Juli", "Agustus", "September", "Oktober", "November", "Desember"
            ];
            const currentMonth = months[month - 1];
            const nextMonth = months[month % 12]; // Wrap around to January if month is December
            return { currentMonth, nextMonth };
        };
                // Helper function to clean and convert to float
                const cleanAndConvert = (value) => {
                    if (typeof value === "string") {
                        // Replace Indonesian thousand separator (.) and decimal marker (,)
                        value = value.replace(/\./g, "").replace(",", ".");
                    }
                    return parseFloat(value) || 0; // Default to 0 if value is invalid
                };
        if (result.data && Array.isArray(result.data) && result.data.length > 1) {
            const dataRows = result.data.slice(1); // Skip the header row
            let currentMonth, nextMonth;

            try {
                // Extract current and next month using the first date in the data
                ({ currentMonth, nextMonth } = getMonthNames(dataRows[0][5]));
                console.log("Current Month:", currentMonth, "Next Month:", nextMonth);
            } catch (error) {
                console.error("Date validation error:", error.message);
                throw error; // Stop processing if the date is invalid
            }

            // Process the data
            const processedData = dataRows.map((row, index) => {
                return {
                    No: index + 1,
                    NamaHari: row[6],
                    TanggalLembur: row[5],
                    NamaDriver: row[2],
                    Unit: row[3],
                    UraianPekerjaan: row[4],
                    JamMulai: row[8],
                    JamSelesei: row[9],
                    TotalJamLembur: cleanAndConvert(row[11]),
                    TotalJamBayar: cleanAndConvert(row[10]),
                    UpahPerJam: cleanAndConvert(row[12]),
                    TotalBiayaBayar: cleanAndConvert(row[13]),

                    BulanTransaksi: currentMonth, // Use extracted month
                    BulanMasukTagihan: nextMonth // Use extracted month
                };
            });

            // Calculate the required values
            const totalAmount = Math.ceil(processedData.reduce((sum, row) => sum + (parseFloat(row.TotalBiayaBayar) || 0), 0));
            const totalBiayaAdmin = Math.ceil(totalAmount * 0.05);
            const totalInvoiceWithoutTax = Math.ceil(totalAmount + totalBiayaAdmin);
            const totalPPN = Math.ceil(totalInvoiceWithoutTax * 0.11);
            const totalFinalInvoice = Math.ceil(totalInvoiceWithoutTax + totalPPN);

        // Log raw calculated values
        console.log("Raw Total Amount:", totalAmount);
        console.log("Raw Total Biaya Admin (5%):", totalBiayaAdmin);
        console.log("Raw Total Invoice Without Tax:", totalInvoiceWithoutTax);
        console.log("Raw Total PPN (11%):", totalPPN);
        console.log("Raw Total Final Invoice:", totalFinalInvoice);

            // Format and render the calculated values
            document.getElementById('total-amount').textContent = formatIDR(totalAmount);
            document.getElementById('total-biaya-admin').textContent = formatIDR(totalBiayaAdmin);
            document.getElementById('total-invoice-without-tax').textContent = formatIDR(totalInvoiceWithoutTax);
            document.getElementById('total-ppn').textContent = formatIDR(totalPPN);
            document.getElementById('total-final-invoice').textContent = formatIDR(totalFinalInvoice);
            // Round up the totalFinalInvoice to the nearest whole number
            const roundedFinalInvoice = Math.ceil(totalFinalInvoice);

            // Call terbilang with the rounded value
            document.getElementById('terbilang').textContent += ' ' + terbilang(roundedFinalInvoice) + ' Rupiah';
            // document.getElementById('terbilang').textContent += ' ' + terbilang(totalFinalInvoice) + ' Rupiah';
            // Example: Log the processed data
            console.log("Processed Data:", processedData);

            // Render BulanTransaksi and BulanMasukTagihan
            const transactionMonthElements = document.querySelectorAll('#transaction-month');
            transactionMonthElements.forEach(element => {
                element.textContent = currentMonth;
            });

            const bulanMasukTagihanElements = document.querySelectorAll('#bulan-masuk-tagihan');
            bulanMasukTagihanElements.forEach(element => {
                element.textContent = nextMonth;
            });

            // Render summary data in the table
            renderTable(processedData, totalAmount);
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
            <td class="border border-gray-500 px-2 py-1  w-auto text-center">${index + 1}</td>
            <td class="border border-gray-500 px-2 py-1  w-auto text-center">${row.NamaHari}</td>
            <td class="border border-gray-500 px-2 py-1  w-auto text-center">${row.TanggalLembur}</td>
            <td class="border border-gray-500 px-2 py-1  w-auto text-center">${row.NamaDriver}</td>
            <td class="border border-gray-500 px-2 py-1  w-auto text-center">${row.Unit}</td>
            <td class="border border-gray-500 px-2 py-1  w-auto text-center">${row.UraianPekerjaan}</td>
            <td class="border border-gray-500 px-2 py-1  w-auto text-center">${row.JamMulai}</td>
            <td class="border border-gray-500 px-2 py-1  w-auto text-center">${row.JamSelesei}</td>
            <td class="border border-gray-500 px-2 py-1  w-auto text-center">${row.TotalJamBayar}</td>
            <td class="border border-gray-500 px-2 py-1  w-auto text-center">${row.TotalJamLembur}</td>
            <td class="border border-gray-500 px-2 py-1  w-auto text-center">${formatIDR(row.UpahPerJam)}</td>
            <td class="border border-gray-500 px-2 py-1  w-auto text-right">${formatIDR(row.TotalBiayaBayar)}</td>
            
            
        `;
        tableBody.appendChild(tr);
    });
}

/*! Copyright (c) 2016 Naufal Rabbani (https://github.com/BosNaufal/terbilang-js)
* Licensed Under MIT (http://opensource.org/licenses/MIT)
*
* Version 0.0.1
*
* Inspired By: http://notes.rioastamal.net/2012/03/membuat-fungsi-terbilang-pada-php.html
*/

function terbilang(nilai) {
    const huruf = ["", "Satu", "Dua", "Tiga", "Empat", "Lima", "Enam", "Tujuh", "Delapan", "Sembilan", "Sepuluh", "Sebelas"];
    let temp = "";
      if (nilai < 12) {
      temp = " "+ huruf[nilai];
    } else if (nilai <20) {
      temp = terbilang(nilai - 10)+ " Belas";
    } else if (nilai < 100) {
      temp = terbilang(Math.floor(nilai/10))+" Puluh"+ terbilang(nilai % 10);
    } else if (nilai < 200) {
      temp = " Seratus" + terbilang(nilai - 100);
    } else if (nilai < 1000) {
      temp = terbilang(Math.floor(nilai/100)) + " Ratus" + terbilang(nilai % 100);
    } else if (nilai < 2000) {
      temp = " Seribu" + terbilang(nilai - 1000);
    } else if (nilai < 1000000) {
      temp = terbilang(Math.floor(nilai/1000)) + " Ribu" + terbilang(nilai % 1000);
    } else if (nilai < 1000000000) {
      temp = terbilang(Math.floor(nilai/1000000)) + " Juta" + terbilang(nilai % 1000000);
    } else if (nilai < 1000000000000) {
      temp = terbilang(Math.floor(nilai/1000000000)) + " Milyar" + terbilang(Math.fmod(nilai,1000000000));
    } else if (nilai < 1000000000000000) {
      temp = terbilang(Math.floor(nilai/1000000000000)) + " Trilyun" + terbilang(Math.fmod(nilai,1000000000000));
    }     
    return temp;
  }

// Call fetchData function when the script is loaded
fetchData();