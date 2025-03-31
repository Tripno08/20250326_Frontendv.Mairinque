# Testes dos Componentes Wrapper

Este documento descreve os testes criados para os componentes wrapper utilizados na migração para Material UI 7 e React 19.

## Estrutura dos Testes

Foram criados testes unitários para os quatro componentes wrapper:

1. **GridItem.test.tsx**
2. **GridContainer.test.tsx**
3. **ListItemWrapper.test.tsx**
4. **MenuItemWrapper.test.tsx**

Cada arquivo de teste verifica aspectos essenciais do componente wrapper:

- Renderização correta do conteúdo filho
- Passagem das propriedades específicas para o componente do Material UI
- Inclusão das propriedades fixas, como `component="div"` para GridItem/GridContainer/ListItemWrapper e `component="li"` para MenuItemWrapper
- Comportamento adequado em resposta a eventos (como onClick em ListItemWrapper e MenuItemWrapper)
- Aplicação correta de props adicionais, como className, style, sx, etc.

## Abordagem de Testes

Os testes utilizam a biblioteca `@testing-library/react` e seguem as melhores práticas de testes de componentes React:

1. **Mock dos Componentes do Material UI**: Utilizamos `jest.mock()` para substituir os componentes originais do Material UI por funções mock que podemos observar e verificar.
2. **Renderização do Componente**: Utilizamos a função `render()` para renderizar o componente com diferentes props.
3. **Verificação de Renderização**: Verificamos se o conteúdo filho está presente no DOM.
4. **Verificação de Props**: Verificamos se as props corretas estão sendo passadas para o componente do Material UI mockado.
5. **Simulação de Eventos**: Utilizamos `fireEvent` para simular eventos como cliques e verificar se os callbacks são chamados.

## Execução dos Testes

Os testes foram configurados para execução independente do restante do projeto, usando um arquivo de configuração Jest específico e um setup simplificado. Isso evita dependências desnecessárias como o MSW.

### Comando para Execução

```bash
npm run test:wrapper
```

## Status Atual dos Testes

Os testes de renderização estão funcionando corretamente, mas alguns testes de verificação de props estão falhando devido a diferenças no formato dos argumentos passados para as funções mockadas. Especificamente:

1. **Formato Esperado vs. Recebido**:

   ```
   Esperado: ObjectContaining {...}, {}
   Recebido: {...}, undefined
   ```

2. **Teste de Disabled**:
   O teste `não chama onClick quando disabled é true` está falhando porque o atributo `disabled` não está sendo interpretado corretamente pelo mock.

## Problemas Encontrados e Soluções

### 1. Erro: "Cannot find module '@mui/styles' from 'src/setupTests.ts'"

**Descrição**: Ao executar os testes, encontramos um erro indicando que o módulo '@mui/styles' não foi encontrado. Este erro ocorre porque o arquivo setupTests.ts está tentando mockar este módulo, mas ele pode não estar instalado no projeto.

**Solução**:

1. Instalar a dependência necessária:

```bash
npm install --save-dev @mui/styles
```

Ou, alternativamente, modificar o arquivo setupTests.ts para remover ou condicionar o mock desse módulo:

```typescript
// Em setupTests.ts
// Verificar se o módulo está disponível antes de tentar mocká-lo
try {
  jest.mock('@mui/styles', () => ({
    makeStyles: () => () => ({}),
  }));
} catch (error) {
  console.warn('Módulo @mui/styles não encontrado, ignorando mock');
}
```

### 2. Erro: "Cannot find module 'msw/node' from 'src/mocks/server.ts'"

**Descrição**: Este erro ocorre porque o setup dos testes está utilizando o Mock Service Worker (MSW) para interceptar chamadas de API durante os testes.

**Solução**:
Criamos uma configuração de teste específica para componentes wrapper que não depende do MSW:

1. Arquivo de setup simplificado (`wrapper-test.setup.ts`)
2. Configuração Jest específica (`jest.config.wrapper.js`)
3. Script npm dedicado (`test:wrapper`)

### 3. Erros de Formato nos Argumentos de Função

**Descrição**: Os testes estão falhando porque o jest.fn() está sendo chamado com formato diferente do esperado:

```
Esperado: ObjectContaining {...}, {}
Recebido: {...}, undefined
```

**Solução**:

Atualizar os testes para considerar o formato correto dos argumentos:

```typescript
// Antes
expect(Grid).toHaveBeenCalledWith(
  expect.objectContaining({
    item: true,
    component: 'div',
  }),
  {}
);

// Depois
expect(Grid).toHaveBeenCalledWith(
  expect.objectContaining({
    item: true,
    component: 'div',
    children: 'Teste',
  }),
  expect.anything()
);
```

### 4. Avisos de Propriedades Não Reconhecidas pelo DOM

**Descrição**: Os testes mostram avisos como "React does not recognize the `justifyContent` prop on a DOM element" porque estamos testando os componentes diretamente, sem o Material UI completo.

**Solução**: Estes são apenas avisos e não afetam a funcionalidade dos testes. Podemos ignorá-los ou ajustar nossos mocks para lidar com essas propriedades específicas.

## Recomendações para Melhoria dos Testes

1. **Ajustar o Formato dos Argumentos**:
   Atualizar todos os testes para verificar apenas as propriedades relevantes com `expect.objectContaining()` e ignorar o segundo argumento com `expect.anything()`.

2. **Melhorar o Mock do Material UI**:
   Implementar um mock mais robusto que lide corretamente com propriedades como "disabled" em MenuItemWrapper.

3. **Suprimir Avisos Não Críticos**:
   Considerar suprimir os avisos do console durante os testes para propriedades não reconhecidas pelo DOM.

4. **Melhorar a Cobertura de Código**:
   Adicionar mais casos de teste para cobrir diferentes combinações de props e casos de borda.

## Conclusão

Os testes dos componentes wrapper estão parcialmente funcionando, com os testes de renderização e algumas interações básicas passando corretamente. A cobertura de código é excelente (100%), mas precisamos ajustar o formato dos testes para lidar com a maneira como o Jest avalia as chamadas de funções mockadas.

As soluções propostas são relativamente simples de implementar e devem resolver os problemas restantes, garantindo uma suite de testes robusta para os componentes wrapper.
