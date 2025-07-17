# WorkCRUD Jobs

A Single-Page Application (SPA) inspired by platforms like **Computrabajo**, **LinkedIn Jobs**, and **Elempleo**. It allows two types of users—**Job Seekers** and **Companies**—to interact through job postings, applications, and profile management.

---

## 🧑‍💼 Features

### 👤 Job Seekers

- Register and log in as a job seeker
- Create and edit a professional profile:
  - Full name
  - Email
  - CV (as a URL)
  - Skills
  - Work experience
- Browse available job offers
- Apply to jobs
- View application history

### 🏢 Companies

- Register and log in as a company
- Create and edit a company profile:
  - Company name
  - Logo/image (as a URL)
  - Industry/sector
  - Description
- Post new job offers with:
  - Job title
  - Description
  - Requirements
  - Salary (optional)
  - Work modality (on-site, hybrid, remote)
- Manage posted offers (edit or close)
- View list of applicants *(to be implemented)*

---

## 🛠️ Technologies Used

- HTML5 + CSS3
- JavaScript
- SPA structure using DOM manipulation
- Local in-memory mock backend (via `db.json`)

---

## 🚀 How to Run Locally

1. Clone or download this repository.
2. Place these files in the same folder:
   - `index.html`
   - `app.js`
   - `db.json`
3. Start a local HTTP server. Example using Python:

   ```bash
   python -m http.server 8000
   ```

4.	Open your browser and visit:
http://localhost:8000
5.	Register and log in as either:
	•	Job Seeker to apply to jobs
	•	Company to create job postings

⸻

🧪 Mock Users

You can use these mock credentials to test:

Seeker
	•	Email: alice@example.com
	•	Password: password

Company
	•	Email: hr@techcorp.com
	•	Password: password

⸻

🔐 Role-Based Access
	•	Job seekers cannot post jobs or view applicants.
	•	Companies cannot apply to jobs or browse job listings like seekers.
	•	Each view is securely separated in the SPA by role.

⸻

📂 Project Structure
 ```
/project-folder
├── index.html       # Main HTML file
├── app.js           # App logic and routing
├── db.json          # Simulated backend database
└── README.md        # Project documentation
 ```
 
🎯 Next Improvements
- Persistent data using JSON Server or a real database (MongoDB, Firebase, etc.)
- File uploads (CVs and logos)
- View applicants for each job
- Delete/close job postings
- Responsive design (Bootstrap/Material UI)
- Better input validation