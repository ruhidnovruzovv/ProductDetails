document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("registerForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const surname = document.getElementById("surname").value.trim();
    const email = document.getElementById("email").value.trim();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document
      .getElementById("confirmPassword")
      .value.trim();

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
    if (!usernameRegex.test(username)) {
      return showToast(
        "Username yalnız əlifba, rəqəm, alt xətt və tiredən ibarət olmalıdır (3-20 simvol)",
        "error"
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return showToast("Email düzgün formatda deyil!", "error");
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return showToast(
        "Şifrə güclü olmalıdır: ən azı 8 simvol, böyük/kiçik hərf, rəqəm və xüsusi simvol daxil edin.",
        "error"
      );
    }

    if (password !== confirmPassword) {
      return showToast("Şifrə və təsdiq şifrəsi uyğun deyil!", "error");
    }

    const existingUser = users.find(
      (u) => u.username === username || u.email === email
    );
    if (existingUser) {
      return showToast("Bu username və ya email artıq mövcuddur!", "error");
    }

    users.push({ name, surname, email, username, password, wishlist: [], basket: []});
    localStorage.setItem("users", JSON.stringify(users));

    showToast(
      "Qeydiyyat uğurla tamamlandı! İndi giriş edə bilərsiniz.",
      "success"
    );
    setTimeout(() => {
      window.location.href = "login.html";
    }, 3000);
  });

  const inputs = {
    username: {
      element: document.getElementById("username"),
      regex: /^[a-zA-Z0-9_-]{3,20}$/,
      error:
        "Username yalnız əlifba, rəqəm, alt xətt və tiredən ibarət olmalıdır (3-20 simvol).",
    },
    email: {
      element: document.getElementById("email"),
      regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      error: "Email düzgün formatda deyil!",
    },
    password: {
      element: document.getElementById("password"),
      regex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=]).{8,}$/,
      error:
        "Şifrə güclü olmalıdır: ən azı 8 simvol, böyük/kiçik hərf, rəqəm və xüsusi simvol daxil edin.",
    },
    confirmPassword: {
      element: document.getElementById("confirmPassword"),
      match: "password",
      error: "Şifrə və təsdiq uyğun deyil!",
    },
  };

  Object.keys(inputs).forEach((key) => {
    const input = inputs[key];
    input.element.addEventListener("input", () => {
      if (key === "confirmPassword") {
        const passwordValue = document.getElementById(input.match).value;
        if (input.element.value !== passwordValue) {
          showToast(input.error, "error");
          input.element.style.borderColor = "red";
        } else {
          input.element.style.borderColor = "green";
        }
      } else if (!input.regex.test(input.element.value)) {
        showToast(input.error, "error");
        input.element.style.borderColor = "red";
      } else {
        input.element.style.borderColor = "green";
      }
    });
  });

  const passwordInput = document.getElementById("password");
  const passwordIndicator = document.getElementById("passwordIndicator");

  passwordInput.addEventListener("keyup", () => {
    const password = passwordInput.value;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=]).{8,}$/;

    if (passwordRegex.test(password)) {
      passwordIndicator.textContent = "✔️";
      passwordIndicator.classList.add("strong");
      passwordIndicator.classList.remove("weak");
    } else {
      passwordIndicator.textContent = "❌";
      passwordIndicator.classList.add("weak");
      passwordIndicator.classList.remove("strong");
    }
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
});
