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

