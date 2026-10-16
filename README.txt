Desktop Portfolio
=================

Files
- index.html            page structure and all text content
- style.css             colors, fonts and layout (edit the :root variables at the top to restyle)
- script.js             windows, sound effects, theme toggle, skills filter, certificate viewer
- assets/certs/         certificate PDFs and their preview images (.jpg)
- assets/research/      research paper PDFs and first-page previews (.jpg)
- assets/projects/      project report PDFs and project photos (.jpg)
- assets/resume.pdf     your resume; resume.jpg and resume-large.jpg are its page images
- assets/profile/       your photo for the about window

How to use
1. Unzip the folder and keep the assets folder next to index.html.
2. Open index.html in any browser. No build step is needed.
3. To publish, upload everything (index.html, style.css, script.js and the assets folder) to Netlify, GitHub Pages or any static host.

Edit your details
- Replace the education, achievements, clubs, hobbies and contact text, and the placeholder "Project Three" card, in index.html.
- Skills are a list inside script.js.
- Opening index.html#projects (or #research, #certificates, #about, #contact and so on) opens that window directly.
- The light/dark button in the home bar switches themes.

Projects
- Each project is an <article class="proj"> block inside the projects window in index.html.
- The photos are buttons with data-src, data-title and data-sub; clicking one opens it in the large viewer.
- To add a project, copy an article block, put the photos (and report, if any) in assets/projects/ and update the text and file names.
- Use <div class="pshots one"> for a single wide photo, or <div class="pshots"> for a row of three.

Research papers
- Each paper is an <article class="paper"> block inside the research window in index.html.
- To add one: copy a block, put NAME.pdf and NAME.jpg in assets/research/
  (make the preview with: pdftoppm -jpeg -r 80 -f 1 -l 1 -singlefile NAME.pdf NAME), then update the text and file names.

Certificates
- The list is the "certs" array in script.js. Each entry has a title, issuer, date, note and a file name.
- To add one: put NAME.pdf and NAME.jpg in assets/certs/ (make the .jpg with: pdftoppm -jpeg -r 115 -singlefile NAME.pdf NAME),
  then add a line to the certs array. If the issuer is new, add it to the issuers list on the next line.

Sound effects
- Sounds are generated in the browser (no audio files). They start after the first click.
- The "sfx" button in the home bar turns them on or off and remembers the choice.
- To change a sound, edit the SFX list in script.js (each one is a few tone() calls).

Fonts load from Google Fonts, so the first load needs an internet connection.

Resume
- Opened from the "resume" icon (index.html#resume). To update it, replace assets/resume.pdf, then remake the two images:
  pdftoppm -jpeg -r 80 -f 1 -l 1 -singlefile resume.pdf resume   and   pdftoppm -jpeg -r 130 -f 1 -l 1 -singlefile resume.pdf resume-large
