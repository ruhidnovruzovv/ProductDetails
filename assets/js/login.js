document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const usernameOrEmail = document.getElementById("loginUsername").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  const users = JSON.parse(localStorage.getItem("users")) || [];
  let loginAttempts = JSON.parse(localStorage.getItem("loginAttempts")) || {};
  const blockedUntil = loginAttempts[usernameOrEmail]?.blockedUntil || null;

  if (blockedUntil && new Date() < new Date(blockedUntil)) {
    const remainingTime = Math.ceil(
      (new Date(blockedUntil) - new Date()) / 1000 / 60
    );
    return showToast(
      `Hesab müvəqqəti bağlanıb. ${remainingTime} dəqiqə sonra cəhd edin.`,
      "error"
    );
  }

  const user = users.find(
    (u) =>
      (u.username === usernameOrEmail || u.email === usernameOrEmail) &&
      u.password === password
  );

  if (user) {
    localStorage.setItem("userStatus", true);
    localStorage.setItem("currentUser", JSON.stringify(user));
    delete loginAttempts[usernameOrEmail];
    localStorage.setItem("loginAttempts", JSON.stringify(loginAttempts));

    showToast("Uğurla daxil oldunuz!", "success");
    setTimeout(() => {
      window.location.href = "index.html";
    }, 3000);
  } else {
    if (!loginAttempts[usernameOrEmail]) {
      loginAttempts[usernameOrEmail] = { attempts: 0, blockedUntil: null };
    }

    loginAttempts[usernameOrEmail].attempts += 1;

    if (loginAttempts[usernameOrEmail].attempts >= 3) {
      loginAttempts[usernameOrEmail].blockedUntil = new Date(
        new Date().getTime() + 15 * 60000
      );
      showToast("Çox səhv cəhd! Hesab 15 dəqiqəlik bağlandı.", "error");
    } else {
      const remainingAttempts = 3 - loginAttempts[usernameOrEmail].attempts;
      showToast(
        `Səhv istifadəçi adı və ya şifrə. ${remainingAttempts} cəhd qalıb.`,
        "error"
      );
    }

    localStorage.setItem("loginAttempts", JSON.stringify(loginAttempts));
  }
});

const loginUsernameInput = document.getElementById("loginUsername");
const usernameIndicator = document.getElementById("usernameIndicator");

const loginPasswordInput = document.getElementById("loginPassword");
const passwordIndicator = document.getElementById("passwordIndicator");

loginPasswordInput.addEventListener("input", () => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=]).{8,}$/;

  if (passwordRegex.test(loginPasswordInput.value)) {
    passwordIndicator.textContent = "✔️";
    passwordIndicator.classList.add("valid");
    passwordIndicator.classList.remove("invalid");
  } else {
    passwordIndicator.textContent = "❌";
    passwordIndicator.classList.add("invalid");
    passwordIndicator.classList.remove("valid");
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
