const formConfig = {
  'Form FPPT-01': {
    title: 'FORMULIR PERMOHONAN PEKERJAAN TAMBAH',
    penerima: 'Direksi Lapangan',
    openingText:
      'Sehubungan dengan rencana kegiatan yang akan dilaksanakan diluar jam kerja, maka diharapkan kerjasamanya dapat menugaskan perusahaan dibawah ini :',
    signatureRules: {
      rightSide: ['maker'],
    },
  },
  'Form FPPT-02': {
    title: 'FORMULIR PENUGASAN PEKERJAAN TAMBAH',
    penerima: 'Pimpinan/ Koordinator/ Penanggungjawab KSO PT PALMA NAFINDO PRATAMA - PT SANOBAR GUNAJAYA',
    openingText:
      'Menunjuk Perjanjian Nomor : 0001.PJ/DAN.02.07/UPTBAC/2020 dan sehubungan dengan rencana kegiatan yang akan dilaksanakan diluar jam kerja, maka diharapkan kerjasamanya untuk menyediakan layanan untuk kegiatan dimaksud pada:																							',
    signatureRules: {
      rightSide: ['approver'],
    },
  },
  'Form FPPT-03': {
    title: 'FORMULIR KONFIRMASI PEKERJAAN TAMBAH',
    penerima: (record) => `Sdr. ${record.namaDriver}`, // Add the Access the correct property, not using index
    openingText:
      'Menunjuk Perjanjian Nomor : 0001.PJ/DAN.02.07/UPTBAC/2020 dan sehubungan dengan rencana kegiatan yang akan dilaksanakan diluar jam kerja, maka Saudara ditugaskan untuk melakukan kegiatan/ pekerjaan dimaksud pada:',
    signatureRules: {
      leftSide: ['maker'],
      rightSide: ['vendorCompany'],
    },
  },
};

const unitKerjaConfig = {
  'ULTG BANDA ACEH': {
    makerName: 'MUHAMMAD ISA',
    makerPosition: 'MAN ULTG BANDA ACEH',
    approverName: 'INDRA KURNIAWAN',
    approverPosition: 'MANAGER',
  },
  'ULTG LANGSA': {
    makerName: 'FIZKI FIRDAUS',
    makerPosition: 'MAN ULTG LANGSA',
    approverName: 'INDRA KURNIAWAN',
    approverPosition: 'MANAGER',
  },
  'ULTG MEULABOH': {
    makerName: 'ARIS DWI SANTOSO',
    makerPosition: 'MAN ULTG MEULABOH',
    approverName: 'INDRA KURNIAWAN',
    approverPosition: 'MANAGER',
  },
  'UPT BANDA ACEH': {
    makerName: 'INA FAJRINA AL ISRA',
    makerPosition: 'TL ADM & UMUM',
    approverName: 'INDRA KURNIAWAN',
    approverPosition: 'MANAGER',
  },
};

const companySignature = {
  name: 'RIZKY NAHARDI',
  companyName: 'PT PALMA',
  position: 'DIREKTUR',
};

const getIndonesianDayName = (dateStr) => {
  const daysInIndonesian = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

  // Split the dd/mm/yyyy format into day, month, and year
  const [day, month, year] = dateStr.split('/').map(Number);

  // Create a Date object from the provided date
  const date = new Date(year, month - 1, day);

  // Get the day of the week (0 - Sunday, 6 - Saturday)
  const dayOfWeek = date.getDay();

  // Return the Indonesian name of the day
  return daysInIndonesian[dayOfWeek];
};

function getSignatureData(unitKerja) {
  return (
    unitKerjaConfig[unitKerja] || {
      makerName: 'Data not available',
      makerPosition: 'Data not available',
      approverName: 'Data not available',
      approverPosition: 'Data not available',
    }
  );
}

function formatDate(dateString) {
  try {
    // Split the date string by "/"
    const [day, month, year] = dateString.split('/');

    // Create a new date object with the correct format (mm/dd/yyyy)
    const date = new Date(`${month}/${day}/${year}`);

    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }

    // Format the date in 'id-ID' locale (Indonesia format)
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  } catch (error) {
    return 'Invalid Date';
  }
}

function generateHeader(formType) {
  return `
          <div class="flex justify-between items-start text-xs mb-0">
              <div>
                  <p class="font-bold">PT PLN (PERSERO)</p>
                  <p>UPT Banda Aceh</p>
              </div>
              <div class="border border-black px-4 py-2 text-black font-bold text-xs">
                  ${formType}
              </div>
          </div>
      `;
}

function generateContentSection(record, formType) {
  // Get the recipient dynamically based on formType
  const recipient =
    typeof formConfig[formType].penerima === 'function'
      ? formConfig[formType].penerima(record)
      : formConfig[formType].penerima;

  // Conditionally render the first row of the table based on formType
  const firstRow =
    formType !== 'Form FPPT-01'
      ? ''
      : `
        <tr>
          <td>1. Perusahaan</td>
          <td>: KSO PT PALMA NAFINDO PRATAMA - PT SANOBAR GUNAJAYA</td>
        </tr>
      `;

  // Dynamically handle the numbering
  let rowNumber = formType !== 'Form FPPT-01' ? 1 : 2;

  return `
        <h2 class="text-xs font-semibold text-center mb-0">${formConfig[formType].title}</h2>
        <!-- Display the recipient's name above the opening text -->
        <p class="text-xs font-bold text-left mb-2">Kepada Yth<br><span class="text-black">${recipient}</span></p>
        <p class="text-xs mb-0">${formConfig[formType].openingText}</p>
            
        <table style="font-size: 0.7rem; border-collapse: collapse; table-layout: fixed;">
          ${firstRow}
          <tr>
            <td>${rowNumber}. Hari, Tgl. Mulai</td>
            <td>: ${record.hariMulai}, ${formatDate(record.tanggalMulai)}</td>
          </tr>
          <!-- "s/d Hari, Tgl. Akhir" row without numbering -->
          <tr>
            <td>&nbsp;&nbsp;&nbsp;&nbsp;s/d Hari, Tgl. Akhir</td>
            <td>: ${record.hariSelesai}, ${formatDate(record.tanggalSelesai)}</td>
          </tr>
          <tr>
            <td>${rowNumber + 2}. Waktu Mulai s/d</td>
            <td>: ${record.jamMulai} s/d ${record.jamSelesai}</td>
          </tr>
          <tr>
            <td>${rowNumber + 3}. Durasi</td>
            <td>: ${record.durasiLembur} Jam</td>
          </tr>
          <tr>
            <td>${rowNumber + 4}. Untuk Kegiatan</td>
            <td>: ${record.kegiatanLembur}</td>
          </tr>
          <tr>
            <td colspan="2">Demikian dan terima kasih atas kerjasamanya.</td>
          </tr>
        </table>
      `;
}

function generateSignatureSection(record, formType, signatureData) {
  if (formType === 'Form FPPT-01') {
    return `
            <div class="flex justify-between  text-xs">
                <div></div>
                <div class="text-right">
                     <p>${record.kota}, ${formatDate(record.tanggalMulai)}</p>
                    <p>Pemohon,</p>
                    <p>${signatureData.makerPosition}</p>
                    <p class="font-semibold mt-6"><br><br><br>${signatureData.makerName}</p>
                </div>
            </div>`;
  } else if (formType === 'Form FPPT-02') {
    return `
            <div class="flex justify-between text-xs">
                <div></div>
                <div class="text-right">
                     <p>${record.kota}, ${formatDate(record.tanggalMulai)}</p>
                    <p>Yang Menugaskan,</p>
                    <p>Direksi Lapangan</p>
                    <p>${signatureData.approverPosition}</p>
                    <p>UPT BANDA</p
                    <p class="font-semibold mt-6"><br><br><br>${signatureData.approverName}</p>
                </div>
            </div>`;
  } else if (formType === 'Form FPPT-03') {
    return `
            <div class="flex justify-between  text-xs">
                <div class="text-left">
                    <p>Mengetahui,</p>
                    <p>${signatureData.makerPosition}</p>
                    <p class="font-semibold mt-6"><br><br><br><br>${signatureData.makerName}</p>
                </div>
                <div class="text-right">
                    <p>${record.kota}, ${formatDate(record.tanggalMulai)}</p>
                    
                    <P>Yang Menugaskan/ Memerintahkan,</p>
                    <p>DIREKTUR</p>
                    <p>KSO PT PALMA NAFINDO PRATAMA - PT SANOBAR GUNAJAYA</p>
                    
                    <p class="font-semibold mt-6"><br><br><br>RIZKY NAHARDI</p>
                </div>
            </div>`;
  }
}

export async function fetchAndRenderData() {
  try {
    const response = await fetch('https://rj.up.railway.app/api/google-sheets/lembur-lembar/');
    if (!response.ok) throw new Error('Failed to fetch data');

    const rawData = await response.json();
    console.log(rawData);
    const transformedData = rawData.data.slice(1).map((item, index) => ({
      // Extract day name in Indonesian from Tanggal Selesai
      // Assuming item[14] contains the date in dd/mm/yyyy format

      namaDriver: item[2],
      unitKerja: item[3],
      tanggalMulai: item[5],
      hariMulai: item[6],
      jamMulai: item[8],
      tanggalSelesai: item[14],
      hariSelesai: getIndonesianDayName(item[14]),
      jamSelesai: item[9],
      durasiLembur: item[10],
      kegiatanLembur: item[4],
      kota: 'Banda Aceh',
      id: `record-${index}`,
    }));

    // Extract tanggalMulai of the first record
    const firstRecordTanggalMulai = transformedData[1].tanggalMulai; // Assuming it's in dd/mm/yyyy format
    const [day, month, year] = firstRecordTanggalMulai.split('/'); // Split it into day, month, and year

    // Define month names in Indonesian
    const bulanNames = [
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

    // Define bulanTagihan
    const bulanTagihan = `${bulanNames[parseInt(month) - 1]} ${year}`;

    // Calculate bulanMasukTagihan (next month)
    let nextMonth = parseInt(month) + 1;
    let nextYear = year;
    if (nextMonth > 12) {
      nextMonth = 1;
      nextYear = (parseInt(year) + 1).toString(); // Handle year transition
    }
    const bulanMasukTagihan = `${bulanNames[nextMonth - 1]} ${nextYear}`;

    console.log('Bulan Tagihan:', bulanTagihan); // Example: "Januari 2024"
    console.log('Bulan Masuk Tagihan:', bulanMasukTagihan); // Example: "Februari 2024"

    const cardContainer = document.getElementById('card-container'); // Directly targeting the container for cards

    transformedData.forEach((record) => {
      const signatureData = getSignatureData(record.unitKerja);

      // Add bulanTagihan and bulanMasukTagihan to signatureData
      signatureData.bulanTagihan = bulanTagihan;
      signatureData.bulanMasukTagihan = bulanMasukTagihan;

      // Create a card component for each record with a unique ID
      const cardWrapper = document.createElement('div');
      cardWrapper.id = `card-${record.id}`;
      cardWrapper.className = 'w-full p-2 mb-2 border border-white rounded-lg bg-white'; // Set the size for each card

      // Add the forms inside the card component
      const cardContent = ['Form FPPT-01', 'Form FPPT-02', 'Form FPPT-03']
        .map((formType) => {
          return `  
                      <div id="${record.id}-${formType
            .replace(/\s+/g, '-')
            .toLowerCase()}" class="mb-6 border border-black rounded-lg p-4">
                          ${generateHeader(formType)}
                          ${generateContentSection(record, formType)}
                          ${generateSignatureSection(record, formType, signatureData)}
                      </div><hr class"bg-red">`;
        })
        .join('');

      cardWrapper.innerHTML = `
                  ${cardContent}
              `;

      // Append the card directly to the body container
      cardContainer.appendChild(cardWrapper);
    });
  } catch (error) {
    console.error('Error fetching or rendering data:', error);
  }
}
