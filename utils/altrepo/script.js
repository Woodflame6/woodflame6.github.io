document.getElementById('importButton').addEventListener('click', function() {
    const jsonData = prompt('Paste your JSON data here:');
    try {
        const parsedData = JSON.parse(jsonData);
        populateForm(parsedData);
    } catch (error) {
        alert('Invalid JSON format!');
    }
});

document.getElementById('addAppButton').addEventListener('click', function() {
    const appInputs = document.getElementById('appInputs');
    const appTemplate = `
        <div class="app">
            <label>Name:</label>
            <input type="text" name="appName" required><br><br>
    
            <label>Bundle Identifier:</label>
            <input type="text" name="bundleIdentifier"><br><br>
    
            <label>Developer Name:</label>
            <input type="text" name="developerName"><br><br>
    
            <label>Subtitle:</label>
            <input type="text" name="appSubtitle"><br><br>
    
            <label>Description:</label><br>
            <textarea name="appDescription" rows="3" required></textarea><br><br>
    
            <label>Icon URL:</label>
            <input type="text" name="iconURL"><br><br>
    
            <label>Tint Color:</label>
            <input type="text" name="tintColor"><br><br>
    
            <button type="button" class="removeAppButton">Remove App</button>
            <hr>
        </div>
    `;
    const appWrapper = document.createElement('div');
    appWrapper.classList.add('appWrapper');
    appWrapper.innerHTML = appTemplate;
    appInputs.appendChild(appWrapper);
});

document.getElementById('repoForm').addEventListener('click', function(event) {
    if (event.target.classList.contains('removeAppButton')) {
        event.target.parentElement.remove();
    }
});

document.getElementById('repoForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const subtitle = document.getElementById('subtitle').value;
    const description = document.getElementById('description').value;
    const iconURL = document.getElementById('iconURL').value;
    const tintColor = document.getElementById('tintColor').value;

    const apps = Array.from(document.querySelectorAll('.appWrapper')).map(appWrapper => {
        const inputs = appWrapper.querySelectorAll('input, textarea');
        const appData = {};
        inputs.forEach(input => {
            appData[input.name] = input.value;
        });
        return appData;
    });

    const jsonData = {
        name,
        subtitle,
        description,
        iconURL,
        tintColor,
        apps,
        featuredApps: [],
        news: []
    };

    document.getElementById('jsonOutput').innerText = JSON.stringify(jsonData, null, 2);
});

function populateForm(data) {
    document.getElementById('name').value = data.name || '';
    document.getElementById('subtitle').value = data.subtitle || '';
    document.getElementById('description').value = data.description || '';
    document.getElementById('iconURL').value = data.iconURL || '';
    document.getElementById('tintColor').value = data.tintColor || '';

    if (data.apps && data.apps.length > 0) {
        const appInputs = document.getElementById('appInputs');
        appInputs.innerHTML = '';
        data.apps.forEach(app => {
            const appWrapper = document.createElement('div');
            appWrapper.classList.add('appWrapper');
            const appTemplate = `
                <div class="app">
                    <label>Name:</label>
                    <input type="text" name="appName" value="${app.name || ''}" required><br><br>
            
                    <label>Bundle Identifier:</label>
                    <input type="text" name="bundleIdentifier" value="${app.bundleIdentifier || ''}"><br><br>
            
                    <label>Developer Name:</label>
                    <input type="text" name="developerName" value="${app.developerName || ''}"><br><br>
            
                    <label>Subtitle:</label>
                    <input type="text" name="appSubtitle" value="${app.subtitle || ''}"><br><br>
            
                    <label>Description:</label><br>
                    <textarea name="appDescription" rows="3" required>${app.localizedDescription || ''}</textarea><br><br>
            
                    <label>Icon URL:</label>
                    <input type="text" name="iconURL" value="${app.iconURL || ''}"><br><br>
            
                    <label>Tint Color:</label>
                    <input type="text" name="tintColor" value="${app.tintColor || ''}"><br><br>
            
                    <button type="button" class="removeAppButton">Remove App</button>
                    <hr>
                </div>
            `;
            appWrapper.innerHTML = appTemplate;
            appInputs.appendChild(appWrapper);
        });
    }
}
