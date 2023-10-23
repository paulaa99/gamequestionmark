document.addEventListener("DOMContentLoaded", function () {
    let profiles = []; // Initialize an empty array to store profiles
    let selectedProfiles = []; // Array to store selected profiles
    let personalityCounters = {}; // Object to store counters for each card
    let selectedCardNumbers = []; // Array to store the card numbers that have been selected

    // Fetch card data and initialize the page
    fetch('nombres.json')
        .then(response => response.json())
        .then(data => {
            profiles = data;
            initializePage();
        })
        .catch(error => {
            console.error("Error fetching profiles:", error);
        });

    function initializePage() {
        // Add event listeners to "Elegir carta" buttons
        const chooseButtons = document.querySelectorAll(".btn-primary");
        chooseButtons.forEach(button => {
            button.addEventListener("click", function () {
                const cardNumber = this.getAttribute("data-card");

                // Check if the card has already been selected
                if (selectedCardNumbers.includes(cardNumber)) {
                    return;
                }

                const randomIndex = Math.floor(Math.random() * profiles.length);
                const randomProfile = profiles[randomIndex];

                const selectedCard = document.getElementById(`card${cardNumber}`);
                const cardImage = selectedCard.querySelector(".card-img-top");
                const cardTitle = selectedCard.querySelector(".card-title");

                cardImage.src = randomProfile.image;
                cardTitle.textContent = randomProfile.name;

                const personalityButton = selectedCard.querySelector(".show-personality-button");
                personalityButton.removeAttribute("hidden");

                // Initialize the counter for this card if it doesn't exist
                if (!personalityCounters[cardNumber]) {
                    personalityCounters[cardNumber] = 0;
                }

                // Disable the "Show Personality" button for this card after three clicks
                if (personalityCounters[cardNumber] === 3) {
                    personalityButton.disabled = true;
                }

                selectedProfiles.push(randomProfile);

                button.disabled = true;
            });
        });

        // Function to check if all Show Personality buttons are disabled
        function arePersonalityButtonsDisabled() {
            const personalityButtons = document.querySelectorAll(".show-personality-button");
            return Array.from(personalityButtons).every(button => button.disabled);
        }

        // Add event listeners to "Show Personality" buttons
        const personalityButtons = document.querySelectorAll(".show-personality-button");
        personalityButtons.forEach(button => {
            button.addEventListener("click", function () {
                const selectedCard = this.closest(".card"); // Find the closest card to the button
                const cardNumber = selectedCard.getAttribute("id").replace("card", "");

                // Increment the counter for this card
                if (personalityCounters[cardNumber] < 3) {
                    personalityCounters[cardNumber]++;
                }

                // Disable the button if it has been clicked three times
                if (personalityCounters[cardNumber] === 3) {
                    button.disabled = true;
                }

                // Fetch personality information from personalities.json
                fetch('personalities.json')
                    .then(response => response.json())
                    .then(data => {
                        shuffle(data);
                        const personalityInfo = data[cardNumber - 1].ptrait;

                        const personalityParagraph = document.createElement("p");
                        personalityParagraph.textContent = personalityInfo;

                        const infoParagraph = selectedCard.querySelector(".info");
                        infoParagraph.appendChild(personalityParagraph);
                        infoParagraph.removeAttribute("hidden");

                        // Check if all Show Personality buttons are disabled
                        if (arePersonalityButtonsDisabled()) {
                            const chooseHeartthrobButton = document.getElementById("chooseHeartthrobButton");
                            chooseHeartthrobButton.removeAttribute("hidden");
                        }
                    })
                    .catch(error => {
                        console.error("Error fetching personality information:", error);
                    });
            });
        }
)}

function getRandomParagraph(jsonFile) {
    return fetch(jsonFile)
        .then(response => response.json())
        .then(data => {
            const randomIndex = Math.floor(Math.random() * data.length);
            return data[randomIndex].story;
        });
}

// Add event listener to "Choose Heartthrob" button
const chooseHeartthrobButton = document.getElementById("chooseHeartthrobButton");
chooseHeartthrobButton.addEventListener("click", function () {
    // Reveal the card names and make them clickable
    const cardNames = document.querySelectorAll(".card-title");
    cardNames.forEach(cardName => {
        cardName.style.cursor = "pointer";
        cardName.addEventListener("click", function () {
            const selectedCard = this.closest(".card");
            const cardNumber = selectedCard.getAttribute("id").replace("card", "");
            selectedCardNumbers.push(cardNumber);

            // Hide the other two cards
            document.querySelectorAll(".card").forEach(card => {
                if (card !== selectedCard) {
                    card.style.display = "none";
                }
            });

            // Show the selected card's personality info
            const personalityInfo = selectedCard.querySelector(".info");
            personalityInfo.style.display = "block";

            // Display the custom popup with a story
            const popup = document.getElementById("customAlert");
            popup.style.display = "block";

            // Fetch and display a random paragraph from each story JSON
            const paragraphPromises = [
                getRandomParagraph('story1.json'),
                getRandomParagraph('story2.json'),
                getRandomParagraph('story3.json')
            ];

            Promise.all(paragraphPromises)
                .then(paragraphs => {
                    const [paragraph1, paragraph2, paragraph3] = paragraphs;
                    const popupText = document.getElementById("popupText");
                    popupText.innerHTML = `«────── « ⋅ʚ♡ɞ⋅ » ──────» <br> <br>${paragraph1}<br><br>${paragraph2}<br><br>${paragraph3}<br> <br> ༻✦༺ 　༻✧༺　༻✦༺`;

                })
                .catch(error => {
                    console.error("Error fetching and displaying stories:", error);
                });
        });
    });

    // Disable the "Choose Heartthrob" button after the user makes a choice
    chooseHeartthrobButton.disabled = true;
});

// Add event listener to close the custom popup
const closePopup = document.getElementById("close");
closePopup.addEventListener("click", function () {
    const popup = document.getElementById("customAlert");
    popup.style.display = "none";
});


    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
});
