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
let index = 0;
let isDeleting = false;

function animateTitle() {
    document.title = title.substring(0, index);

    if (isDeleting) {
        index--;
        if (index < 0) {
            isDeleting = false;
            index = 1; // Start typing from the first character
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