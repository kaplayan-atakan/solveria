// Show success message after successful form submission
function showSuccessMessage() {
    const successMessage = document.getElementById('signup-message');
    const form = document.getElementById('signupForm');
    
    // Show success message
    successMessage.classList.remove('hidden');
    
    // Scroll to message (optional)
    successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Reset the form
    form.reset();
}

// Alternative: All-in-one function with form parameter
function handleSignupSuccess(formElement) {
    document.getElementById('signup-message').classList.remove('hidden');
    document.getElementById('signup-message').scrollIntoView({ behavior: 'smooth' });
    formElement.reset();
}

// Usage examples:
// showSuccessMessage();
// OR
// handleSignupSuccess(document.getElementById('signupForm'));
