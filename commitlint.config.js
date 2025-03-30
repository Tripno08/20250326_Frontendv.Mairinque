module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'build',    // Alterações que afetam o sistema de build ou dependências externas
        'chore',    // Atualizações de tarefas que não afetam o código de produção
        'ci',       // Alterações em arquivos e scripts de configuração de CI
        'docs',     // Apenas documentação
        'feat',     // Um novo recurso
        'fix',      // Correção de bug
        'perf',     // Alteração de código que melhora o desempenho
        'refactor', // Alteração de código que não corrige bug nem adiciona recurso
        'revert',   // Reverte um commit anterior
        'style',    // Alterações que não afetam o significado do código
        'test',     // Adicionando testes ausentes ou corrigindo testes existentes
      ],
    ],
    'type-case': [2, 'always', 'lower'],
    'type-empty': [2, 'never'],
    'scope-case': [2, 'always', 'lower'],
    'subject-case': [2, 'never', ['sentence-case', 'start-case', 'pascal-case', 'upper-case']],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'header-max-length': [2, 'always', 72],
  },
};
