document.addEventListener("DOMContentLoaded", () => {
  const basketContainer = document.getElementById("basketItems");
  const totalPriceElement = document.getElementById("totalPrice");
  const removeAllButton = document.getElementById("removeAll");

  const getCurrentUser = () => JSON.parse(localStorage.getItem("currentUser"));
  const getUsers = () => JSON.parse(localStorage.getItem("users")) || [];
  const updateUser = (updatedUser) => {
    const users = getUsers();
    const userIndex = users.findIndex(
      (user) => user.username === updatedUser.username
    );
    if (userIndex > -1) {
      users[userIndex] = updatedUser;
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    }
  };

  const renderBasket = () => {
    const currentUser = getCurrentUser();
    if (
      !currentUser ||
      !currentUser.basket ||
      currentUser.basket.length === 0
    ) {
      basketContainer.innerHTML = "<p>Səbətiniz boşdur.</p>";
      totalPriceElement.textContent = `$0`;
      removeAllButton.classList.add("d-none");
      return;
    }

    const basket = currentUser.basket;

    basketContainer.innerHTML = "";
    basket.forEach((product, index) => {
      const basketItem = document.createElement("div");
      basketItem.className = "basket-item";

      const itemTotalPrice = (product.price * product.count).toFixed(2);

      basketItem.innerHTML = `
          <img id="basketImg" src="${product.image}" alt="${product.title}" />
          <div class="basket-info">
          <h3>${product.title.slice(0, 15) + "..."}</h3> 
          <p>Qiymət: $<span class="item-price">${itemTotalPrice}</span></p>
          </div>
          <div class="basket-controls">
            <button class="decrement">-</button>
            <span>${product.count}</span>
            <button class="increment">+</button>
          </div>
          <button class="remove">Sil</button>
        `;

      basketContainer.appendChild(basketItem);

      const itemPriceElement = basketItem.querySelector(".item-price");
      
      const productImage = basketItem.querySelector("#basketImg");
      productImage.addEventListener("click", () => {
        window.location.href = `/details.html?id=${product.id}`;
      });

      basketItem.querySelector(".increment").addEventListener("click", () => {
        basket[index].count += 1;
        currentUser.basket = basket;
        updateUser(currentUser);
        itemPriceElement.textContent = (
          product.price * basket[index].count
        ).toFixed(2);
        renderBasket();
      });

      basketItem.querySelector(".decrement").addEventListener("click", () => {
        if (basket[index].count > 1) {
          basket[index].count -= 1;
          currentUser.basket = basket;
          updateUser(currentUser);
          itemPriceElement.textContent = (
            product.price * basket[index].count
          ).toFixed(2);
          renderBasket();
        }
      });

      basketItem.querySelector(".remove").addEventListener("click", () => {
        basket.splice(index, 1);
        currentUser.basket = basket;
        updateUser(currentUser);
        renderBasket();
      });
    });

    const total = basket.reduce(
      (acc, product) => acc + product.price * product.count,
      0
    );
    totalPriceElement.textContent = `$${total.toFixed(2)}`;
    removeAllButton.classList.remove("d-none");
  };

  removeAllButton.addEventListener("click", () => {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    currentUser.basket = [];
    updateUser(currentUser);
    renderBasket();
  });

  renderBasket();
});
