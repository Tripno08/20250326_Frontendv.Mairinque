# Manual de Deploy - Innerview Escola (Ambiente de Testes)

Este documento contém os procedimentos passo a passo para realizar o deploy do ambiente de testes do Innerview Escola em um servidor Linux.

## Requisitos do Servidor

- Sistema Operacional: Linux (de preferência Ubuntu ou Debian)
- Node.js: 23.10.0 ou superior
- NPM: 10.9.2 ou superior
- Git
- PM2 (para gerenciamento de processos)
- SSH e acesso de administrador

## Informações do Servidor de Testes

- **Endereço IP**: 45.77.75.5
- **Usuário**: root
- **Diretório de Deploy**: /root/webdev/innerviewBeta1
- **Nome da Aplicação em PM2**: innerview-teste

## Deploy Manual

### 1. Acesso ao Servidor

```bash
ssh root@45.77.75.5
```

### 2. Preparação do Ambiente

```bash
# Atualizar pacotes
apt update && apt upgrade -y

# Instalar Node.js via nvm (recomendado para gerenciar versões)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
source ~/.bashrc
nvm install 23.10.0
nvm use 23.10.0

# Instalar PM2 globalmente
npm install -g pm2

# Criar diretório de deploy
mkdir -p /root/webdev/innerviewBeta1
```

### 3. Transferir Arquivos para o Servidor

Na sua máquina local, execute:

```bash
# Transferir arquivos do projeto
rsync -avz --exclude 'node_modules' --exclude '.git' --exclude '.next' --exclude 'dist' ./ root@45.77.75.5:/root/webdev/innerviewBeta1/
```

### 4. Instalar Dependências e Compilar

No servidor:

```bash
cd /root/webdev/innerviewBeta1

# Instalar dependências
npm ci --legacy-peer-deps

# Configurar variáveis de ambiente
cp .env.test .env.local

# Compilar a aplicação
npm run build
```

### 5. Iniciar a Aplicação com PM2

```bash
# Iniciar a aplicação
pm2 start npm --name "innerview-teste" -- start

# Configurar para reiniciar automaticamente após reboot
pm2 save
pm2 startup
```

### 6. Verificar Status

```bash
# Verificar se a aplicação está rodando
pm2 status

# Verificar logs
pm2 logs innerview-teste
```

### 7. Configurar Firewall (opcional)

```bash
# Permitir tráfego HTTP
ufw allow 3000
```

### 8. Acesso à Aplicação

A aplicação estará disponível em:

```
http://45.77.75.5:3000
```

## Deploy Automatizado

Para facilitar o processo de deploy, um script automatizado (`deploy-innerview.sh`) foi criado. O script realiza todos os passos necessários automaticamente.

### Uso do Script de Deploy

1. Certifique-se de que você tenha acesso SSH ao servidor configurado (idealmente com autenticação por chave).

2. Na máquina local, execute:

```bash
./deploy-innerview.sh
```

O script irá:

- Transferir os arquivos para o servidor
- Instalar as dependências
- Compilar a aplicação
- Configurar as variáveis de ambiente
- Iniciar/reiniciar a aplicação com PM2
- Exibir o status da aplicação

### Configuração de Deploy Automático via GitHub Actions (opcional)

Para configurar um pipeline de CI/CD com GitHub Actions:

1. Adicione as seguintes secrets ao seu repositório GitHub:

   - `SERVER_IP`: 45.77.75.5
   - `SERVER_USER`: root
   - `SERVER_SSH_KEY`: Sua chave SSH privada

2. Crie um arquivo `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Test Server

on:
  push:
    branches: [staging]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '23'

      - name: Install dependencies
        run: npm ci --legacy-peer-deps

      - name: Run tests
        run: npm test

      - name: Setup SSH
        uses: webfactory/ssh-agent@v0.7.0
        with:
          ssh-private-key: ${{ secrets.SERVER_SSH_KEY }}

      - name: Deploy to test server
        run: |
          rsync -avz --exclude 'node_modules' --exclude '.git' --exclude '.next' ./ ${{ secrets.SERVER_USER }}@${{ secrets.SERVER_IP }}:/root/webdev/innerviewBeta1/
          ssh ${{ secrets.SERVER_USER }}@${{ secrets.SERVER_IP }} "cd /root/webdev/innerviewBeta1 && npm ci --legacy-peer-deps && npm run build && pm2 reload innerview-teste || pm2 start npm --name 'innerview-teste' -- start && pm2 save"
```

## Manutenção e Troubleshooting

### Reiniciar a Aplicação

```bash
pm2 restart innerview-teste
```

### Visualizar Logs

```bash
pm2 logs innerview-teste
```

### Verificar Uso de Recursos

```bash
pm2 monit
```

### Atualizar a Aplicação

```bash
cd /root/webdev/innerviewBeta1
git pull
npm ci --legacy-peer-deps
npm run build
pm2 restart innerview-teste
```

### Limpar Cache do Node

Se encontrar problemas relacionados a dependências:

```bash
rm -rf node_modules
rm -rf .next
npm cache clean --force
npm ci --legacy-peer-deps
npm run build
```

### Backup do Banco de Dados (se aplicável)

```bash
# Ajuste conforme a configuração do seu banco de dados
mkdir -p /root/backups
pg_dump -U seu_usuario nome_do_banco > /root/backups/backup-$(date +%Y%m%d).sql
```

## Solução de Problemas Comuns

### A aplicação não inicia

Verifique os logs:

```bash
pm2 logs innerview-teste
```

Verifique se as variáveis de ambiente estão configuradas:

```bash
cat /root/webdev/innerviewBeta1/.env.local
```

### Erro no build

Verifique se todas as dependências estão instaladas:

```bash
cd /root/webdev/innerviewBeta1
npm ls
```

### Problemas de conexão com banco de dados

Verifique as configurações de conexão e se o banco está acessível:

```bash
# Exemplo para PostgreSQL
psql -h hostname -U username -d database_name -c "SELECT 1"
```

## Monitarando a Performance

### Configurar Monitoramento com PM2

```bash
pm2 install pm2-server-monit
pm2 install pm2-logrotate
```

### Utilizar PM2 Plus (opcional)

```bash
pm2 link <public_key> <private_key>
```

## Rollback

Em caso de problemas após o deploy:

```bash
# Voltar para a versão anterior (se disponível)
cd /root/webdev
mv innerviewBeta1 innerviewBeta1_problematico
mv innerviewBeta1_backup innerviewBeta1
cd innerviewBeta1
npm ci --legacy-peer-deps
npm run build
pm2 restart innerview-teste
```
