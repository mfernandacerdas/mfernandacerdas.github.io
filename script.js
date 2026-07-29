const projects = [
  {
    id: "badmintico",
    name: "Badmintico",
    date: "2026",
    type: "Client Project",
    description: `A full brand identity redesign, from zero, for the Costa Rican badminton product distributor 
    Badmintico: logo, mascot, theming. The direction leaned retro with a modern twist, while retaining the 
    essence of a national brand. A key focus was making the social media grid feel welcoming despite repetitive 
    product photography, without alienating the audience of serious, professional players.`,
    images: [
      "images/badmintico/badmintico_1.png",
      "images/badmintico/badmintico_2.png",
      "images/badmintico/badmintico_3.png",
      "images/badmintico/badmintico_4.png",
    ],
  },
  {
    id: "ExpoAnime",
    name: "Expo Anime Art",
    date: "2024",
    type: "Pro-bono Client Project",
    description: `A logo redesign and social media theming for the Costa Rican anime convention, Expo Anime Art. 
    The convention's next event fell in summer, so the redesign needed to reflect that seasonally while 
    staying aligned with current anime and V-tuber visual trends. As a small-scale pro-bono effort, 
    the goal was to give this grassroots convention a stronger identity heading into its 
    next season, along with a more consistent visual presence across its social media grid.`,
    images: [
      "images/expoanime/expoanime_1.png",
      "images/expoanime/expoanime_2.png",
      "images/expoanime/expoanime_3.png",
      "images/expoanime/expoanime_4.png",
    ],
  },
  {
    id: "Doughboys",
    name: "Doughboys",
    date: "2025",
    type: "University Project",
    description: `A university project to redesign a fictional pizzeria's logo, reimagining it as a 
    family-friendly restaurant that steps away from typical Italian imagery. 
    The goal was a logo that speaks to a clientele of young adults and families, 
    while positioning the restaurant as a trendy hub for foodies and food bloggers.`,
    images: [
      "images/doughboys/dougboys_1.png",
      "images/doughboys/dougboys_2.png",
    ],
  },
];

const orderedProjects = [...projects].sort((a, b) => Number(b.date) - Number(a.date));

// Render the project data

const sidebarList = document.getElementById("sidebar-list");
const grid = document.getElementById("grid");
const gridView = document.getElementById("grid-view");
const projectView = document.getElementById("project-view");
const backLink = document.getElementById("back-link");

const projectTitle = document.getElementById("project-title");
const projectMeta = document.getElementById("project-meta");
const projectDescription = document.getElementById("project-description");

const carouselImage = document.getElementById("carousel-image");
const carouselCounter = document.getElementById("carousel-counter");
const carouselPrev = document.getElementById("carousel-prev");
const carouselNext = document.getElementById("carousel-next");
const carouselContainer = document.querySelector(".project-carousel");

const averageColorCanvas = document.createElement("canvas");
const averageColorContext = averageColorCanvas.getContext("2d");

let currentProject = null;
let currentImageIndex = 0;

// Build sidebar links
orderedProjects.forEach((project) => {
  const item = document.createElement("a");
  item.href = "#";
  item.className = "sidebar-item";
  item.dataset.id = project.id;
  item.innerHTML = `${project.name}<span class="sidebar-date">${project.date}</span>`;
  item.addEventListener("click", (e) => {
    e.preventDefault();
    openProject(project.id);
  });
  sidebarList.appendChild(item);
});

// Build grid items
orderedProjects.forEach((project) => {
  const item = document.createElement("div");
  item.className = "grid-item";
  item.innerHTML = `
    <img src="${project.images[0]}" alt="${project.name}">
    <div class="grid-item-caption">${project.name}</div>
  `;
  item.addEventListener("click", () => openProject(project.id));
  grid.appendChild(item);
});

// Open a project
function openProject(id) {
  const project = orderedProjects.find((p) => p.id === id) || projects.find((p) => p.id === id);
  if (!project) return;

  currentProject = project;
  currentImageIndex = 0;

  projectTitle.textContent = project.name;
  projectMeta.textContent = `${project.date} — ${project.type}`;

  projectDescription.replaceChildren();
  const paragraphs = project.description
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.replace(/\n/g, " ").trim())
    .filter(Boolean);

  const fragment = document.createDocumentFragment();
  paragraphs.forEach((paragraph) => {
    const p = document.createElement("p");
    p.textContent = paragraph;
    fragment.appendChild(p);
  });
  projectDescription.appendChild(fragment);

  updateCarousel();

  gridView.style.display = "none";
  projectView.classList.add("visible");

  // highlight active sidebar item
  document.querySelectorAll(".sidebar-item").forEach((el) => {
    el.classList.toggle("active", el.dataset.id === id);
  });

  window.scrollTo(0, 0);
}

// Close the project view
function closeProject() {
  currentProject = null;
  projectView.classList.remove("visible");
  gridView.style.display = "block";
  document.querySelectorAll(".sidebar-item").forEach((el) => {
    el.classList.remove("active");
  });
}

backLink.addEventListener("click", (e) => {
  e.preventDefault();
  closeProject();
});

// Carousel helpers
function rgbToHsl(r, g, b) {
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const lightness = (max + min) / 2;

  let hue = 0;
  let saturation = 0;

  if (max !== min) {
    const delta = max - min;
    saturation = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);

    switch (max) {
      case red:
        hue = (green - blue) / delta + (green < blue ? 6 : 0);
        break;
      case green:
        hue = (blue - red) / delta + 2;
        break;
      default:
        hue = (red - green) / delta + 4;
        break;
    }

    hue /= 6;
  }

  return [hue, saturation, lightness];
}

function hslToRgb(h, s, l) {
  let r = 0;
  let g = 0;
  let b = 0;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      let temp = t;
      if (temp < 0) temp += 1;
      if (temp > 1) temp -= 1;
      if (temp < 1 / 6) return p + (q - p) * 6 * temp;
      if (temp < 1 / 2) return q;
      if (temp < 2 / 3) return p + (q - p) * (2 / 3 - temp) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function updateCarouselBackground(imageEl) {
  if (!averageColorContext || !carouselContainer) return;

  const width = 20;
  const height = 20;
  averageColorCanvas.width = width;
  averageColorCanvas.height = height;

  try {
    averageColorContext.clearRect(0, 0, width, height);
    averageColorContext.drawImage(imageEl, 0, 0, width, height);
    const data = averageColorContext.getImageData(0, 0, width, height).data;

    let r = 0, g = 0, b = 0, count = 0;
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const isEdge = x === 0 || x === width - 1 || y === 0 || y === height - 1;
        if (!isEdge) continue;

        const i = (y * width + x) * 4;
        const alpha = data[i + 3];
        if (alpha < 128) continue;

        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
        count += 1;
      }
    }

    if (!count) {
      carouselContainer.style.backgroundColor = "";
      return;
    }

    r = Math.round(r / count);
    g = Math.round(g / count);
    b = Math.round(b / count);

    const [h, s, l] = rgbToHsl(r, g, b);
    const softenedS = Math.max(0, s * 0.8); // saturation adjuster
    const lightenedL = Math.min(1, l + 0.02); // bright adjustment
    const [newR, newG, newB] = hslToRgb(h, softenedS, lightenedL);

    carouselContainer.style.backgroundColor = `rgb(${newR}, ${newG}, ${newB})`;
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    carouselCounter.classList.toggle("on-light", brightness > 150);
    carouselCounter.classList.toggle("on-dark", brightness <= 150);
  } catch (e) {
    console.warn("Couldn't read image color:", e);
  }
}

function updateCarousel() {
  if (!currentProject) return;
  const images = currentProject.images;
  const imageUrl = images[currentImageIndex];

  // Clear the previous color while the next image loads.
  if (carouselContainer) {
    carouselContainer.style.backgroundColor = "";
  }

  carouselImage.onload = () => {
    updateCarouselBackground(carouselImage);
  };
  carouselImage.onerror = () => {
    if (carouselContainer) {
      carouselContainer.style.backgroundColor = "";
    }
  };

  carouselImage.alt = `${currentProject.name} — image ${currentImageIndex + 1}`;
  carouselImage.src = imageUrl;
  carouselCounter.textContent = `${currentImageIndex + 1} / ${images.length}`;

  if (carouselImage.complete && carouselImage.naturalWidth) {
    updateCarouselBackground(carouselImage);
  }
}

carouselPrev.addEventListener("click", () => {
  if (!currentProject) return;
  const total = currentProject.images.length;
  currentImageIndex = (currentImageIndex - 1 + total) % total;
  updateCarousel();
});

carouselNext.addEventListener("click", () => {
  if (!currentProject) return;
  const total = currentProject.images.length;
  currentImageIndex = (currentImageIndex + 1) % total;
  updateCarousel();
});

// Arrow-key navigation
document.addEventListener("keydown", (e) => {
  if (!currentProject) return;
  if (e.key === "ArrowLeft") carouselPrev.click();
  if (e.key === "ArrowRight") carouselNext.click();
  if (e.key === "Escape") closeProject();
});
