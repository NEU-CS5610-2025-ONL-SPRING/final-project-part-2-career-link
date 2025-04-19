import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Stack,
  Container,
  Paper,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Divider,
  Button,
} from "@mui/material";
import { styled } from "@mui/system";
import { useParams, useNavigate } from "react-router-dom";

import SkillsView from "../skills/SkillsView";
import ResumeView from "../resume/ResumeView";
import EducationView from "../education/EducationView";
import ExperienceView from "../experience/ExperienceView";
import ProjectView from "../project/ProjectView";
import { fetchGetWithAuth } from "../../auth/fetchWithAuth";


// Styled containers
const ProfileContainer = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  background: `linear-gradient(145deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
  paddingTop: theme.spacing(6),
  paddingBottom: theme.spacing(6),
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
}));

const ProfileContent = styled(Container)(({ theme }) => ({
  width: "100%",
  maxWidth: "950px",
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[4],
  padding: theme.spacing(4),
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
  },
}));

const SectionCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  marginBottom: theme.spacing(4),
  backgroundColor: theme.palette.grey[50],
  boxShadow: theme.shadows[1],
  transition: "transform 0.2s ease-in-out",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: theme.shadows[3],
  },
}));

export default function CandidateProfileView() {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEmployee() {
      try {
        const data = await fetchGetWithAuth(
          `${process.env.REACT_APP_API_URL}/api/users/${employeeId}`
        );
        setEmployee(data);
      } catch (err) {
        console.error("Failed to fetch user profile", err);
      } finally {
        setLoading(false);
      }
    }

    if (employeeId) fetchEmployee();
  }, [employeeId]);

  if (loading) {
    return (
      <ProfileContainer>
        <CircularProgress />
      </ProfileContainer>
    );
  }

  if (!employee) {
    return (
      <ProfileContainer>
        <Typography color="error">❌ User not found.</Typography>
      </ProfileContainer>
    );
  }

  return (
    <ProfileContainer>
      <ProfileContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Typography variant={isMobile ? "h5" : "h4"} fontWeight="bold" color="primary">
            Candidate Profile
          </Typography>
          <Button variant="outlined" onClick={() => navigate(-1)}>
            ← Back
          </Button>
        </Stack>

        <Divider sx={{ mb: 3 }} />

        <SectionCard>
          <Typography variant="h6" gutterBottom>
            👤 Basic Info
          </Typography>
          <Stack spacing={1}>
            <Typography><strong>Name:</strong> {employee.username}</Typography>
            <Typography><strong>Email:</strong> {employee.email}</Typography>
            <Typography><strong>Role:</strong> {employee.role}</Typography>
          </Stack>
        </SectionCard>

        <SectionCard>
          <Typography variant="h6" gutterBottom>
            💡 Skills
          </Typography>
          <SkillsView skillsString={employee.skills || ""} />
        </SectionCard>

        <SectionCard>
          <Typography variant="h6" gutterBottom>
            📄 Resume
          </Typography>
          <ResumeView employeeUserId={employeeId} />
        </SectionCard>

        <SectionCard>
          <Typography variant="h6" gutterBottom>
            🎓 Education
          </Typography>
          <EducationView employeeUserId={employeeId} />
        </SectionCard>

        <SectionCard>
          <Typography variant="h6" gutterBottom>
            💼 Experience
          </Typography>
          <ExperienceView employeeUserId={employeeId} />
        </SectionCard>

        <SectionCard>
          <Typography variant="h6" gutterBottom>
            🛠️ Projects
          </Typography>
          <ProjectView employeeUserId={employeeId} />
        </SectionCard>
      </ProfileContent>
    </ProfileContainer>
  );
}
