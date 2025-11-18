// Handle form submission
document.getElementById('addUserForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  
  try {
    const response = await fetch('/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      // Show success message
      showSuccessMessage();
      
      // Clear form
      document.getElementById('addUserForm').reset();
      
      // Reload page to show new user
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      alert('Error: ' + data.error);
    }
  } catch (error) {
    alert('Error adding user: ' + error.message);
  }
});

// Show success message
function showSuccessMessage() {
  const message = document.getElementById('successMessage');
  message.classList.remove('hidden');
  
  setTimeout(() => {
    message.classList.add('hidden');
  }, 3000);
}
