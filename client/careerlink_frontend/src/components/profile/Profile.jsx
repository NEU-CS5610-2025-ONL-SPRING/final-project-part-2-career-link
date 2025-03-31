import { useAuthUser } from "../../auth/authContext";
import Education from "../education/Education";
import { Box, Typography, Stack, Container, Divider } from "@mui/material";
import { styled } from "@mui/system";

// Styled Box for the profile container
const ProfileContainer = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",  
  justifyContent: "flex-start",
  alignItems: "center",  
  background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(4),
}));

const ProfileContent = styled(Container)(({ theme }) => ({
  maxWidth: "800px",
  width: "100%",
  padding: theme.spacing(4),
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  borderRadius: theme.spacing(1),
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: theme.shadows[1],
}));


export default function Profile() {
  const { user } = useAuthUser();

  return (
    <ProfileContainer>
      <Typography variant="h3" textAlign="center" gutterBottom sx={{ marginTop: 4 }}>
        Profile
      </Typography>

      <ProfileContent>
        <Typography variant="h4" textAlign="left" gutterBottom>
          Basic Info
        </Typography>
        <Stack spacing={2}>
          <Typography variant="body1">
            <strong>Name:</strong> {user?.username}
          </Typography>
          <Typography variant="body1">
            <strong>Email:</strong> {user?.email}
          </Typography>
          <Typography variant="body1">
            <strong>Role:</strong> {user?.role}
          </Typography>

          {user?.role === "JOB_SEEKER" && (
            <>
              <Divider sx={{ marginY: 3 }} />
              <Box>
                <Typography variant="h4" textAlign="left" gutterBottom>
                  Education
                </Typography>
                <Education />
              </Box>
            </>
          )}
        </Stack>
      </ProfileContent>
    </ProfileContainer>
  );
}
