// Function to fetch form fields from the mock server
async function fetchFormFields() {
    try {
        const response = await fetch('http://localhost:3000/formFields');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching form fields:', error);
    }
}

// Function to generate the form dynamically
async function generateForm() {
    const formFields = await fetchFormFields();
    const formContainer = document.getElementById('form-container');
    const formElement = document.createElement('form');

    formFields.forEach((field) => {
        const labelElement = document.createElement('label');
        labelElement.textContent = field.label;
        const inputElement = document.createElement('input');
        inputElement.type = field.type;
        inputElement.id = field.key;
        inputElement.maxLength = field.maxLength;

        formElement.appendChild(labelElement);
        formElement.appendChild(inputElement);
        formElement.appendChild(document.createElement('br'));
    });

    const submitButton = document.createElement('button');
    submitButton.textContent = 'Submit';
    formElement.appendChild(submitButton);

    formContainer.appendChild(formElement);

    // Add event listener to the submit button
    submitButton.addEventListener('click', async (event) => {
        event.preventDefault();
        const formData = new FormData(formElement);
        const submissionData = Object.fromEntries(formData);

        // Validate the form data
        if (!validateFormData(submissionData)) {
            alert('Please fill in all required fields correctly.');
            return;
        }

        // Post the submission data to the mock server
        try {
            const response = await fetch('http://localhost:3001/submissions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(submissionData),
            });
            const data = await response.json();
            console.log('Submission posted successfully:', data);
        } catch (error) {
            console.error('Error posting submission:', error);
        }

        // Fetch and display submissions
        await fetchAndDisplaySubmissions();
    });
}

// Function to validate form data
function validateFormData(formData) {
    // Implement form validation logic here
    // For example:
    if (!formData.user_name || !formData.mobile_no || !formData.email) {
        return false;
    }
    if (formData.mobile_no.length !== 10) {
        return false;
    }
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
        return false;
    }
    return true;
}

// Function to fetch and display submissions
async function fetchAndDisplaySubmissions() {
    try {
        const response = await fetch('http://localhost:3001/submissions');
        const data = await response.json();
        const submissionsContainer = document.getElementById('submissions-container');
        submissionsContainer.innerHTML = '';

        data.forEach((submission) => {
            const submissionCard = document.createElement('div');
            submissionCard.innerHTML = `
                <h2>Submission</h2>
                <p>Name: ${submission.user_name}</p>
                <p>Mobile Number: ${submission.mobile_no}</p>
                <p>Email: ${submission.email}</p>
            `;
            submissionsContainer.appendChild(submissionCard);
        });
    } catch (error) {
        console.error('Error fetching submissions:', error);
    }
}

// Initialize the form generation
generateForm();
