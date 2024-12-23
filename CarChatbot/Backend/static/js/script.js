document.getElementById('queryForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = document.getElementById('query').value;
    const responseDiv = document.getElementById('output');
    responseDiv.innerHTML = 'Processing...';

    try {
        const response = await fetch('/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query }),  // Send the query in JSON format
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();  // Parse JSON response
        responseDiv.innerHTML = `
            <h2>Response</h2>
            <p>${result.response}</p>
            <h3>Sources</h3>
            <ul>${result.sources.map(src => `<li>${src}</li>`).join('')}</ul>
        `;
    } catch (error) {
        console.error('Error:', error);
        responseDiv.innerHTML = 'An error occurred while processing your query.';
    }
});