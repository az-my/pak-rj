const fetchData = async () => {
  try {
    const response = await fetch('https://rj.up.railway.app/api/google-sheets/sppd-read');
    const result = await response.json();

     // Sort the raw data by the timestamp (index 1) from oldest to newest
     const sortedRawData = result.data.sort((a, b) => {
      const dateA = new Date(a[1].split('/').reverse().join('-'));
      const dateB = new Date(b[1].split('/').reverse().join('-'));
      return dateA - dateB;
    });

    console.log(sortedRawData); // Log sorted raw data for debugging

    const getMonthNames = (dateStr) => {
      const [day, month, year] = dateStr.split('/').map(Number);
      const date = new Date(year, month - 1, day);
      const months = [
        'Januari',
        'Februari',
        'Maret',
        'April',
        'Mei',
        'Juni',
        'Juli',
        'Agustus',
        'September',
        'Oktober',
        'November',
        'Desember',
      ];
      const bulanTransaksi = `${months[month - 1]} ${year}`;
      const bulanMasukTagihan = `${months[month % 12]} ${month === 12 ? year + 1 : year}`;
      return { bulanTransaksi, bulanMasukTagihan, date };
    };

    // ✅ List of DRIVER-SEWA
    const driverSewaList = ['UWIS KARNI', 'SYAHRIL', 'HENDRA', 'NUGRAHA RAMADHAN'];

    // ✅ PejabatPemberiTugas Sorting Order
    const pejabatOrder = [
      'Manager UPT Banda Aceh',
      'Manager ULTG Banda Aceh',
      'Manager ULTG Meulaboh',
      'Manager ULTG Langsa',
    ];

    if (result.data && Array.isArray(result.data) && result.data.length > 1) {
      const dataRows = result.data.slice(1); // Remove the header row

      // ✅ Process and classify data with date objects and driver classification
      const processedData = dataRows.map((row, index) => {
        const { bulanTransaksi, bulanMasukTagihan, date } = getMonthNames(row[9]); // Index 9 for TanggaMulai
        const namaDriver = row[2];
        const pejabatPemberiTugas = row[5]; // Use PejabatPemberiTugas from index 5
        const driverType = driverSewaList.includes(namaDriver) ? 'DRIVER-SEWA' : 'DRIVER-TETAP';

        return {
          No: index + 1,
          NamaDriver: namaDriver,
          TanggaMulai: row[9],
          TanggaMulaiDate: date,
          TanggalSelesai: row[10],
          PejabatPemberiTugas: pejabatPemberiTugas,
          Tujuan: row[6],
          JumlahSPPD: parseFloat(row[17]?.replace(/\./g, '') || 0),
          JumlahHari: row[11],
          Ket: '',
          sd: 's/d',
          DriverType: driverType,
        };
      });

      // ✅ Step 1: Split into DRIVER-TETAP and DRIVER-SEWA
      let driverTetap = processedData.filter((item) => item.DriverType === 'DRIVER-TETAP');
      const driverSewa = processedData.filter((item) => item.DriverType === 'DRIVER-SEWA');

      // ✅ Step 2: Sort DRIVER-TETAP by PejabatPemberiTugas and TanggaMulai ASC
      driverTetap = driverTetap.sort((a, b) => {
        const pejabatIndexA = pejabatOrder.indexOf(a.PejabatPemberiTugas);
        const pejabatIndexB = pejabatOrder.indexOf(b.PejabatPemberiTugas);

        // Sort by pejabat order if both exist in the list
        if (pejabatIndexA !== -1 && pejabatIndexB !== -1) {
          return pejabatIndexA - pejabatIndexB || a.TanggaMulaiDate - b.TanggaMulaiDate;
        }
        // If one pejabat is missing from the list, prioritize listed ones first
        if (pejabatIndexA === -1) return 1;
        if (pejabatIndexB === -1) return -1;
        return a.TanggaMulaiDate - b.TanggaMulaiDate;
      });

      // ✅ Step 3: Sort DRIVER-SEWA by TanggaMulai ASC
      driverSewa.sort((a, b) => a.TanggaMulaiDate - b.TanggaMulaiDate);

      // ✅ Step 4: Group data by NamaDriver
      const groupByNamaDriver = (data) => {
        return data.reduce((acc, record) => {
          if (!acc[record.NamaDriver]) {
            acc[record.NamaDriver] = [];
          }
          acc[record.NamaDriver].push(record);
          return acc;
        }, {});
      };

      const groupedTetap = groupByNamaDriver(driverTetap);
      const groupedSewa = groupByNamaDriver(driverSewa);

      // ✅ Step 5: Flatten grouped data and merge DRIVER-TETAP first, DRIVER-SEWA second
      const flattenGroupedData = (groupedData) => {
        return Object.values(groupedData).flatMap((records) => records);
      };

      const sortedData = [...flattenGroupedData(groupedTetap), ...flattenGroupedData(groupedSewa)];

      // ✅ Step 6: Extract month names for the first entry after sorting
      const { bulanTransaksi, bulanMasukTagihan } = getMonthNames(sortedData[0].TanggaMulai);

      // ✅ Step 7: Render month names to the UI
      document.querySelectorAll('#transaction-month').forEach((element) => {
        element.textContent = bulanTransaksi;
      });
      document.querySelectorAll('#bulan-masuk-tagihan').forEach((element) => {
        element.textContent = bulanMasukTagihan;
      });

      // ✅ Step 8: Calculate totals
      const totalAmount = sortedData.reduce((sum, row) => sum + row.JumlahSPPD, 0);
      const totalBiayaAdmin = totalAmount * 0.05;
      const totalInvoiceWithoutTax = totalAmount + totalBiayaAdmin;
      const totalPPN = totalInvoiceWithoutTax * 0.11;
      const totalFinalInvoice = totalInvoiceWithoutTax + totalPPN;

      // ✅ Function to format the currency properly using Rp symbol and Tailwind Flexbox
      const formatRupiah2 = (value) => {
        return `<div class="flex justify-between w-full items-center">
              <span class="mr-2 flex-shrink-0">Rp</span>
              <span class="text-right flex-grow">${value.toLocaleString('id-ID')}</span>
          </div>`;
      };

      // ✅ Step 9: Render calculated totals
      document.getElementById('total-amount').innerHTML = formatRupiah2(totalAmount);
      document.getElementById('total-biaya-admin').innerHTML = formatRupiah2(totalBiayaAdmin);
      document.getElementById('total-invoice-without-tax').innerHTML = formatRupiah2(totalInvoiceWithoutTax);
      document.getElementById('total-ppn').innerHTML = formatRupiah2(totalPPN);
      document.getElementById('total-final-invoice').innerHTML = formatRupiah2(totalFinalInvoice);
      document.getElementById('terbilang').textContent += ' ' + terbilang(totalFinalInvoice) + ' Rupiah';

      // ✅ Step 10: Render the sorted and grouped data
      renderTable(sortedData, totalAmount);
    } else {
      console.error('Invalid or empty data received from API.');
    }
  } catch (error) {
    console.error('Error fetching data:', error.message);
  }
};

function renderTable(data, totalAmount) {
  const tableBody = document.getElementById('data-table-body');
  tableBody.innerHTML = ''; // Clear existing data

  // Function to transform date to DD-MMM-YYYY with leading zero and Indonesian month names
  const formatDate = (dateStr) => {
    const [day, month, year] = dateStr.split('/').map(Number);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const formattedDay = day < 10 ? `0${day}` : day;
    return `${formattedDay}-${months[month - 1]}-${year}`;
  };

  const formatRupiah = (value) => {
    return `<div class="flex justify-between w-full items-center">
                <span class="mr-2 flex-shrink-0">Rp</span>
                <span class="text-right flex-grow">${value.toLocaleString('id-ID')}</span>
            </div>`;
  };

  data.forEach((row, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
            <td class="border border-gray-500 px-2 py-1  w-auto">${index + 1}</td>
            <td class="border border-gray-500 px-2 py-1  w-auto">${row.NamaDriver}</td>
            <td class="border border-gray-500 px-2 py-1 w-auto text-center">${formatDate(row.TanggaMulai)}</td>
            <td class="border border-gray-500 px-2 py-1  w-auto">${row.sd}</td>
            <td class="border border-gray-500 px-2 py-1  w-auto">${formatDate(row.TanggalSelesai)}</td>
            <td class="border border-gray-500 px-2 py-1  w-auto">${row.PejabatPemberiTugas}</td>
            <td class="border border-gray-500 px-2 py-1  w-auto">${row.Tujuan}</td>
            <td class="border border-gray-500 px-2 py-1  w-auto text-right">${formatRupiah(
              row.JumlahSPPD.toLocaleString('id-ID')
            )}</td>
            <td class="border border-gray-500 px-2 py-1  w-auto">${row.JumlahHari} <span>hari</span</td>
        `;
    tableBody.appendChild(tr);
  });
}

// Function to convert number to words in Indonesian
function convertToWords(number) {
  const units = ['', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan'];
  const teens = [
    'sepuluh',
    'sebelas',
    'dua belas',
    'tiga belas',
    'empat belas',
    'lima belas',
    'enam belas',
    'tujuh belas',
    'delapan belas',
    'sembilan belas',
  ];
  const tens = [
    '',
    '',
    'dua puluh',
    'tiga puluh',
    'empat puluh',
    'lima puluh',
    'enam puluh',
    'tujuh puluh',
    'delapan puluh',
    'sembilan puluh',
  ];
  const thousands = ['', 'ribu', 'juta', 'miliar', 'triliun'];

  if (number === 0) return 'nol';

  // Remove thousand separators
  number = parseInt(number.toString().replace(/\./g, ''), 10);
  console.log('Number (after removing separators):', number);

  let words = '';
  let i = 0;

  while (number > 0) {
    let remainder = number % 1000;
    if (remainder !== 0) {
      let part = convertHundreds(remainder);
      words = part + ' ' + thousands[i] + ' ' + words;
    }
    number = Math.floor(number / 1000);
    i++;
  }

  console.log('Words:', words.trim());
  return words.trim();
}

function convertHundreds(number) {
  const units = ['', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan'];
  const teens = [
    'sepuluh',
    'sebelas',
    'dua belas',
    'tiga belas',
    'empat belas',
    'lima belas',
    'enam belas',
    'tujuh belas',
    'delapan belas',
    'sembilan belas',
  ];
  const tens = [
    '',
    '',
    'dua puluh',
    'tiga puluh',
    'empat puluh',
    'lima puluh',
    'enam puluh',
    'tujuh puluh',
    'delapan puluh',
    'sembilan puluh',
  ];

  let words = '';

  if (number > 99) {
    words += units[Math.floor(number / 100)] + ' ratus ';
    number %= 100;
  }

  if (number > 19) {
    words += tens[Math.floor(number / 10)] + ' ';
    number %= 10;
  } else if (number > 9) {
    words += teens[number - 10] + ' ';
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

function terbilang(a) {
  var bilangan = [
    '',
    'Satu',
    'Dua',
    'Tiga',
    'Empat',
    'Lima',
    'Enam',
    'Tujuh',
    'Delapan',
    'Sembilan',
    'Sepuluh',
    'Sebelas',
  ];

  // 1 - 11
  if (a < 12) {
    var kalimat = bilangan[a];
  }
  // 12 - 19
  else if (a < 20) {
    var kalimat = bilangan[a - 10] + ' Belas';
  }
  // 20 - 99
  else if (a < 100) {
    var utama = a / 10;
    var depan = parseInt(String(utama).substr(0, 1));
    var belakang = a % 10;
    var kalimat = bilangan[depan] + ' Puluh ' + bilangan[belakang];
  }
  // 100 - 199
  else if (a < 200) {
    var kalimat = 'Seratus ' + terbilang(a - 100);
  }
  // 200 - 999
  else if (a < 1000) {
    var utama = a / 100;
    var depan = parseInt(String(utama).substr(0, 1));
    var belakang = a % 100;
    var kalimat = bilangan[depan] + ' Ratus ' + terbilang(belakang);
  }
  // 1,000 - 1,999
  else if (a < 2000) {
    var kalimat = 'Seribu ' + terbilang(a - 1000);
  }
  // 2,000 - 9,999
  else if (a < 10000) {
    var utama = a / 1000;
    var depan = parseInt(String(utama).substr(0, 1));
    var belakang = a % 1000;
    var kalimat = bilangan[depan] + ' Ribu ' + terbilang(belakang);
  }
  // 10,000 - 99,999
  else if (a < 100000) {
    var utama = a / 100;
    var depan = parseInt(String(utama).substr(0, 2));
    var belakang = a % 1000;
    var kalimat = terbilang(depan) + ' Ribu ' + terbilang(belakang);
  }
  // 100,000 - 999,999
  else if (a < 1000000) {
    var utama = a / 1000;
    var depan = parseInt(String(utama).substr(0, 3));
    var belakang = a % 1000;
    var kalimat = terbilang(depan) + ' Ribu ' + terbilang(belakang);
  }
  // 1,000,000 - 	99,999,999
  else if (a < 100000000) {
    var utama = a / 1000000;
    var depan = parseInt(String(utama).substr(0, 4));
    var belakang = a % 1000000;
    var kalimat = terbilang(depan) + ' Juta ' + terbilang(belakang);
  } else if (a < 1000000000) {
    var utama = a / 1000000;
    var depan = parseInt(String(utama).substr(0, 4));
    var belakang = a % 1000000;
    var kalimat = terbilang(depan) + ' Juta ' + terbilang(belakang);
  } else if (a < 10000000000) {
    var utama = a / 1000000000;
    var depan = parseInt(String(utama).substr(0, 1));
    var belakang = a % 1000000000;
    var kalimat = terbilang(depan) + ' Milyar ' + terbilang(belakang);
  } else if (a < 100000000000) {
    var utama = a / 1000000000;
    var depan = parseInt(String(utama).substr(0, 2));
    var belakang = a % 1000000000;
    var kalimat = terbilang(depan) + ' Milyar ' + terbilang(belakang);
  } else if (a < 1000000000000) {
    var utama = a / 1000000000;
    var depan = parseInt(String(utama).substr(0, 3));
    var belakang = a % 1000000000;
    var kalimat = terbilang(depan) + ' Milyar ' + terbilang(belakang);
  } else if (a < 10000000000000) {
    var utama = a / 10000000000;
    var depan = parseInt(String(utama).substr(0, 1));
    var belakang = a % 10000000000;
    var kalimat = terbilang(depan) + ' Triliun ' + terbilang(belakang);
  } else if (a < 100000000000000) {
    var utama = a / 1000000000000;
    var depan = parseInt(String(utama).substr(0, 2));
    var belakang = a % 1000000000000;
    var kalimat = terbilang(depan) + ' Triliun ' + terbilang(belakang);
  } else if (a < 1000000000000000) {
    var utama = a / 1000000000000;
    var depan = parseInt(String(utama).substr(0, 3));
    var belakang = a % 1000000000000;
    var kalimat = terbilang(depan) + ' Triliun ' + terbilang(belakang);
  } else if (a < 10000000000000000) {
    var utama = a / 1000000000000000;
    var depan = parseInt(String(utama).substr(0, 1));
    var belakang = a % 1000000000000000;
    var kalimat = terbilang(depan) + ' Kuadriliun ' + terbilang(belakang);
  }

  var pisah = kalimat.split(' ');
  var full = [];
  for (var i = 0; i < pisah.length; i++) {
    if (pisah[i] != '') {
      full.push(pisah[i]);
    }
  }
  return full.join(' ');
}

// Call fetchData function when the script is loaded
fetchData();
