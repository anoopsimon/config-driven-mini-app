document.addEventListener("DOMContentLoaded", function() {
    fetch('data.json')
    .then(response => response.json())
    .then(jsonData => {
        var currentPageIndex = 0;

        function createLabel(text) {
            var label = document.createElement('label');
            label.textContent = text;
            label.style.fontWeight = 'bold';
            return label;
        }

        function createElement(element) {
            var wrapperDiv = document.createElement('div');
            if (element.question) {
                var questionLabel = createLabel(element.question);
                wrapperDiv.appendChild(questionLabel);
            }

            var inputElement;
            switch (element.type) {
                case "text":
                    inputElement = document.createElement('input');
                    inputElement.type = "text";
                    break;
                case "checkbox":
                    inputElement = document.createElement('input');
                    inputElement.type = "checkbox";
                    var checkboxLabel = document.createElement('label');
                    checkboxLabel.appendChild(inputElement);
                    checkboxLabel.appendChild(document.createTextNode(element.label || ''));
                    wrapperDiv.appendChild(checkboxLabel);
                    return wrapperDiv;
                case "dropdown":
                    inputElement = document.createElement('select');
                    element.options.forEach(option => {
                        var optionElement = document.createElement('option');
                        optionElement.value = option;
                        optionElement.text = option;
                        inputElement.appendChild(optionElement);
                    });
                    break;
                case "radio":
                    element.options.forEach(option => {
                        var radioInput = document.createElement('input');
                        radioInput.type = "radio";
                        radioInput.name = element.name;
                        radioInput.value = option;
                        var radioLabel = document.createElement('label');
                        radioLabel.appendChild(radioInput);
                        radioLabel.appendChild(document.createTextNode(option));
                        wrapperDiv.appendChild(radioLabel);
                    });
                    return wrapperDiv;
                // ... handle other types as needed ...
            }

            inputElement.name = element.name;
            inputElement.className = 'form-control';
            wrapperDiv.appendChild(inputElement);
            return wrapperDiv;
        }

        function renderPage(pageData) {
            var container = document.getElementById('appContainer');
            container.innerHTML = '';

            var form = document.createElement('div');
            form.className = 'form-group';

            pageData.elements.forEach(element => {
                var rowDiv = document.createElement('div');
                rowDiv.className = 'row mb-3';

                var inputDiv = document.createElement('div');
                inputDiv.className = 'col-12 col-md-6';

                var inputElement = createElement(element);
                inputDiv.appendChild(inputElement);
                rowDiv.appendChild(inputDiv);

                form.appendChild(rowDiv);
            });

            var navRowDiv = document.createElement('div');
            navRowDiv.className = 'row justify-content-between mt-4';

            if (pageData.navigation.previous) {
                var prevButtonDiv = document.createElement('div');
                prevButtonDiv.className = 'col-auto';

                var prevButton = document.createElement('button');
                prevButton.textContent = pageData.navigation.previous;
                prevButton.className = 'btn btn-secondary';
                prevButton.addEventListener('click', function() {
                    if (currentPageIndex > 0) {
                        currentPageIndex--;
                        renderPage(jsonData[currentPageIndex]);
                    }
                });

                prevButtonDiv.appendChild(prevButton);
                navRowDiv.appendChild(prevButtonDiv);
            }

            if (pageData.navigation.next) {
                var nextButtonDiv = document.createElement('div');
                nextButtonDiv.className = 'col-auto';

                var nextButton = document.createElement('button');
                nextButton.textContent = pageData.navigation.next;
                nextButton.className = 'btn btn-primary';
                nextButton.addEventListener('click', function() {
                    if (currentPageIndex < jsonData.length - 1) {
                        currentPageIndex++;
                        renderPage(jsonData[currentPageIndex]);
                    }
                });

                nextButtonDiv.appendChild(nextButton);
                navRowDiv.appendChild(nextButtonDiv);
            }

            form.appendChild(navRowDiv);
            container.appendChild(form);
        }

        renderPage(jsonData[currentPageIndex]);
    })
    .catch(error => console.error('Error loading JSON:', error));
});
