import { useAuthUser } from "../../auth/authContext";
import Education from "../education/Education";
import Experience from "../experience/Experience";
import Skills from "../skills/Skills";
import Project from "../project/Project";
import useMediaQuery from "@mui/material/useMediaQuery";


import {
  Box,
  Typography,
  Stack,
  Container,
  Paper,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/system";
import Resume from "../resume/Resume";

// Page container with background gradient
const ProfileContainer = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
  color: theme.palette.primary.contrastText,
  paddingTop: theme.spacing(6),
  paddingBottom: theme.spacing(6),
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
}));

// Main content wrapper
const ProfileContent = styled(Container)(({ theme }) => ({
  width: "100%",
  maxWidth: "1000px",
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[3],
  padding: theme.spacing(4),
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2), // smaller padding on mobile
  },
}));


// Styled section with card appearance
const SectionCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(1),
  marginBottom: theme.spacing(4),
  boxShadow: theme.shadows[1],
  backgroundColor: theme.palette.background.paper,
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2), // more compact
  },
}));

export default function Profile() {
  const { user } = useAuthUser();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));


  return (
    <ProfileContainer>
      <ProfileContent>
      <Typography variant={isMobile ? "h4" : "h3"}
          align="center"
          gutterBottom
          sx={{ fontWeight: "bold", color: theme.palette.primary.main }}
        >
          Profile
        </Typography>

        <SectionCard>
        <Typography variant={isMobile ? "h6" : "h5"} gutterBottom>
            Basic Info
          </Typography>
          <Stack spacing={1}>
            <Typography variant="body1">
              <strong>Name:</strong> {user?.username}
            </Typography>
            <Typography variant="body1">
              <strong>Email:</strong> {user?.email}
            </Typography>
            <Typography variant="body1">
              <strong>Role:</strong> {user?.role}
            </Typography>
          </Stack>
        </SectionCard>

        {user?.role === "JOB_SEEKER" && (
          <>
            <SectionCard>
              <Typography variant="h5" gutterBottom>
                Skills
              </Typography>
              <Skills />
            </SectionCard>

            <SectionCard>
              <Typography variant="h5" gutterBottom>
                Resume
              </Typography>
              <Resume />
            </SectionCard>

            <SectionCard>
              <Typography variant="h5" gutterBottom>
                Education
              </Typography>
              <Education />
            </SectionCard>

            <SectionCard>
              <Typography variant="h5" gutterBottom>
                Experience
              </Typography>
              <Experience />
            </SectionCard>

            <SectionCard>
              <Typography variant="h5" gutterBottom>
                Projects
              </Typography>
              <Project />
            </SectionCard>
          </>
        )}
      </ProfileContent>
    </ProfileContainer>
  );
}
