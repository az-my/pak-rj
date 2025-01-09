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
        <div class="flex justify-between items-start mb-8">
            <div>
                <p class="font-bold">PT PLN (PERSERO)</p>
                <p>UPT Banda Aceh</p>
            </div>
            <div class="border px-4 py-2 text-red-600 font-bold">
                ${formType}
            </div>
        </div>
    `;
}

function generateContentSection(record, formType) {
  return `
        <h2 class="text-lg font-semibold text-center mb-4">${formConfig[formType].title}</h2>
        <p>${formConfig[formType].openingText}</p>
        <div style="display: grid; grid-template-columns: auto 1fr; gap: 0.5rem;">
            <p><strong>1. Perusahaan</strong></p> <p>: KSO PT PALMA NAFINDO PRATAMA - PT SANOBAR GUNAJAYA</p>
            <p><strong>2. Hari, Tgl. Mulai</strong></p> <p>: ${formatDate(record.tanggalMulai)}, ${formatDate(
    record.tanggalMulai
  )}</p>
            <p><strong>   s/d Hari, Tgl. Akhir</strong></p> <p>: ${formatDate(record.tanggalMulai)}, ${formatDate(
    record.tanggalMulai
  )}
            <p><strong>3. Waktu Mulai s/d</strong></p> <p>: ${formatDate(record.tanggalMulai)} s/d ${formatDate(
    record.tanggalMulai
  )}</p>
            <p><strong>4. Durasi</strong></p> <p>: ${record.durasiLembur} Jam</p>
            <p><strong>5. Untuk Kegiatan</strong></p> <p>: ${record.kegiatanLembur}</p>
        </div>
    `;
}

function generateSignatureSection(record, formType, signatureData) {
  if (formType === 'Form FPPT-01') {
    return `
            <div class="flex justify-between mt-8">
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
            <div class="flex justify-between mt-8">
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
            <div class="flex justify-between mt-8">
                <div class="text-left">
                    <p>Mengetahui,</p>
                    <p>${signatureData.makerPosition}</p>
                    <p class="font-semibold mt-6">${signatureData.makerName}</p>
                </div>
                <div class="text-right">
                    <p>${record.kota}, ${formatDate(record.tanggalMulai)}</p>
                    <p>Yang Menugaskan,</p>
                    <p>${signatureData.approverPosition}</p>
                    <p class="font-semibold mt-6">${signatureData.approverName}</p>
                </div>
            </div>`;
  }
}

export async function fetchAndRenderData() {
  try {
    const response = await fetch('https://rj.up.railway.app/api/google-sheets/lembur-lembar/');
    if (!response.ok) throw new Error('Failed to fetch data');

    const rawData = await response.json();
    const transformedData = rawData.data.slice(1).map((item) => ({
      namaDriver: item[2],
      unitKerja: item[3],
      tanggalMulai: item[5],
      durasiLembur: item[12],
      kegiatanLembur: item[4],
      kota: 'Banda Aceh',
    }));

    const container = document.getElementById('form-container');
    container.innerHTML = '';

    transformedData.forEach((record) => {
      const signatureData = getSignatureData(record.unitKerja);
      ['Form FPPT-01', 'Form FPPT-02', 'Form FPPT-03'].forEach((formType) => {
        container.innerHTML += `
                    <div class="p-8 mb-8 border border-gray-300 rounded-lg">
                        ${generateHeader(formType)}
                        ${generateContentSection(record, formType)}
                        ${generateSignatureSection(record, formType, signatureData)}
                    </div>`;
      });
    });
  } catch (error) {
    console.error('Error fetching or rendering data:', error);
  }
}
