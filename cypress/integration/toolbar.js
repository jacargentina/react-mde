context('Toolbar', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4000');
  });
  it('bold', () => {
    cy.get('[data-testid=text-area]')
      .type('{selectall}{backspace}')
      .type('react-mde');

    cy.get('button[data-name="bold"]').click();
    cy.get('[data-testid=text-area]').should('have.value', '**react-mde**');
  });
  it('italic', () => {
    cy.get('[data-testid=text-area]')
      .type('{selectall}{backspace}')
      .type('react-mde');

    cy.get('button[data-name="italic"]').click();
    cy.get('[data-testid=text-area]').should('have.value', '*react-mde*');
  });
  it('strikethrough', () => {
    cy.get('[data-testid=text-area]')
      .type('{selectall}{backspace}')
      .type('react-mde');

    cy.get('button[data-name="strikethrough"]').click();
    cy.get('[data-testid=text-area]').should('have.value', '~~react-mde~~');
  });
  it('link', () => {
    cy.get('[data-testid=text-area]')
      .type('{selectall}{backspace}')
      .type('react-mde');

    cy.get('button[data-name="link"]').click();
    cy.get('[data-testid=text-area]').should('have.value', '[react-mde](url)');
  });
  it('quote', () => {
    cy.get('[data-testid=text-area]')
      .type('{selectall}{backspace}')
      .type('react-mde');

    cy.get('button[data-name="quote"]').click();
    cy.get('[data-testid=text-area]').should('have.value', '> react-mde');
  });
  it('image', () => {
    cy.get('[data-testid=text-area]')
      .type('{selectall}{backspace}')
      .type('react-mde');

    cy.get('button[data-name="image"]').click();
    cy.get('[data-testid=text-area]').should('have.value', '![](react-mde)');
  });
});
