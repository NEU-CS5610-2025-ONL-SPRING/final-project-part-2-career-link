const { PrismaClient, $Enums } = require('@prisma/client');
const prisma = new PrismaClient();

const getJobs = async (req, res) => {
  try {
    let where = {};
    let include = {
      company: {
        select: {
          name: true,
          location: true,
          website: true,
        },
      },
      employer: {
        select: {
          username: true,
          email: true,
        },
      },
    };

    // Add search filters (keep these for filtering)
    if (req.query.title) {
      where.title = { contains: req.query.title, mode: "insensitive" };
    }

    if (req.query.location) {
      where.location = { contains: req.query.location, mode: "insensitive" };
    }

    if (req.query.minSalary) {
      where.salary = { gte: parseInt(req.query.minSalary) };
    }

    const jobs = await prisma.job.findMany({
      where,
      include,
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const createJob = async (req, res) => {
  try {
    const { title, description, location, salary, requirements } = req.body;

    if (!title || !description || !location) {
      return res.status(400).json({ error: 'Title, description, and location are required' });
    }

    if (salary && isNaN(Number(salary))) {
      return res.status(400).json({ error: 'Salary must be a number' });
    }

    const employer = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { companyId: true, role: true }
    });

    if (!employer || employer.role !== $Enums.Role.EMPLOYER || !employer.companyId) {
      return res.status(403).json({ 
        error: 'Only employers associated with a company can post jobs' 
      });
    }

    const newJob = await prisma.job.create({
      data: {
        title,
        description,
        location,
        salary: salary ? Number(salary) : null,
        requirements,
        postedBy: req.user.userId, 
        companyId: employer.companyId  
      },
      include: {
        employer: {
          select: {
            username: true,
            email: true
          }
        },
        company: {
          select: {
            name: true
          }
        }
      }
    });

    res.status(201).json(newJob);
  } catch (error) {
    console.error('Job creation error:', error);
    res.status(500).json({ 
      error: 'Failed to create job',
      details: error.message 
    });
  }
};

module.exports = {
  getJobs,
  createJob
};