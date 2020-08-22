const DELAY = 500;

context('Suggestions', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4000');
  });
  it("'@' should display the suggestions box", () => {
    cy.get('[data-testid=suggestions]').should('not.exist');
    cy.get('[data-testid=text-area]').type('{selectall}{backspace}').type('@');
    cy.get('[data-testid=suggestions]').should('exist');
    cy.get('[data-testid=suggestions]').find('li').should('have.length', 4);
  });
  it("'@' + 'an' should display 2 elements ", () => {
    cy.get('[data-testid=suggestions]').should('not.exist');
    cy.get('[data-testid=text-area]')
      .type('{selectall}{backspace}')
      .type('@an');
    cy.get('[data-testid=suggestions]').should('exist');
    cy.get('[data-testid=suggestions]').find('li').should('have.length', 2);
  });
  it("'@' + 'an' + 2x backspace should display 4 elements", () => {
    cy.get('[data-testid=suggestions]').should('not.exist');
    cy.get('[data-testid=text-area]')
      .type('{selectall}{backspace}')
      .type('@an')
      .type('{backspace}{backspace}');
    cy.get('[data-testid=suggestions]').should('exist');
    cy.get('[data-testid=suggestions]').find('li').should('have.length', 4);
  });
  it("'@ + Enter' should select the first suggestion", () => {
    cy.get('[data-testid=text-area]')
      .type('{selectall}{backspace}')
      .type('@')
      .wait(DELAY)
      .type('{enter}')
      .should('have.value', '@andre ');
  });
  it("'@ + Arrow down + Enter' should select the first suggestion", () => {
    cy.get('[data-testid=text-area]')
      .type('{selectall}{backspace}')
      .type('@')
      .wait(DELAY)
      .type('{downArrow}')
      .type('{enter}')
      .should('have.value', '@angela ');
  });
  it("'@ + 4x Arrow down + Enter' should cycle and select the first suggestion", () => {
    cy.get('[data-testid=text-area]')
      .type('{selectall}{backspace}')
      .type('@')
      .wait(DELAY)
      .type('{downArrow}{downArrow}{downArrow}{downArrow}')
      .type('{enter}')
      .should('have.value', '@andre ');
  });
});
