document.getElementById("emailForm").addEventListener("submit", function (e) {
  e.preventDefault(); // Prevent page reload

  let parms = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    subject: document.getElementById("subject").value,
    message: document.getElementById("message").value,
  };

  emailjs
    .send("service_7u3m8fb", "template_fgqz69a", parms)
    .then(() => {
      alert("✅ Email has been successfully sent!");
      document.getElementById("emailForm").reset();
    })
    .catch((error) => {
      alert("❌ Failed to send email. Check console for details.");
      console.error("EmailJS Error:", error);
    });
});
