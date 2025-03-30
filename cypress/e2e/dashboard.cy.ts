describe('Dashboard', () => {
  beforeEach(() => {
    // Comentando o login pois o comando personalizado ainda não está configurado corretamente
    // cy.login('test@example.com', 'password')
    cy.visit('/dashboard')
  })

  it('should display all dashboard components', () => {
    // Verifica se o título está presente
    cy.get('h4').should('contain', 'Dashboard de Progresso')

    // Verifica se os componentes estão presentes
    cy.get('[data-testid="tier-distribution"]').should('exist')
    cy.get('[data-testid="domain-summary"]').should('exist')
    cy.get('[data-testid="assessment-coverage"]').should('exist')
  })

  it('should display loading state', () => {
    // Simula um estado de loading
    cy.intercept('GET', '/api/dashboard', (req) => {
      req.reply({
        delay: 1000,
        statusCode: 200,
        body: {
          tierDistribution: { tier1: 60, tier2: 30, tier3: 10 },
          domainSummary: { reading: 75, math: 80, writing: 70 },
          assessmentCoverage: { total: 150, assessed: 120 },
        },
      })
    })

    cy.visit('/dashboard')
    cy.contains('Carregando dashboard...').should('exist')
  })

  it('should display error state', () => {
    // Simula um erro na API
    cy.intercept('GET', '/api/dashboard', {
      statusCode: 500,
      body: { message: 'Erro interno do servidor' },
    })

    cy.visit('/dashboard')
    cy.contains('Erro ao carregar dados').should('exist')
  })

  it('should display correct data', () => {
    // Mock dos dados da API
    cy.intercept('GET', '/api/dashboard', {
      statusCode: 200,
      body: {
        tierDistribution: { tier1: 60, tier2: 30, tier3: 10 },
        domainSummary: { reading: 75, math: 80, writing: 70 },
        assessmentCoverage: { total: 150, assessed: 120 },
      },
    })

    cy.visit('/dashboard')

    // Verifica os dados do TierDistribution
    cy.get('[data-testid="tier-distribution"]')
      .should('contain', '60%')
      .and('contain', '30%')
      .and('contain', '10%')

    // Verifica os dados do DomainSummary
    cy.get('[data-testid="domain-summary"]')
      .should('contain', '75%')
      .and('contain', '80%')
      .and('contain', '70%')

    // Verifica os dados do AssessmentCoverage
    cy.get('[data-testid="assessment-coverage"]')
      .should('contain', '120')
      .and('contain', '150')
      .and('contain', '80.0%')
  })

  it('should be accessible', () => {
    cy.visit('/dashboard')

    // Verifica se os elementos são acessíveis
    cy.get('[data-testid="tier-distribution"]').should('have.attr', 'role', 'img')
    cy.get('[data-testid="domain-summary"]').should('have.attr', 'role', 'img')
    cy.get('[data-testid="assessment-coverage"]').should('have.attr', 'role', 'progressbar')
  })
})
