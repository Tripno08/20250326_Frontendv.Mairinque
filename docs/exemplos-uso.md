# Exemplos de Uso

## Criação de Encaminhamento

### Exemplo Básico

```typescript
// Criar um novo encaminhamento
const newReferral = {
  title: 'Solicitação de Material',
  description: 'Necessário material para aula de artes',
  type: 'academic',
  priority: 'high',
  assignedTo: 'professor.artes',
  dueDate: '2024-04-15',
  tags: ['material', 'artes', 'urgente']
};

try {
  const response = await referralService.createReferral(newReferral);
  console.log('Encaminhamento criado:', response.data);
} catch (error) {
  console.error('Erro ao criar encaminhamento:', error);
}
```

### Exemplo com Anexos

```typescript
// Criar encaminhamento com anexos
const newReferral = {
  title: 'Relatório de Atividades',
  description: 'Relatório mensal de atividades realizadas',
  type: 'administrative',
  priority: 'medium',
  assignedTo: 'coordenador',
  dueDate: '2024-04-30',
  tags: ['relatório', 'mensal']
};

const files = [
  new File(['conteúdo'], 'relatorio.pdf', { type: 'application/pdf' }),
  new File(['dados'], 'planilha.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
];

try {
  // Criar encaminhamento
  const response = await referralService.createReferral(newReferral);

  // Fazer upload dos anexos
  for (const file of files) {
    await referralService.uploadAttachment(response.data.id, file);
  }

  console.log('Encaminhamento criado com anexos');
} catch (error) {
  console.error('Erro:', error);
}
```

## Listagem e Filtros

### Exemplo de Listagem com Filtros

```typescript
// Listar encaminhamentos com filtros
const filters = {
  status: 'pending',
  priority: 'high',
  type: 'academic',
  assignedTo: 'professor.artes',
  startDate: '2024-04-01',
  endDate: '2024-04-30',
  tags: ['urgente']
};

try {
  const response = await referralService.listReferrals(filters);
  console.log('Encaminhamentos filtrados:', response.data);
  console.log('Total:', response.total);
} catch (error) {
  console.error('Erro ao listar encaminhamentos:', error);
}
```

### Exemplo de Paginação

```typescript
// Listar encaminhamentos com paginação
const page = 1;
const limit = 10;

try {
  const response = await referralService.listReferrals({ page, limit });
  console.log('Página atual:', response.page);
  console.log('Total de páginas:', Math.ceil(response.total / limit));
  console.log('Encaminhamentos:', response.data);
} catch (error) {
  console.error('Erro na paginação:', error);
}
```

## Atualização de Status

### Exemplo de Atualização

```typescript
// Atualizar status de um encaminhamento
const referralId = '123';
const updateData = {
  status: 'in_progress',
  description: 'Em andamento - aguardando material'
};

try {
  const response = await referralService.updateReferral(referralId, updateData);
  console.log('Status atualizado:', response.data.status);
} catch (error) {
  console.error('Erro ao atualizar status:', error);
}
```

### Exemplo com Comentário

```typescript
// Atualizar status e adicionar comentário
const referralId = '123';
const updateData = {
  status: 'completed',
  description: 'Concluído - material entregue'
};

const comment = {
  content: 'Material entregue e conferido',
  author: 'professor.artes'
};

try {
  // Atualizar status
  await referralService.updateReferral(referralId, updateData);

  // Adicionar comentário
  await referralService.addComment(referralId, comment);

  console.log('Status atualizado e comentário adicionado');
} catch (error) {
  console.error('Erro:', error);
}
```

## Dashboard e Métricas

### Exemplo de Obtenção de Métricas

```typescript
// Obter métricas do período
const period = {
  startDate: '2024-04-01',
  endDate: '2024-04-30'
};

try {
  const metrics = await referralService.getMetrics(period);
  console.log('Total de encaminhamentos:', metrics.total);
  console.log('Pendentes:', metrics.pending);
  console.log('Em andamento:', metrics.inProgress);
  console.log('Concluídos:', metrics.completed);
  console.log('Tempo médio de resolução:', metrics.averageResolutionTime);
} catch (error) {
  console.error('Erro ao obter métricas:', error);
}
```

### Exemplo de Visualização de Distribuição

```typescript
// Obter e exibir distribuição
const metrics = await referralService.getMetrics({
  startDate: '2024-04-01',
  endDate: '2024-04-30'
});

// Distribuição por prioridade
console.log('Distribuição por Prioridade:');
Object.entries(metrics.priorityDistribution).forEach(([priority, count]) => {
  console.log(`${priority}: ${count}`);
});

// Distribuição por tipo
console.log('Distribuição por Tipo:');
Object.entries(metrics.typeDistribution).forEach(([type, count]) => {
  console.log(`${type}: ${count}`);
});
```

## Notificações

### Exemplo de Envio de Notificação

```typescript
// Enviar notificação de vencimento
const notification = {
  type: 'due_date',
  title: 'Encaminhamento Próximo do Vencimento',
  message: 'O encaminhamento "Solicitação de Material" vence em 3 dias',
  userId: 'professor.artes',
  data: {
    referralId: '123',
    dueDate: '2024-04-15'
  }
};

try {
  await notificationService.sendNotification('professor.artes', notification);
  console.log('Notificação enviada');
} catch (error) {
  console.error('Erro ao enviar notificação:', error);
}
```

### Exemplo de Listagem de Notificações

```typescript
// Listar notificações do usuário
try {
  const notifications = await notificationService.listNotifications('professor.artes');

  notifications.forEach(notification => {
    console.log('Título:', notification.title);
    console.log('Mensagem:', notification.message);
    console.log('Data:', notification.createdAt);
    console.log('Lida:', notification.read);
  });
} catch (error) {
  console.error('Erro ao listar notificações:', error);
}
```

## Cache

### Exemplo de Uso de Cache

```typescript
// Obter encaminhamento com cache
const referralId = '123';

try {
  // Primeira chamada - busca da API
  const referral1 = await referralService.getReferral(referralId);
  console.log('Dados obtidos da API:', referral1);

  // Segunda chamada - obtém do cache
  const referral2 = await referralService.getReferral(referralId);
  console.log('Dados obtidos do cache:', referral2);

  // Atualizar encaminhamento
  await referralService.updateReferral(referralId, {
    status: 'completed'
  });

  // Cache é invalidado automaticamente
  const referral3 = await referralService.getReferral(referralId);
  console.log('Dados atualizados:', referral3);
} catch (error) {
  console.error('Erro:', error);
}
```

### Exemplo de Invalidação Manual

```typescript
// Invalidar cache manualmente
try {
  // Invalidar cache de um encaminhamento específico
  await cacheService.invalidate(`referral:123`);

  // Invalidar cache de todos os encaminhamentos
  await cacheService.invalidate('referrals:*');

  // Limpar todo o cache
  await cacheService.clear();
} catch (error) {
  console.error('Erro ao invalidar cache:', error);
}
```
