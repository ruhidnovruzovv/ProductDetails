document.addEventListener("DOMContentLoaded", () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const users = JSON.parse(localStorage.getItem("users")) || [];

  if (currentUser) {
    document.getElementById("name").value = currentUser.name;
    document.getElementById("surname").value = currentUser.surname;
    document.getElementById("email").value = currentUser.email;
    document.getElementById("username").value = currentUser.username;
  } else {
    window.location.href = "login.html";
  }

  document.getElementById("settingsForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const surname = document.getElementById("surname").value.trim();
    const email = document.getElementById("email").value.trim();
    const username = document.getElementById("username").value.trim();
    const currentPassword = document
      .getElementById("currentPassword")
      .value.trim();
    const newPassword = document.getElementById("newPassword").value.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=]).{8,}$/;

    if (currentUser.password !== currentPassword) {
      return showToast("Cari şifrə yanlışdır.", "error");
    }

    if (!emailRegex.test(email)) {
      return showToast("Email düzgün formatda deyil.", "error");
    }

    if (username.length < 3 || username.length > 20) {
      return showToast("Username 3-20 simvol aralığında olmalıdır.", "error");
    }

    if (newPassword && !passwordRegex.test(newPassword)) {
      return showToast(
        "Yeni şifrə zəifdir. Ən azı 8 simvol, bir böyük hərf, bir rəqəm və bir xüsusi simvol olmalıdır.",
        "error"
      );
    }

    const duplicateUser = users.find(
      (u) =>
        (u.email === email || u.username === username) &&
        u.username !== currentUser.username
    );

    if (duplicateUser) {
      return showToast("Eyni email və ya username mövcuddur.", "error");
    }

    currentUser.name = name;
    currentUser.surname = surname;
    currentUser.email = email;
    currentUser.username = username;

    if (newPassword) {
      currentUser.password = newPassword;
    }

    const updatedUsers = users.map((user) =>
      user.username === currentUser.username ? currentUser : user
    );

    localStorage.setItem("users", JSON.stringify(updatedUsers));
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
    showToast("Məlumatlar uğurla yeniləndi!", "success");
    setTimeout(() => {
      window.location.href = "index.html";
    }, 3000);
  });
});

function showToast(message, type) {
  Toastify({
    text: message,
    duration: 3000,
    gravity: "top",
    position: "right",
    backgroundColor: type === "success" ? "green" : "red",
    style: {
      width: "350px",
      fontSize: "14px",
    },
  }).showToast();
}
