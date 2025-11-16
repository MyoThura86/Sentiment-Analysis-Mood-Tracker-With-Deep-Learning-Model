import React from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Typography,
  Paper,
  Tooltip
} from '@mui/material';
import { Psychology, AutoAwesome, CompareArrows } from '@mui/icons-material';
import { useTranslation } from '../../hooks/useTranslation';

const ModelSelector = ({ selectedModel, onModelChange, showBoth = true }) => {
  const { t } = useTranslation();
  const models = [
    {
      value: 'roberta',
      label: t('modelSelector.robertaModel'),
      description: t('modelSelector.robertaDescription'),
      icon: <Psychology sx={{ color: '#2196f3' }} />,
      color: '#2196f3'
    },
    {
      value: 'lstm',
      label: t('modelSelector.lstmModel'),
      description: t('modelSelector.lstmDescription'),
      icon: <AutoAwesome sx={{ color: '#9c27b0' }} />,
      color: '#9c27b0'
    }
  ];

  if (showBoth) {
    models.unshift({
      value: 'both',
      label: t('modelSelector.bothModels'),
      description: t('modelSelector.bothDescription'),
      icon: <CompareArrows sx={{ color: '#ff9800' }} />,
      color: '#ff9800'
    });
  }

  const selectedModelData = models.find(m => m.value === selectedModel);

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        borderRadius: 3,
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
        border: '1px solid rgba(102, 126, 234, 0.1)'
      }}
    >
      <Box display="flex" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight="bold" sx={{ mr: 2 }}>
          {t('modelSelector.title')}
        </Typography>
        {selectedModelData && (
          <Chip
            icon={selectedModelData.icon}
            label={selectedModelData.label}
            sx={{
              backgroundColor: selectedModelData.color + '20',
              color: selectedModelData.color,
              fontWeight: 'bold',
              '& .MuiChip-icon': {
                color: selectedModelData.color
              }
            }}
          />
        )}
      </Box>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="model-select-label">{t('modelSelector.chooseModel')}</InputLabel>
        <Select
          labelId="model-select-label"
          value={selectedModel}
          label={t('modelSelector.chooseModel')}
          onChange={(e) => onModelChange(e.target.value)}
          sx={{ borderRadius: 2 }}
        >
          {models.map((model) => (
            <MenuItem key={model.value} value={model.value}>
              <Box display="flex" alignItems="center" width="100%">
                {model.icon}
                <Box ml={2}>
                  <Typography variant="body1" fontWeight="medium">
                    {model.label}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {model.description}
                  </Typography>
                </Box>
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {selectedModelData && (
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            backgroundColor: selectedModelData.color + '10',
            border: `1px solid ${selectedModelData.color}30`
          }}
        >
          <Typography variant="body2" color="text.secondary">
            <strong>{t('modelSelector.selected')}</strong> {selectedModelData.description}
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default ModelSelector;