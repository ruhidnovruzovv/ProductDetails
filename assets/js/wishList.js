document.addEventListener("DOMContentLoaded", () => {
  const userStatus = JSON.parse(localStorage.getItem("userStatus")) || false;
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (!userStatus || !currentUser) {
    showToast("Zəhmət olmasa, giriş edin.", "error");
    setTimeout(() => {
      window.location.href = "login.html";
    }, 3000);
    return;
  }

  const wishlistContainer = document.querySelector(".wishlist-items");

  if (currentUser.wishlist.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.className = "empty";
    emptyMessage.textContent = "Sevimli məhsullar siyahınız boşdur.";
    wishlistContainer.appendChild(emptyMessage);
  } else {
    currentUser.wishlist.forEach((product) => {
      const card = document.createElement("div");
      card.className = "card";

      const cardImage = document.createElement("div");
      cardImage.className = "card-image";
      const img = document.createElement("img");
      img.src = product.image;
      img.alt = product.title;
      cardImage.appendChild(img);
      card.appendChild(cardImage);

      const cardContent = document.createElement("div");
      cardContent.className = "card-content";

      const title = document.createElement("h3");
      title.textContent = product.title;
      cardContent.appendChild(title);

      const price = document.createElement("p");
      price.className = "price";
      price.textContent = `$${product.price}`;
      cardContent.appendChild(price);

      const rating = document.createElement("p");
      rating.className = "rating";
      const ratingValue = Math.floor(product.rating.rate);
      let stars = "";
      for (let i = 0; i < ratingValue; i++) {
        stars += "⭐";
      }
      rating.textContent = `Rating: ${stars}`;
      cardContent.append(rating);

      const removeBtn = document.createElement("button");
      removeBtn.className = "remove-btn";
      removeBtn.textContent = "Remove";
      removeBtn.addEventListener("click", () => {
        removeProductFromWishlist(product.id);
      });
      cardContent.appendChild(removeBtn);

      card.appendChild(cardContent);
      wishlistContainer.appendChild(card);
    });
  }

  const removeProductFromWishlist = (productId) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userIndex = users.findIndex(
      (user) => user.username === currentUser.username
    );
    currentUser.wishlist = currentUser.wishlist.filter(
      (item) => item.id !== productId
    );

    users[userIndex].wishlist = currentUser.wishlist;
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify(currentUser));

    showToast("Məhsul sevimlilərdən çıxarıldı.", "success");

    setTimeout(() => {
      location.reload();
    }, 1000);
  };

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
