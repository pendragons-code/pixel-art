// JavaScript for the Help Modal
const helpButton = document.getElementById("helpButton");
const helpModal = document.getElementById("helpModal");
const closeButton = document.getElementsByClassName("close")[0];

helpButton.addEventListener("click", () => {
	helpModal.style.display = "block";
});

closeButton.addEventListener("click", () => {
	helpModal.style.display = "none";
});

window.addEventListener("click", (event) => {
	if (event.target == helpModal) {
		helpModal.style.display = "none";
	}
});

