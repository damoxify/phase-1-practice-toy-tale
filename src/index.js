let addToy = false;

    document.addEventListener("DOMContentLoaded", () => {
      const addBtn = document.querySelector("#new-toy-btn");
      const toyFormContainer = document.querySelector(".container");
      const toyCollection = document.querySelector("#toy-collection");
      

      addBtn.addEventListener("click", () => {
        addToy = !addToy;
        if (addToy) {
          toyFormContainer.style.display = "block";
        } else {
          toyFormContainer.style.display = "none";
        }
      });

      // Fetch toy data and create toy cards
      fetch("http://localhost:3000/toys")
        .then(response => response.json())
        .then(data => {
          data.toys.forEach(toy => {
            const toyCard = document.createElement("div");
            toyCard.classList.add("card");
            toyCard.innerHTML = `
              <h2>${toy.name}</h2>
              <img src="${toy.image}" class="toy-avatar" />
              <p>${toy.likes} Likes</p>
              <button class="like-btn" id="${toy.id}">Like ❤️</button>
            `;
            toyCollection.appendChild(toyCard);

            const likeButton = toyCard.querySelector(".like-btn");
            likeButton.addEventListener("click", () => {
              const newLikes = toy.likes + 1;
              fetch(`http://localhost:3000/toys/${toy.id}`, {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                  Accept: "application/json"
                },
                body: JSON.stringify({
                  likes: newLikes
                })
              })
                .then(response => response.json())
                .then(updatedToy => {
                  toy.likes = updatedToy.likes;
                  toyCard.querySelector("p").textContent = `${toy.likes} Likes`;
                })
                .catch(error => console.error("Error updating likes:", error));
            });
          });
        })
        .catch(error => console.error("Error fetching toy data:", error));

      // Handle toy form submission
      const toyForm = document.querySelector(".add-toy-form");
      toyForm.addEventListener("submit", event => {
        event.preventDefault();
        const name = toyForm.querySelector("[name=name]").value;
        const image = toyForm.querySelector("[name=image]").value;
        const newToy = {
          name,
          image,
          likes: 0
        };
        fetch("http://localhost:3000/toys", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          body: JSON.stringify(newToy)
        })
          .then(response => response.json())
          .then(addedToy => {
            const newToyCard = document.createElement("div");
            newToyCard.classList.add("card");
            newToyCard.innerHTML = `
              <h2>${addedToy.name}</h2>
              <img src="${addedToy.image}" class="toy-avatar" />
              <p>${addedToy.likes} Likes</p>
              <button class="like-btn" id="${addedToy.id}">Like ❤️</button>
            `;
            toyCollection.appendChild(newToyCard);

            // Reset form values
            toyForm.reset();
          })
          .catch(error => console.error("Error adding new toy:", error));
      });
    });
