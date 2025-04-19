const express = require("express");
const cors = require("cors");
const healthCheckController = require("./controllers/healthCheckController");
const authController = require("./controllers/authController");
const educationController = require("./controllers/educationController.js");
const companiesController = require("./controllers/companyController.js");
const jobController = require("./controllers/jobController.js");
const applicationController = require("./controllers/applicationController.js");
const experienceController = require("./controllers/experienceController");
const skillsController = require("./controllers/skillController.js");
const projectController = require("./controllers/projectController.js");
const upload = require("./cloudinaryStorage.js");
const resumeController = require("./controllers/resumeController");

const cookieParser = require("cookie-parser");
const {
  requireAuth,
  requireEmployer,
  requireEmployee,
} = require("./authMiddleWare");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Health Check API's
app.get("/ping", healthCheckController.healthCheck);

// Auth API's
app.post("/login", authController.login);
app.post("/register", authController.signup);
app.post("/logout", authController.logout);
app.get("/api/users/token", requireAuth, authController.getUserByToken);

//Education API's
app.get(
  "/api/education/:userId",
  requireAuth,
  educationController.getEducation
);
app.post("/api/education/", requireEmployee, educationController.addEducation);
app.delete(
  "/api/education/:id",
  requireEmployee,
  educationController.deleteEducation
);
app.put(
  "/api/education/:id",
  requireEmployee,
  educationController.updateEducation
);

// Project API's
app.get("/api/projects/:userId", requireAuth, projectController.getProjects);

app.post("/api/projects", requireEmployee, projectController.addProject);

app.delete(
  "/api/projects/:id",
  requireEmployee,
  projectController.deleteProject
);

app.put("/api/projects/:id", requireEmployee, projectController.updateProject);

// Experience APIs
app.get(
  "/api/experience/:userId",
  requireAuth,
  experienceController.getExperience
);
app.post(
  "/api/experience/",
  requireEmployee,
  experienceController.addExperience
);
app.delete(
  "/api/experience/:id",
  requireEmployee,
  experienceController.deleteExperience
);
app.put(
  "/api/exprience/:id",
  requireEmployee,
  experienceController.updateExperience
);

// Company API's
app.get("/api/companies", companiesController.getAllCompanies);

// Job API's - Add these lines
app.get("/api/jobs", requireAuth, jobController.getJobs);
app.post("/api/jobs", requireEmployer, jobController.createJob);
app.put("/api/jobs/:id", requireEmployer, jobController.updateJob);
app.delete("/api/jobs/:id",requireEmployer, jobController.deleteJob);

// Application API's
app.get(
  "/api/applications/employer",
  requireEmployer,
  applicationController.getEmployerApplications
);
app.put(
  "/api/applications/:id/status",
  requireEmployer,
  applicationController.updateApplicationStatus
);

app.get(
  "/api/applications/:userId",
  requireEmployee,
  applicationController.getUserApplications
);
app.post(
  "/api/applications",
  requireEmployee,
  applicationController.createApplication
);

//Skills API's
app.get("/api/user/:userId/skill", requireAuth, skillsController.getSkill);
app.put(
  "/api/user/:userId/skill",
  requireEmployee,
  skillsController.updateSkill
);

//Resume API

app.post(
  "/api/resume",
  requireEmployee,
  upload.single("file"),
  resumeController.uploadResume
);

app.get("/api/resume/:userId", requireAuth, resumeController.getResumeUrl); 

app.get("/api/resume/analyze/:userId", requireAuth, resumeController.analyzeResume);


const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
