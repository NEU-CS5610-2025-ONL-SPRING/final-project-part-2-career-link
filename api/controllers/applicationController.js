const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get applications for employer's jobs
const getEmployerApplications = async (req, res) => {
  try {
    const jobs = await prisma.job.findMany({
      where: { postedBy: req.user.userId },
      select: { id: true }
    });

    const jobIds = jobs.map(job => job.id);

    const applications = await prisma.application.findMany({
      where: { jobId: { in: jobIds } },
      include: {
        job: {
          select: {
            title: true
          }
        },
        user: {
          select: {
            username: true,
            email: true
          }
        }
      }
    });

    const formattedApplications = applications.map(app => ({
      id: app.id,
      jobId: app.jobId,
      jobTitle: app.job.title,
      applicantId: app.userId,
      applicantName: app.user.username,
      status: app.status,
      createdAt: app.createdAt
    }));

    res.json(formattedApplications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update application status
const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Verify the application belongs to one of the employer's jobs
    const application = await prisma.application.findUnique({
      where: { id: parseInt(id) },
      include: {
        job: true
      }
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Check if the job belongs to the current employer
    if (application.job.postedById !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized to update this application' });
    }

    // Update the status
    const updatedApplication = await prisma.application.update({
      where: { id: parseInt(id) },
      data: { status }
    });

    res.json(updatedApplication);
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getEmployerApplications,
  updateApplicationStatus
};
