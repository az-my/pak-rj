const API_LIST = "https://rj.up.railway.app/api/google-sheets/list";

let allData = [];
let maxColumns = 0;
let currentPage = 1;
const rowsPerPage = 5;

const fetchData = async () => {
    try {
        const response = await fetch(API_LIST);
        if (!response.ok) throw new Error(await response.text());
        const result = await response.json();

        console.log("API Response:", result);

        // Flatten data and find max columns
        allData = result.data.sort((a, b) => new Date(b[1]) - new Date(a[1])); // 1 = second column
        maxColumns = Math.max(...allData.map((row) => row.length));

        renderHeaders();
        renderTable();
        renderPagination();
    } catch (error) {
        console.error("Error fetching data:", error.message);
        const dataTable = document.getElementById("data-table");
        dataTable.innerHTML = `<tr>
            <td colspan="${maxColumns}" class="text-center text-red-600">
                Error fetching data: ${error.message}
            </td>
        </tr>`;
    }
};

const renderHeaders = () => {
    const dataTableHeader = document.getElementById("data-table-header");
    dataTableHeader.innerHTML = ""; // Clear existing headers

    for (let i = 0; i < maxColumns; i++) {
        const headerCell = document.createElement("th");
        headerCell.textContent = `Column ${i + 1}`; // Dynamic column names
        headerCell.className = "px-4 py-2 border";
        dataTableHeader.appendChild(headerCell);
    }
};

const renderTable = () => {
    const dataTable = document.getElementById("data-table");
    dataTable.innerHTML = ""; // Clear existing table content

    // Add table rows
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const pageData = allData.slice(start, end);

    pageData.forEach((row) => {
        const tableRow = document.createElement("tr");
        for (let i = 0; i < maxColumns; i++) {
            const tableCell = document.createElement("td");
            tableCell.textContent = row[i] || "N/A"; // Display "N/A" for empty fields
            tableCell.className = "px-4 py-2 border";
            tableRow.appendChild(tableCell);
        }
        dataTable.appendChild(tableRow);
    });

    if (pageData.length === 0) {
        const emptyRow = document.createElement("tr");
        const emptyCell = document.createElement("td");
        emptyCell.textContent = "No data available";
        emptyCell.className = "px-4 py-2 border text-center text-gray-500";
        emptyCell.colSpan = maxColumns; // Use maxColumns for column span
        emptyRow.appendChild(emptyCell);
        dataTable.appendChild(emptyRow);
    }
};

const renderPagination = () => {
    const paginationContainer = document.getElementById("pagination");
    paginationContainer.innerHTML = ""; // Clear existing pagination

    const totalPages = Math.ceil(allData.length / rowsPerPage);
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement("button");
        pageButton.textContent = i;
        pageButton.className = `px-3 py-1 mx-1 border rounded ${
            i === currentPage ? "bg-blue-500 text-white" : "bg-white text-blue-500"
        }`;
        pageButton.addEventListener("click", () => {
            currentPage = i;
            renderTable();
            renderPagination();
        });
        paginationContainer.appendChild(pageButton);
    }
};

// Fetch data on page load
fetchData();
