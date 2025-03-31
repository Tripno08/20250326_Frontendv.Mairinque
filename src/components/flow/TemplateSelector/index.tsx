import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { FlowTemplate, flowTemplates } from '../templates';
import { Container, TemplateCard, TemplateInfo } from './styles';

interface TemplateSelectorProps {
  open: boolean;
  onClose: () => void;
  onSelectTemplate: (template: FlowTemplate) => void;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  open,
  onClose,
  onSelectTemplate,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Selecionar Template</DialogTitle>
      <DialogContent>
        <Container>
          {flowTemplates.map(template => (
            <TemplateCard key={template.id}>
              <TemplateInfo>
                <Typography variant="h6">{template.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {template.description}
                </Typography>
              </TemplateInfo>
              <IconButton
                onClick={() => {
                  onSelectTemplate(template);
                  onClose();
                }}
                color="primary"
                aria-label="usar template"
              >
                <AddIcon />
              </IconButton>
            </TemplateCard>
          ))}
        </Container>
      </DialogContent>
    </Dialog>
  );
};
