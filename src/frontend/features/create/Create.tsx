import React, { useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
import { useCreateSepMutation } from '../../services/API/sepAPI';

const Create = () => {
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const [createSep] = useCreateSepMutation();

  const submit = () => {
    createSep({ name, description })
      .then(() => {
        setName('');
        setDescription('');
      })
      .catch((e) => {
        setName('');
        setDescription('');
      });
  };
  return (
    <Box display="flex" justifyContent="center" p="24px">
      <Box
        width="100%"
        maxWidth="400px"
        mx="auto"
        display="flex"
        flexDirection="column"
        gap="32px"
      >
        <TextField
          label="Name"
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="Description"
          variant="outlined"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Button variant="contained" onClick={submit}>
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default Create;
