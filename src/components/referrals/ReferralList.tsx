import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Grid,
  Tooltip,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  AccessTime as AccessTimeIcon,
} from '@mui/icons-material';
import { ReferralListProps, Referral, ReferralStatus } from '../../types/referral';

const ReferralList: React.FC<ReferralListProps> = ({
  referrals,
  onReferralSelect,
  onStatusChange,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedReferral, setSelectedReferral] = React.useState<Referral | null>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, referral: Referral) => {
    setAnchorEl(event.currentTarget);
    setSelectedReferral(referral);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedReferral(null);
  };

  const handleStatusChange = (newStatus: ReferralStatus) => {
    if (selectedReferral) {
      onStatusChange(selectedReferral.id, newStatus);
      handleMenuClose();
    }
  };

  const getStatusColor = (status: ReferralStatus) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'in_progress':
        return 'info';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'error';
      case 'high':
        return 'warning';
      case 'medium':
        return 'info';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      {referrals.map((referral) => (
        <Card key={referral.id} sx={{ mb: 2, cursor: 'pointer' }} onClick={() => onReferralSelect(referral.id)}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs>
                <Typography variant="h6" gutterBottom>
                  {referral.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {referral.description}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip
                    label={referral.status}
                    color={getStatusColor(referral.status)}
                    size="small"
                  />
                  <Chip
                    label={referral.priority}
                    color={getPriorityColor(referral.priority)}
                    size="small"
                  />
                  <Chip
                    label={referral.type}
                    variant="outlined"
                    size="small"
                  />
                  {referral.tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      variant="outlined"
                      size="small"
                    />
                  ))}
                </Box>
              </Grid>
              <Grid item>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Tooltip title={`Vencimento: ${new Date(referral.dueDate).toLocaleDateString()}`}>
                    <AccessTimeIcon color={new Date(referral.dueDate) < new Date() ? 'error' : 'action'} />
                  </Tooltip>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMenuClick(e, referral);
                    }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleStatusChange('in_progress')}>
          <CheckCircleIcon sx={{ mr: 1 }} /> Em Andamento
        </MenuItem>
        <MenuItem onClick={() => handleStatusChange('completed')}>
          <CheckCircleIcon sx={{ mr: 1, color: 'success.main' }} /> Concluir
        </MenuItem>
        <MenuItem onClick={() => handleStatusChange('cancelled')}>
          <CancelIcon sx={{ mr: 1, color: 'error.main' }} /> Cancelar
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default ReferralList;
