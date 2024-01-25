document.addEventListener("DOMContentLoaded", function() {

    var container = document.getElementById('appContainer');
    var loader = document.getElementById('loader');
    container.style.display = 'none';
    loader.style.display = 'block';

    fetch('data.json')
    .then(response => response.json())
    .then(jsonData => {
        setTimeout(() => {
            loader.style.display = 'none';
            container.style.display = 'block';
            renderPage(jsonData[0]);
        }, 1000); // 1000 milliseconds = 1 second

        var currentPageIndex = 0;

        function renderPage(pageData) {
            var container = document.getElementById('appContainer');
            container.innerHTML = '';

            var form = document.createElement('div');
            form.className = 'form-group';

            // Create elements based on pageData
            pageData.elements.forEach(element => {
                var rowDiv = document.createElement('div');
                rowDiv.className = 'row mb-3';

                var inputDiv = document.createElement('div');
                inputDiv.className = 'col-12 col-md-6'; // Adjust width on medium screens

                var inputElement = document.createElement('input');
                inputElement.type = element.type;
                inputElement.name = element.name;
                inputElement.placeholder = element.name;
                inputElement.className = 'form-control';
                inputElement.required = element.validation === 'required';

                inputDiv.appendChild(inputElement);
                rowDiv.appendChild(inputDiv);

                if (element.customJs) {
                    var script = document.createElement('script');
                    script.src = element.customJs;
                    rowDiv.appendChild(script);
                }

                form.appendChild(rowDiv);
            });

            // Navigation button row
            var navRowDiv = document.createElement('div');
            navRowDiv.className = 'row justify-content-end';

            var navButtonDiv = document.createElement('div');
            navButtonDiv.className = 'col-auto mt-2'; // Smaller column for the button

            var nextButton = document.createElement('button');
            nextButton.textContent = pageData.navigation.next;
            nextButton.className = 'btn btn-primary';
            // Optional: Set a custom width if necessary
            // nextButton.style.width = '150px'; // Example fixed width

            navButtonDiv.appendChild(nextButton);
            navRowDiv.appendChild(navButtonDiv);
            form.appendChild(navRowDiv);

            container.appendChild(form);

            nextButton.addEventListener('click', function() {
                if (currentPageIndex < jsonData.length - 1) {
                    currentPageIndex++;
                    renderPage(jsonData[currentPageIndex]);
                }
            });
        }

        // Initial render
        renderPage(jsonData[currentPageIndex]);
    })
    .catch(error => {
        console.error('Error loading JSON:', error);
        // Hide loader and optionally show an error message
        loader.style.display = 'none';
        container.innerHTML = '<p>Error loading content.</p>';
    });
});
