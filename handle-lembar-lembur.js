export async function generatePDF() {
  const container = document.getElementById('form-container');
  const recordCards = container.querySelectorAll('[id^="card-"]'); // Target each card component for PDF generation
  const tempPDFs = []; // Store PDFs before merging

  // Create a progress bar and add it to the container
  const progressWrapper = document.createElement('div');
  progressWrapper.classList.add('w-full', 'bg-gray-200', 'rounded-full', 'h-4', 'my-4');
  container.appendChild(progressWrapper);

  const progressBar = document.createElement('div');
  progressBar.classList.add('bg-blue-500', 'h-4', 'rounded-full');
  progressWrapper.appendChild(progressBar);

  // Set the initial progress to 0%
  progressBar.style.width = '0%';

  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF(); // Create a new jsPDF instance

  // Start processing each record card
  for (let index = 0; index < recordCards.length; index++) {
    const cardElement = recordCards[index];

    // Extract text content from the card
    const cardText = cardElement.innerText || cardElement.textContent;

    // Add the extracted text to the PDF
    pdf.text(cardText, 10, 10 + index * 20); // Position the text in the PDF

    // Update the progress bar
    const progress = ((index + 1) / recordCards.length) * 100;
    progressBar.style.width = `${progress}%`; // Update the progress bar width
  }

  // Save the generated PDF to a Blob
  const pdfBlob = pdf.output('blob');

  // Create a download link for the combined PDF
  const downloadLink = document.createElement('a');
  const pdfURL = URL.createObjectURL(pdfBlob);
  downloadLink.href = pdfURL;
  downloadLink.download = 'combined-records.pdf';
  downloadLink.click();
}
