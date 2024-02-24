document.getElementById('repoForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const subtitle = document.getElementById('subtitle').value;
    const description = document.getElementById('description').value;
    const iconURL = document.getElementById('iconURL').value;
    const tintColor = document.getElementById('tintColor').value;

    // You can add more variables for other properties from the JSON here

    const jsonData = {
        name,
        subtitle,
        description,
        iconURL,
        tintColor,
        featuredApps: [],
        apps: [], // You can add an empty array or other values here as needed
        news: [] // You can add an empty array or other values here as needed
    };

    document.getElementById('jsonOutput').innerText = JSON.stringify(jsonData, null, 2);
});
