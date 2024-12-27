const fetchData = async () => {
    try {
        const response = await fetch("https://rj.up.railway.app/api/google-sheets/list");
        const result = await response.json();

        console.log("API Response:", result.data); // Log API response for debugging

        if (result.data && Array.isArray(result.data) && result.data.length > 1) {
            const dataRows = result.data.slice(1); // Remove the header row from the data
            // Extract the month from the first data row's TANGGAL_MULAI

            // Function to extract month name from date
            const getMonthName = (dateStr) => {
                const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "Desember"];
                const dateParts = dateStr.split('/');
                const monthIndex = parseInt(dateParts[1], 10) - 1;
                return months[monthIndex];
            };

            // Process the data as needed
            const processedData = dataRows.map((row, index) => ({
                No: index + 1,
                NamaDriver: row[2], // Corrected index for NamaDriver
                JumlahSPPD: row[13],
                JumlahHari: row[2],
                Ket: '', // Set Ket to an empty string
                BulanTransaksi: getMonthName(row[5]) // Extract month name from date
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
                        BulanTransaksi: row.BulanTransaksi, // Include BulanTransaksi in summary data
                        Ket: '', // Set Ket to an empty string
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
                // Render BulanTransaksi in both elements with id="transaction-month"
            const transactionMonthElements = document.querySelectorAll('#transaction-month');
            transactionMonthElements.forEach(element => {
                element.textContent = summaryData[0].BulanTransaksi; // Assuming you want to use the first month's transaction
            });
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
    document.getElementById('terbilang').textContent += ' ' + terbilang(totalAmount) + ' Rupiah';
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

/*! Copyright (c) 2016 Naufal Rabbani (https://github.com/BosNaufal/terbilang-js)
* Licensed Under MIT (http://opensource.org/licenses/MIT)
*
* Version 0.0.1
*
* Inspired By: http://notes.rioastamal.net/2012/03/membuat-fungsi-terbilang-pada-php.html
*/

function terbilang(a){
	var bilangan = ['','Satu','Dua','Tiga','Empat','Lima','Enam','Tujuh','Delapan','Sembilan','Sepuluh','Sebelas'];

	// 1 - 11
	if(a < 12){
		var kalimat = bilangan[a];
	}
	// 12 - 19
	else if(a < 20){
		var kalimat = bilangan[a-10]+' Belas';
	}
	// 20 - 99
	else if(a < 100){
		var utama = a/10;
		var depan = parseInt(String(utama).substr(0,1));
		var belakang = a%10;
		var kalimat = bilangan[depan]+' Puluh '+bilangan[belakang];
	}
	// 100 - 199
	else if(a < 200){
		var kalimat = 'Seratus '+ terbilang(a - 100);
	}
	// 200 - 999
	else if(a < 1000){
		var utama = a/100;
		var depan = parseInt(String(utama).substr(0,1));
		var belakang = a%100;
		var kalimat = bilangan[depan] + ' Ratus '+ terbilang(belakang);
	}
	// 1,000 - 1,999
	else if(a < 2000){
		var kalimat = 'Seribu '+ terbilang(a - 1000);
	}
	// 2,000 - 9,999
	else if(a < 10000){
		var utama = a/1000;
		var depan = parseInt(String(utama).substr(0,1));
		var belakang = a%1000;
		var kalimat = bilangan[depan] + ' Ribu '+ terbilang(belakang);
	}
	// 10,000 - 99,999
	else if(a < 100000){
		var utama = a/100;
		var depan = parseInt(String(utama).substr(0,2));
		var belakang = a%1000;
		var kalimat = terbilang(depan) + ' Ribu '+ terbilang(belakang);
	}
	// 100,000 - 999,999
	else if(a < 1000000){
		var utama = a/1000;
		var depan = parseInt(String(utama).substr(0,3));
		var belakang = a%1000;
		var kalimat = terbilang(depan) + ' Ribu '+ terbilang(belakang);
	}
	// 1,000,000 - 	99,999,999
	else if(a < 100000000){
		var utama = a/1000000;
		var depan = parseInt(String(utama).substr(0,4));
		var belakang = a%1000000;
		var kalimat = terbilang(depan) + ' Juta '+ terbilang(belakang);
	}
	else if(a < 1000000000){
		var utama = a/1000000;
		var depan = parseInt(String(utama).substr(0,4));
		var belakang = a%1000000;
		var kalimat = terbilang(depan) + ' Juta '+ terbilang(belakang);
	}
	else if(a < 10000000000){
		var utama = a/1000000000;
		var depan = parseInt(String(utama).substr(0,1));
		var belakang = a%1000000000;
		var kalimat = terbilang(depan) + ' Milyar '+ terbilang(belakang);
	}
	else if(a < 100000000000){
		var utama = a/1000000000;
		var depan = parseInt(String(utama).substr(0,2));
		var belakang = a%1000000000;
		var kalimat = terbilang(depan) + ' Milyar '+ terbilang(belakang);
	}
	else if(a < 1000000000000){
		var utama = a/1000000000;
		var depan = parseInt(String(utama).substr(0,3));
		var belakang = a%1000000000;
		var kalimat = terbilang(depan) + ' Milyar '+ terbilang(belakang);
	}
	else if(a < 10000000000000){
		var utama = a/10000000000;
		var depan = parseInt(String(utama).substr(0,1));
		var belakang = a%10000000000;
		var kalimat = terbilang(depan) + ' Triliun '+ terbilang(belakang);
	}
	else if(a < 100000000000000){
		var utama = a/1000000000000;
		var depan = parseInt(String(utama).substr(0,2));
		var belakang = a%1000000000000;
		var kalimat = terbilang(depan) + ' Triliun '+ terbilang(belakang);
	}

	else if(a < 1000000000000000){
		var utama = a/1000000000000;
		var depan = parseInt(String(utama).substr(0,3));
		var belakang = a%1000000000000;
		var kalimat = terbilang(depan) + ' Triliun '+ terbilang(belakang);
	}

  else if(a < 10000000000000000){
		var utama = a/1000000000000000;
		var depan = parseInt(String(utama).substr(0,1));
		var belakang = a%1000000000000000;
		var kalimat = terbilang(depan) + ' Kuadriliun '+ terbilang(belakang);
	}

	var pisah = kalimat.split(' ');
	var full = [];
	for(var i=0;i<pisah.length;i++){
	 if(pisah[i] != ""){full.push(pisah[i]);}
	}
	return full.join(' ');
}

// Call fetchData function when the script is loaded
fetchData();