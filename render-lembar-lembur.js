const formConfig = {
  'Form FPPT-01': {
    title: 'FORMULIR PERMOHONAN PEKERJAAN TAMBAH',
    openingText:
      'Sehubungan dengan rencana kegiatan yang akan dilaksanakan diluar jam kerja, maka diharapkan kerjasamanya dapat menugaskan perusahaan dibawah ini :',
    signatureRules: {
      rightSide: ['maker'],
    },
  },
  'Form FPPT-02': {
    title: 'FORMULIR PENUGASAN PEKERJAAN TAMBAH',
    openingText: 'Formulir ini berisi penugasan pekerjaan tambah dengan rincian sebagai berikut:',
    signatureRules: {
      rightSide: ['approver'],
    },
  },
  'Form FPPT-03': {
    title: 'FORMULIR KONFIRMASI PEKERJAAN TAMBAH',
    openingText: 'Konfirmasi atas pekerjaan tambah yang telah diselesaikan dengan detail sebagai berikut:',
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
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
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
              <div class="border px-4 py-2 text-red-600 font-bold text-xs">
                  ${formType}
              </div>
          </div>
      `;
}

function generateContentSection(record, formType) {
  return `
        <h2 class="text-xs font-semibold text-center mb-0">${formConfig[formType].title}</h2>
        <p class="text-xs mb-0">${formConfig[formType].openingText}</p>
        <div style="display: grid; grid-template-columns: auto 1fr; gap: 0; font-size: 0.7rem; padding: 0;">
          <div><strong>1. Perusahaan</strong></div> <div>: KSO PT PALMA NAFINDO PRATAMA - PT SANOBAR GUNAJAYA</div>
          <div><strong>2. Hari, Tgl. Mulai</strong></div> <div>: ${formatDate(record.tanggalMulai)}, ${formatDate(
    record.tanggalMulai
  )}</div>
          <div><strong>3. s/d Hari, Tgl. Akhir</strong></div> <div>: ${formatDate(record.tanggalSelesai)}, ${formatDate(
    record.tanggalSelesai
  )}</div>
          <div><strong>4. Waktu Mulai s/d</strong></div> <div>: ${record.jamMulai} s/d ${record.jamSelesai}</div>
          <div><strong>5. Durasi</strong></div> <div>: ${record.durasiLembur} Jam</div>
          <div><strong>6. Untuk Kegiatan</strong></div> <div>: ${record.kegiatanLembur}</div>
        </div>
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
                    <p class="font-semibold mt-6">${signatureData.makerName}</p>
                </div>
            </div>`;
  } else if (formType === 'Form FPPT-02') {
    return `
            <div class="flex justify-between text-xs">
                <div></div>
                <div class="text-right">
                    <p>${record.kota}, ${formatDate(record.tanggalMulai)}</p>
                    <p>Yang Menugaskan,</p>
                    <p>${signatureData.approverPosition}</p>
                    <p class="font-semibold mt-6">${signatureData.approverName}</p>
                </div>
            </div>`;
  } else if (formType === 'Form FPPT-03') {
    return `
            <div class="flex justify-between  text-xs">
                <div class="text-left">
                    <p>Mengetahui,</p>
                    <p>${signatureData.makerPosition}</p>
                    <p class="font-semibold mt-6">${signatureData.makerName}</p>
                </div>
                <div class="text-right">
                    <p>${record.kota}, ${formatDate(record.tanggalMulai)}</p>
                    <p>PT PALMA,</p>
                    <p>DIREKTUR</p>
                    <p class="font-semibold mt-6">RIZKY NAHARDI</p>
                </div>
            </div>`;
  }
}

export async function fetchAndRenderData() {
  try {
    const response = await fetch('https://rj.up.railway.app/api/google-sheets/lembur-lembar/');
    if (!response.ok) throw new Error('Failed to fetch data');

    const rawData = await response.json();
    const transformedData = rawData.data.slice(1).map((item, index) => ({
      namaDriver: item[2],
      unitKerja: item[3],
      tanggalMulai: item[5],
      hariMulai: item[6],
      jamMulai: item[10],
      tanggalSelesai: item[7],
      hariSelesai: item[8],
      jamSelesai: item[11],
      durasiLembur: item[12],
      kegiatanLembur: item[4],
      kota: 'Banda Aceh',
      id: `record-${index}`,
    }));

    const container = document.getElementById('form-container');
    container.innerHTML = ''; // Clear the container before rendering

    transformedData.forEach((record) => {
      const signatureData = getSignatureData(record.unitKerja);

      // Create a card component for each record with a unique ID
      const cardWrapper = document.createElement('div');
      cardWrapper.id = `card-${record.id}`;
      cardWrapper.className = 'p-8 mb-8 border border-gray-300 rounded-lg shadow-lg bg-white';

      // Add the forms inside the card component
      const cardContent = ['Form FPPT-01', 'Form FPPT-02', 'Form FPPT-03']
        .map((formType) => {
          return `
                    <div id="${record.id}-${formType
            .replace(/\s+/g, '-')
            .toLowerCase()}" class="mb-6 border border-gray-300 rounded-lg p-4">
                        ${generateHeader(formType)}
                        ${generateContentSection(record, formType)}
                        ${generateSignatureSection(record, formType, signatureData)}
                    </div>`;
        })
        .join('');

      // Append the generated forms to the card component
      cardWrapper.innerHTML = `
                <h3 class="text-xl font-bold mb-4">Record ID: ${record.id}</h3>
                ${cardContent}
            `;

      // Append the card to the main container
      container.appendChild(cardWrapper);
    });
  } catch (error) {
    console.error('Error fetching or rendering data:', error);
  }
}
