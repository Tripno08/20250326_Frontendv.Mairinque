import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  TextField,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Badge,
  Divider,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Checkbox,
  CircularProgress,
  Alert,
  Tab,
  Tabs,
  useTheme
} from '@mui/material';
import {
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  MarkEmailRead as MarkEmailReadIcon,
  Delete as DeleteIcon,
  Flag as FlagIcon,
  ChatBubble as ChatBubbleIcon,
  Email as EmailIcon
} from '@mui/icons-material';
import { TeamMessage, TeamMember, TeamCommunicationProps } from '@/types/team';
import { teamService } from '@/services/teamService';
import { format, parseISO, isToday, isYesterday } from 'date-fns';

/**
 * Componente para comunicação entre membros da equipe
 */
export const TeamCommunication: React.FC<TeamCommunicationProps> = ({
  className,
  style,
  teamId,
  members = [],
  onMessageSend,
  onMessageRead
}) => {
  const theme = useTheme();

  // Estado para mensagens
  const [messages, setMessages] = useState<TeamMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Estado para composição de mensagem
  const [subject, setSubject] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
  const [priority, setPriority] = useState<'normal' | 'important' | 'urgent'>('normal');
  const [activeTab, setActiveTab] = useState<number>(0);
  const [isSending, setIsSending] = useState<boolean>(false);

  // Carregar mensagens
  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedMessages = await teamService.getTeamMessages(teamId);
        setMessages(fetchedMessages);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Erro ao carregar mensagens'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [teamId]);

  // Enviar mensagem
  const handleSendMessage = async () => {
    if (!subject || !content || selectedRecipients.length === 0) return;

    setIsSending(true);
    try {
      // Mock do usuário atual (em uma implementação real, viria do contexto de autenticação)
      const currentUserId = members && members.length > 0 && members[0]?.id ? members[0].id : 'user_1';

      const messageData = {
        sender: currentUserId,
        recipients: selectedRecipients,
        subject,
        content,
        priority,
        timestamp: new Date().toISOString(),
        isRead: false
      };

      // Usar a função de callback se fornecida, caso contrário, usar o serviço diretamente
      let newMessage;
      if (onMessageSend) {
        const result = await onMessageSend(messageData);
        // Se onMessageSend retornar uma mensagem, usá-la, caso contrário, usar a que foi enviada
        if (result) {
          newMessage = result;
        }
      } else {
        newMessage = await teamService.sendMessage(messageData);
      }

      // Atualizar a lista de mensagens localmente
      if (newMessage) {
        setMessages(prev => [newMessage, ...prev]);

        // Resetar o formulário
        setSubject('');
        setContent('');
        setSelectedRecipients([]);
        setPriority('normal');
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao enviar mensagem'));
    } finally {
      setIsSending(false);
    }
  };

  // Marcar mensagem como lida
  const handleMarkAsRead = async (messageId: string) => {
    try {
      // Usar a função de callback se fornecida, caso contrário, usar o serviço diretamente
      let success = false;
      if (onMessageRead) {
        const result = await onMessageRead(messageId);
        // Se onMessageRead retornar um boolean, usá-lo
        success = result === true;
      } else {
        success = await teamService.markMessageAsRead(messageId);
      }

      if (success) {
        // Atualizar a lista de mensagens localmente
        setMessages(prev =>
          prev.map(message =>
            message.id === messageId ? { ...message, isRead: true } : message
          )
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao marcar mensagem como lida'));
    }
  };

  // Obter nome do membro pelo ID
  const getMemberName = (memberId: string): string => {
    const member = members.find(m => m.id === memberId);
    return member ? member.name : 'Membro desconhecido';
  };

  // Formatador de data amigável
  const formatMessageDate = (dateString: string): string => {
    const date = parseISO(dateString);

    if (isToday(date)) {
      return `Hoje, ${format(date, 'HH:mm')}`;
    } else if (isYesterday(date)) {
      return `Ontem, ${format(date, 'HH:mm')}`;
    } else {
      return format(date, 'dd/MM/yyyy HH:mm');
    }
  };

  // Filtrar mensagens com base na aba ativa
  const filteredMessages = messages.filter(message => {
    // Mock do usuário atual (em uma implementação real, viria do contexto de autenticação)
    const currentUserId = members && members.length > 0 && members[0]?.id ? members[0].id : 'user_1';

    // 0: Recebidas, 1: Enviadas, 2: Todas
    if (activeTab === 0) {
      return message.recipients.includes(currentUserId);
    } else if (activeTab === 1) {
      return message.sender === currentUserId;
    } else {
      return true;
    }
  });

  // Contagem de mensagens não lidas
  const unreadCount = messages.filter(message => {
    // Mock do usuário atual (em uma implementação real, viria do contexto de autenticação)
    const currentUserId = members && members.length > 0 && members[0]?.id ? members[0].id : 'user_1';

    return message.recipients.includes(currentUserId) && !message.isRead;
  }).length;

  // Renderizar mensagem individual
  const renderMessage = (message: TeamMessage) => {
    // Mock do usuário atual (em uma implementação real, viria do contexto de autenticação)
    const currentUserId = members && members.length > 0 && members[0]?.id ? members[0].id : 'user_1';
    const isReceived = message.recipients.includes(currentUserId);
    const isUnread = isReceived && !message.isRead;
    const senderName = getMemberName(message.sender);

    // Cor baseada na prioridade
    let priorityColor = theme.palette.info.main; // normal
    if (message.priority === 'important') {
      priorityColor = theme.palette.warning.main;
    } else if (message.priority === 'urgent') {
      priorityColor = theme.palette.error.main;
    }

    return (
      <ListItem
        key={message.id}
        sx={{
          mb: 1,
          bgcolor: isUnread ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
          borderLeft: isUnread ? `4px solid ${theme.palette.primary.main}` : 'none',
          borderRadius: 1,
          '&:hover': {
            bgcolor: 'rgba(0, 0, 0, 0.08)'
          }
        }}
      >
        <ListItemAvatar>
          <Badge
            overlap="circular"
            badgeContent={
              message.priority !== 'normal' ? (
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: priorityColor,
                    border: `1px solid ${theme.palette.background.paper}`
                  }}
                />
              ) : undefined
            }
          >
            <Avatar>{senderName.charAt(0)}</Avatar>
          </Badge>
        </ListItemAvatar>
        <ListItemText
          primary={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="subtitle2" component="span">
                {message.subject}
              </Typography>
              {isUnread && (
                <Chip
                  label="Não lida"
                  size="small"
                  color="primary"
                  sx={{ ml: 1, height: 20 }}
                />
              )}
            </Box>
          }
          secondary={
            <>
              <Typography variant="body2" component="span" color="text.secondary">
                De: {senderName} | Para: {message.recipients.map(id => getMemberName(id)).join(', ')}
              </Typography>
              <Typography variant="body2" component="div" sx={{ mt: 1 }}>
                {message.content.length > 100
                  ? `${message.content.substring(0, 100)}...`
                  : message.content
                }
              </Typography>
              <Typography variant="caption" color="text.secondary" component="div" sx={{ mt: 0.5 }}>
                {formatMessageDate(message.timestamp)}
              </Typography>
            </>
          }
        />
        <ListItemSecondaryAction>
          {isUnread && (
            <IconButton edge="end" onClick={() => handleMarkAsRead(message.id)}>
              <MarkEmailReadIcon color="primary" />
            </IconButton>
          )}
        </ListItemSecondaryAction>
      </ListItem>
    );
  };

  return (
    <Box
      sx={{
        width: '100%',
        ...(style || {})
      } as any}
      className={className}
    >
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Comunicação da Equipe
        </Typography>
        <Typography variant="body1" paragraph>
          Troque mensagens com outros membros da equipe para coordenar intervenções e discutir casos.
        </Typography>
      </Paper>

      <Grid container spacing={3}>
        {/* Formulário de envio de mensagens */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Nova Mensagem
            </Typography>
            <Box component="form" noValidate>
              <TextField
                fullWidth
                label="Assunto"
                margin="normal"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />

              <FormControl fullWidth margin="normal" required>
                <InputLabel id="recipients-label">Destinatários</InputLabel>
                <Select
                  labelId="recipients-label"
                  multiple
                  value={selectedRecipients}
                  onChange={(e) => setSelectedRecipients(typeof e.target.value === 'string' ? [e.target.value] : e.target.value as string[])}
                  input={<OutlinedInput label="Destinatários" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {(selected as string[]).map((value) => (
                        <Chip key={value} label={getMemberName(value)} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {members.map((member) => (
                    <MenuItem key={member.id} value={member.id}>
                      <Checkbox checked={selectedRecipients.indexOf(member.id) > -1} />
                      <ListItemText primary={member.name} secondary={member.role} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal">
                <InputLabel id="priority-label">Prioridade</InputLabel>
                <Select
                  labelId="priority-label"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as 'normal' | 'important' | 'urgent')}
                  label="Prioridade"
                >
                  <MenuItem value="normal">Normal</MenuItem>
                  <MenuItem value="important">Importante</MenuItem>
                  <MenuItem value="urgent">Urgente</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Mensagem"
                margin="normal"
                multiline
                rows={6}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<AttachFileIcon />}
                  disabled
                >
                  Anexar
                </Button>
                <Button
                  variant="contained"
                  endIcon={isSending ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                  onClick={handleSendMessage}
                  disabled={isSending || !subject || !content || selectedRecipients.length === 0}
                >
                  Enviar
                </Button>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Lista de mensagens */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Tabs
                value={activeTab}
                onChange={(_, newValue) => setActiveTab(newValue)}
                aria-label="tabs de mensagens"
              >
                <Tab
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <EmailIcon sx={{ mr: 1 }} />
                      {unreadCount > 0 ? (
                        <Badge badgeContent={unreadCount} color="primary">
                          Recebidas
                        </Badge>
                      ) : (
                        'Recebidas'
                      )}
                    </Box>
                  }
                  id="tab-0"
                  aria-controls="tabpanel-0"
                />
                <Tab
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <SendIcon sx={{ mr: 1 }} />
                      Enviadas
                    </Box>
                  }
                  id="tab-1"
                  aria-controls="tabpanel-1"
                />
                <Tab
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <ChatBubbleIcon sx={{ mr: 1 }} />
                      Todas
                    </Box>
                  }
                  id="tab-2"
                  aria-controls="tabpanel-2"
                />
              </Tabs>
            </Box>

            <Divider sx={{ mb: 2 }} />

            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error.message}
              </Alert>
            ) : filteredMessages.length === 0 ? (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography color="text.secondary">
                  Nenhuma mensagem disponível nesta categoria.
                </Typography>
              </Box>
            ) : (
              <List>
                {filteredMessages.map(message => renderMessage(message))}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
