// const emailInput = document.getElementById('email');
// const statusIcon = document.getElementById('status-icon');

// function validateEmail(input) {
//   const email = input.value.trim();
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//   if (email === '') {
//     resetFeedback();
//     return;
//   }

//   if (emailRegex.test(email)) {
//     showSuccess();
//   } else {
//     showError("Please enter a valid email address");
//   }
// }

// function showSuccess() {
//   emailInput.style.borderBottom = '2px solid #4BB543';
//   statusIcon.innerHTML = `<i class="fa-solid fa-check" style="color: #34d399;"></i>`;
//   statusIcon.style.display = 'block';
// }

// function showError() {
//   emailInput.style.borderBottom = '2px solid #FF2C2C';
//   statusIcon.innerHTML = `<i class="fa-solid fa-xmark" style="color: #f87171;"></i>`;
//   statusIcon.style.display = 'block';
// }

// function resetFeedback() {
//   emailInput.style.borderBottom = '2px solid #fff';
//   statusIcon.style.display = 'none';
// }