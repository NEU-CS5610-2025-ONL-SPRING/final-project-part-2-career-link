const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Get applications for a specific employer's job
const getEmployerApplicationsForJob = async (req, res) => {
  const { jobId } = req.query;
  if (!jobId) {
    return res.status(400).json({ error: "Job ID is required" });
  }

  try {
    const applications = await prisma.application.findMany({
      where: { jobId: parseInt(jobId) },
      include: {
        job: {
          select: {
            title: true,
          },
        },
        user: {
          select: {
            username: true,
            email: true,
          },
        },
      },
    });

    const formattedApplications = applications.map((app) => ({
      id: app.id,
      jobId: app.jobId,
      jobTitle: app.job.title,
      applicantId: app.userId,
      applicantName: app.user.username,
      status: app.status,
      createdAt: app.appliedAt
        ? new Date(app.appliedAt).toLocaleDateString()
        : "Invalid Date",
    }));

    res.json(formattedApplications);
  } catch (error) {
    console.error("Error fetching applications for the job:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update application status
const updateApplicationStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; 

  try {
    const application = await prisma.application.update({
      where: { id: parseInt(id) },
      data: { status },
    });
    res.json(application);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update application status' });
  }
};


const getUserApplications = async (req, res) => {
  try {
    const applications = await prisma.application.findMany({
      where: { userId: parseInt(req.params.userId) },
      include: {
        job: {
          include: {
            company: {
              select: {
                name: true,
                location: true,
              },
            },
          },
        },
      },
      orderBy: {
        appliedAt: "desc",
      },
    });

    res.json(applications);
  } catch (error) {
    console.error("Error fetching user applications:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Create new application
const createApplication = async (req, res) => {
  try {
    const { jobId, userId } = req.body;

    if (parseInt(userId) !== req.user.userId) {
      return res
        .status(403)
        .json({ error: "Not authorized to apply for this user" });
    }

    const existingApp = await prisma.application.findFirst({
      where: {
        jobId: parseInt(jobId),
        userId: parseInt(userId),
      },
    });

    if (existingApp) {
      return res.status(400).json({ error: "Already applied to this job" });
    }

    // Create new application
    const application = await prisma.application.create({
      data: {
        jobId: parseInt(jobId),
        userId: parseInt(userId),
        status: "APPLIED",
      },
      include: {
        job: {
          include: {
            company: true,
          },
        },
      },
    });

    res.status(201).json(application);
  } catch (error) {
    console.error("Error creating application:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getEmployerApplicationsForJob,
  updateApplicationStatus,
  getUserApplications,
  createApplication,
};
