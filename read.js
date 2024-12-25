const fetchData = async () => {
    try {
        const response = await fetch("https://rj.up.railway.app/api/google-sheets/list");
        const result = await response.json();

        console.log("API Response:", result.data); // Log API response for debugging

        if (result.data && Array.isArray(result.data) && result.data.length > 0) {
            // Extract the headers (first row of the response)
            const headers = result.data[0];
            const dataRows = result.data.slice(1); // Remove the header row from the data

            // Generate DataTable headers dynamically, replacing "_" with space
            const columns = headers.map((header, index) => ({
                title: header.replace(/_/g, ' '), // Replace underscores with spaces
                data: index.toString(), // Use index as a string for data mapping
            }));

            // Map dataRows to ensure each row matches the number of columns
            const sanitizedDataRows = dataRows.map(row =>
                headers.map((_, index) => row[index] || "") // Fill missing cells with an empty string
            );

            // Initialize DataTables
            $('#data-table').DataTable({
                destroy: true, // Allow re-initialization
                data: sanitizedDataRows, // Use sanitized data
                columns: columns, // Use dynamically generated columns
                order: [[1, 'desc']], // Sort by the second column (TANGGAL_INPUT)
                scrollX: true, // Enable horizontal scrolling
                autoWidth: false, // Prevent DataTables from automatically adjusting width
                createdRow: function (row, data, dataIndex) {
                    // Add Tailwind classes to each cell
                    $(row).find('td').addClass('break-words whitespace-normal p-2');
                },
            });
            
        } else {
            console.error("Invalid or empty data received from API.");
        }
    } catch (error) {
        console.error("Error fetching data:", error.message);
    }
};

fetchData();