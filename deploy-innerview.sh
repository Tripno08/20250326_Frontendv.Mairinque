#!/bin/bash

# Script de deploy para o servidor de testes do Innerview Escola

# Configurações
SERVER_IP="45.77.75.5"
SERVER_USER="root"
SERVER_PASS="e4@B-(j8mtHNo?z$"  # Somente para documentação, não usar em produção
DEPLOY_DIR="/root/webdev/innerviewBeta1"
APP_NAME="innerview-teste"

# Funções de log
log_info() {
  echo -e "\033[0;32m[INFO]\033[0m $1"
}

log_warn() {
  echo -e "\033[0;33m[WARN]\033[0m $1"
}

log_error() {
  echo -e "\033[0;31m[ERROR]\033[0m $1"
}

# Verifica se o diretório existe no servidor, caso contrário, cria
log_info "Verificando diretório de deploy no servidor..."
ssh $SERVER_USER@$SERVER_IP "mkdir -p $DEPLOY_DIR"

# Deploy dos arquivos
log_info "Iniciando transferência de arquivos para $SERVER_IP..."
rsync -avz --progress \
  --exclude 'node_modules' \
  --exclude '.git' \
  --exclude 'dist' \
  --exclude '.next' \
  --exclude 'cypress' \
  --exclude '.github' \
  --exclude 'coverage' \
  ./ $SERVER_USER@$SERVER_IP:$DEPLOY_DIR/

if [ $? -ne 0 ]; then
  log_error "Falha ao transferir arquivos para o servidor!"
  exit 1
fi

# Instalação de dependências e build
log_info "Instalando dependências e realizando build..."
ssh $SERVER_USER@$SERVER_IP "cd $DEPLOY_DIR && \
  export NODE_ENV=production && \
  npm ci --legacy-peer-deps && \
  npm run build"

if [ $? -ne 0 ]; then
  log_error "Falha ao instalar dependências ou realizar build!"
  exit 1
fi

# Configuração do ambiente
log_info "Configurando variáveis de ambiente..."
ssh $SERVER_USER@$SERVER_IP "cd $DEPLOY_DIR && cp .env.test .env.local"

# Iniciando a aplicação com PM2
log_info "Iniciando aplicação com PM2..."
ssh $SERVER_USER@$SERVER_IP "cd $DEPLOY_DIR && \
  npm install -g pm2 && \
  pm2 describe $APP_NAME > /dev/null && \
  pm2 reload $APP_NAME || \
  pm2 start npm --name \"$APP_NAME\" -- start && \
  pm2 save"

# Verificando status
log_info "Verificando status da aplicação..."
ssh $SERVER_USER@$SERVER_IP "pm2 status $APP_NAME"

log_info "Deploy concluído com sucesso!"
log_info "Acesse a aplicação em: http://$SERVER_IP:3000"
