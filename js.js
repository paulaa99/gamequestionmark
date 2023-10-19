document.addEventListener("DOMContentLoaded", function () {
    let profiles = []; // Initialize an empty array to store profiles

    fetch('nombres.json') // Fetch the JSON data
        .then(response => response.json())
        .then(data => {
            profiles = data; // Assign the data to the profiles array

            let selectedProfiles = []; // Array to store selected profiles

            // Add event listeners to buttons
            const buttons = document.querySelectorAll("button[data-card]");
            buttons.forEach(button => {
                button.addEventListener("click", function () {
                    if (selectedProfiles.length >= 3) {
                        return; // Stop further selections after three cards
                    }

                    const cardNumber = this.getAttribute("data-card");
                    const randomIndex = Math.floor(Math.random() * profiles.length);
                    const randomProfile = profiles[randomIndex];

                    const selectedCard = document.getElementById(`card${cardNumber}`);
                    const cardImage = selectedCard.querySelector(".card-img-top");
                    const cardTitle = selectedCard.querySelector(".card-title");

                    cardImage.src = randomProfile.image;
                    cardTitle.textContent = randomProfile.name;

                    selectedProfiles.push(randomProfile);

                    if (selectedProfiles.length === 3) {
                        disableChooseButtons();
                    }
                });
            });

            function disableChooseButtons() {
                buttons.forEach(button => {
                    button.disabled = true;
                });
            }
        })
        .catch(error => {
            console.error("Error fetching profiles:", error);
        });
});
