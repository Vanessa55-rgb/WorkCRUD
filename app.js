// Mock backend (datos en memoria)
let db = {
  users: JSON.parse(`[
    {"id":1,"role":"seeker","email":"alice@example.com","password":"password","name":"Alice Smith","cvUrl":"","skills":[],"experience":"","applications":[]},
    {"id":2,"role":"company","email":"hr@techcorp.com","password":"password","companyName":"TechCorp","logoUrl":"","sector":"Technology","description":"","jobPosts":[]}
  ]`),
  jobPosts: [],
  applications: []
};

let currentUser = null;

// Utilidad para seleccionar por ID
function $(id) {
  return document.getElementById(id);
}

// Mostrar una sección y ocultar las demás
function showSection(id) {
  document.querySelectorAll("main section").forEach(section => section.classList.remove("active"));
  $(id).classList.add("active");
}

// Refrescar barra de navegación
function refreshNav() {
  let nav = $("navbar");
  nav.innerHTML = "";

  if (!currentUser) return;

  nav.innerHTML = `
    <span>Hello, ${currentUser.role === "seeker" ? currentUser.name : currentUser.companyName}</span> 
    <a href="#" id="nav-logout">Logout</a>
  `;

  $("nav-logout").onclick = () => {
    currentUser = null;
    showSection("section-welcome");
    refreshNav();
  };
}

// Navegación inicial
$("link-register").onclick = () => showSection("section-register");
$("link-login").onclick = () => showSection("section-login");
$("btn-register-cancel").onclick = () => showSection("section-welcome");
$("btn-login-cancel").onclick = () => showSection("section-welcome");

// Registro de usuario
$("btn-register").onclick = () => {
  let e = $("reg-email").value;
  let p = $("reg-pass").value;
  let r = $("reg-role").value;

  if (!e || !p) return alert("Email and password required");
  if (db.users.some(u => u.email === e)) return alert("Email already exists");

  let u = { id: Date.now(), email: e, password: p, role: r };

  if (r === "seeker") {
    Object.assign(u, { name: "", cvUrl: "", skills: [], experience: "", applications: [] });
  } else {
    Object.assign(u, { companyName: "", logoUrl: "", sector: "", description: "", jobPosts: [] });
  }

  db.users.push(u);
  alert("Registered — please log in.");
  showSection("section-login");
};

// Login de usuario
$("btn-login").onclick = () => {
  let e = $("login-email").value;
  let p = $("login-pass").value;
  let u = db.users.find(x => x.email === e && x.password === p);

  if (!u) return alert("Invalid email/password");

  currentUser = u;
  buildDashboard();
};

// Construir dashboard según rol
function buildDashboard() {
  refreshNav();

  if (currentUser.role === "seeker") {
    showSection("section-seeker-dashboard");
    $("seeker-content").innerHTML = "<p><em>Edit your profile or browse jobs.</em></p>";
    initSeeker();
  } else {
    showSection("section-company-dashboard");
    $("company-content").innerHTML = "<p><em>Edit company info or post a job.</em></p>";
    initCompany();
  }
}

/////////////////////////////////
// Funcionalidades del SEEKER
/////////////////////////////////
function initSeeker() {
  $("btn-edit-seeker-profile").onclick = editSeekerProfile;
  $("btn-view-jobs").onclick = displayJobs;
  $("btn-view-applications").onclick = displayApplications;
}

// Editar perfil del job seeker
function editSeekerProfile() {
  ["name", "cv", "skills", "exp"].forEach(field => {
    $(`seeker-${field}`).value = currentUser[field] || "";
  });

  showSection("section-seeker-profile-form");
}

$("btn-cancel-seeker-profile").onclick = () => showSection("section-seeker-dashboard");

$("btn-save-seeker-profile").onclick = () => {
  currentUser.name = $("seeker-name").value;
  currentUser.cvUrl = $("seeker-cv").value;
  currentUser.skills = $("seeker-skills").value.split(",").map(s => s.trim()).filter(Boolean);
  currentUser.experience = $("seeker-exp").value;

  alert("Profile updated");
  buildDashboard();
};

// Ver listado de trabajos disponibles
function displayJobs() {
  showSection("section-job-list");

  let container = $("job-list");
  container.innerHTML = "";

  db.jobPosts.filter(job => job.status === "open").forEach(job => {
    let company = db.users.find(u => u.id === job.companyId);

    let div = document.createElement("div");
    div.className = "job";
    div.innerHTML = `
      <h3>${job.title}</h3>
      <p><strong>Company:</strong> ${company.companyName}</p>
      <p>${job.description}</p>
      <p><em>${job.modality} • ${job.salary || "—"}</em></p>
      <button>Apply</button>
    `;

    div.querySelector("button").onclick = () => {
      if (currentUser.applications.includes(job.id)) return alert("Already applied");

      currentUser.applications.push(job.id);
      db.applications.push({ id: Date.now(), seekerId: currentUser.id, jobId: job.id });

      alert("Applied successfully!");
    };

    container.append(div);
  });

  $("btn-back-to-seeker").onclick = () => showSection("section-seeker-dashboard");
}

// Ver aplicaciones del job seeker
function displayApplications() {
  showSection("section-seeker-applications");

  let container = $("application-list");
  container.innerHTML = "";

  currentUser.applications.forEach(jobId => {
    let job = db.jobPosts.find(j => j.id === jobId);
    let company = db.users.find(u => u.id === job.companyId);

    let div = document.createElement("div");
    div.className = "job";
    div.innerHTML = `
      <h3>${job.title} at ${company.companyName}</h3>
      <p>Status: Pending</p>
    `;

    container.append(div);
  });

  $("btn-back-from-applications").onclick = () => showSection("section-seeker-dashboard");
}

/////////////////////////////////
// Funcionalidades de COMPANY
/////////////////////////////////
function initCompany() {
  $("btn-edit-company-profile").onclick = editCompanyProfile;
  $("btn-post-job").onclick = newJobForm;
}

// Editar perfil de empresa
function editCompanyProfile() {
  ["name", "logo", "sector", "desc"].forEach(field => {
    let value = currentUser[field === "name" ? "companyName" : field] || "";
    $(`company-${field}`).value = value;
  });

  showSection("section-company-profile-form");
}

$("btn-cancel-company-profile").onclick = () => showSection("section-company-dashboard");

$("btn-save-company-profile").onclick = () => {
  currentUser.companyName = $("company-name").value;
  currentUser.logoUrl = $("company-logo").value;
  currentUser.sector = $("company-sector").value;
  currentUser.description = $("company-desc").value;

  alert("Company profile saved");
  buildDashboard();
};

// Crear nuevo trabajo
function newJobForm() {
  ["job-id", "job-title", "job-desc", "job-req", "job-salary"].forEach(f => $(f).value = "");
  $("job-modality").value = "On-site";
  showSection("section-job-post-form");
}

$("btn-cancel-job").onclick = () => showSection("section-company-dashboard");

$("btn-save-job").onclick = () => {
  let id = $("job-id").value;

  let job = {
    id: id ? Number(id) : Date.now(),
    companyId: currentUser.id,
    title: $("job-title").value,
    description: $("job-desc").value,
    requirements: $("job-req").value,
    salary: $("job-salary").value,
    modality: $("job-modality").value,
    status: "open"
  };

  if (id) {
    let index = db.jobPosts.findIndex(j => j.id === job.id);
    db.jobPosts[index] = job;
  } else {
    db.jobPosts.push(job);
    currentUser.jobPosts.push(job.id);
  }

  alert("Job successfully posted");
  buildDashboard();
};
