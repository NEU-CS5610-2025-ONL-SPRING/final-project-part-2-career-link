import React, { useEffect, useState } from "react";
import {
  Box,
  Chip,
  TextField,
  Button,
  Typography,
  Stack,
} from "@mui/material";
import { fetchPutWithAuth } from "../../auth/fetchWithAuth";
import { useAuthUser } from "../../auth/authContext";

export default function Skills() {
  const { user } = useAuthUser();
  const [skills, setSkills] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if(user.skills) {
      setSkills(user.skills.split(",").map((s) => s.trim()));
    }
  },[user])
  const handleAddSkill = () => {
    const skill = inputValue.trim();
    if (skill && !skills.includes(skill)) {
      setSkills([...skills, skill]);
    }
    setInputValue("");
  };

  const handleDeleteSkill = (skillToDelete) => {
    setSkills((prev) => prev.filter((skill) => skill !== skillToDelete));
  };

  const handleSave = async () => {
    if (!skills.length) {
      setError("Please add at least one skill.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const response = await fetchPutWithAuth(
        `${process.env.REACT_APP_API_URL}/api/user/${user.id}/skill`,
        { skills: skills.join(", ") }
      );

      if (!response.ok) {
        console.error("Failed to update skills");
        setError("Failed to save. Try again.");
      }
    } catch (e) {
      console.error("Error saving skills:", e);
      setError("Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  return (
    <Box sx={{ p: 1 }}>

      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <TextField
          label="Add Skill"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyPress}
          sx={{ flex: 1 }}
        />
        <Button variant="contained" onClick={handleAddSkill}>
          Add
        </Button>
      </Stack>

      <Box sx={{ mb: 2 }}>
        {skills.map((skill, idx) => (
          <Chip
            key={idx}
            label={skill}
            onDelete={() => handleDeleteSkill(skill)}
            sx={{ m: 0.5 }}
          />
        ))}
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={handleSave}
        disabled={saving}
      >
        {saving ? "Saving..." : "Save"}
      </Button>
    </Box>
  );
}
