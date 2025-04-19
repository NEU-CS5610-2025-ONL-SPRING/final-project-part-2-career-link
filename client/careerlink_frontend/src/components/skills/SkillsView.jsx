import React, { useEffect, useState } from "react";
import { Box, Chip, Typography } from "@mui/material";

export default function SkillsView({ skillsString }) {
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    if (skillsString) {
      setSkills(skillsString.split(",").map((s) => s.trim()));
    }
  }, [skillsString]);

  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="h6" gutterBottom>
        Skills
      </Typography>

      {skills.length > 0 ? (
        <Box sx={{ mb: 2 }}>
          {skills.map((skill, idx) => (
            <Chip key={idx} label={skill} sx={{ m: 0.5 }} />
          ))}
        </Box>
      ) : (
        <Typography variant="body2" color="text.secondary">
          No skills listed.
        </Typography>
      )}
    </Box>
  );
}
