document.addEventListener("DOMContentLoaded", function() {
    const skills = {
        html: 80,
        css: 60, 
        js: 10
    };

    for (let skill in skills) {
        const bar = document.getElementById(`${skill}-bar`);
        const percentage = document.getElementById(`${skill}-percentage`);
        const skillLevel = skills[skill];

        bar.style.width = skillLevel + '%';
        percentage.textContent = skillLevel + '%';
    }
});
const title = "𝘨𝘢𝘮𝘢𝘤𝘩𝘪𝘬𝘪𝘯"; // The title you want to animate
let index = 1; // Start from the second character
let isDeleting = false;

function animateTitle() {
    document.title = title.charAt(0) + title.substring(1, index);

    if (isDeleting) {
        index--;
        if (index < 1) { // Ensure the first letter is never deleted
            isDeleting = false;
            index = 2; // Start typing from the second character
        }
    } else {
        index++;
        if (index > title.length) {
            isDeleting = true;
        }
    }

    setTimeout(animateTitle, isDeleting ? 100 : 200);
}

animateTitle();