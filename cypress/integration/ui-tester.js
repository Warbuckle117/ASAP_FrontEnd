describe('Server should be running', () => {
  it('Visits the frontend localhost server', () => {
    cy.visit('http://localhost:3000/')
    cy.url().should('include', 'localhost:3000')
  });
})

describe('The Input Form', () => {

  //has all input fields

  it('Should have an input field for tail number', () => {
    cy.get('#tailNumber').shouldExist
  });

  it('Should have an input field for aircraft name', () => {
    cy.get('#aircraftName').shouldExist
  });

  it('Should have an input field for base name', () => {
    cy.get('#baseName').shouldExist
  });

  it('Should have an input field for flyable', () => {
    cy.get('#flyable').shouldExist
  });

  it('Should have an input field for priority', () => {
    cy.get('#priority').shouldExist
  });

  it('Should have an input field for description', () => {
    cy.get('#description').shouldExist
  });

  //has all buttons

  it('Should have a create button', () => {
    cy.get('#create-btn').shouldExist
  });

  it('Should have a modify button', () => {
    cy.get('#modify-btn').shouldExist
  });

  it('Should have a delete button', () => {
    cy.get('#delete-btn').shouldExist
  });

  it('Should have a clear button', () => {
    cy.get('#clear-btn').shouldExist
  });

  //CREATE

  it('Should be able to add a new record to the list', () => {
    cy.get('#tailNumber').type('12345678')
    cy.get('#aircraftName').select('c-17')
    cy.get('#baseName').select('Travis AFB')
    cy.get('#flyable').select('Flyable')
    cy.get('#priority').select('Low')
    cy.get('#description').type('I\'m the coolest of them all')

    cy.get('#create-btn').click()

    cy.get('#SLI-12345678').shouldExist
  });

  //READ

  it('Should be able to click a record in the list and populate that information into the form', () => {
    cy.get('#SLI-15000101').click()

    cy.get('#tailNumber').should('have.value', "15000101")
    cy.get('#aircraftName').contains('c-17').shouldExist
    cy.get('#baseName').contains('JB Charleston').shouldExist
    cy.get('#flyable').contains('Flyable').shouldExist
    cy.get('#priority').contains('High').shouldExist
    cy.get('#description').should('have.value', "I move lots of shit")
  });

  //MODIFY

  it('Should be able to modify an existing record in the list', () => {
    cy.get('#baseName').select('Pope AFB')
    cy.get('#flyable').select('Non-Flyable')
    cy.get('#priority').select('Medium')
    cy.get('#description').clear().type('I\'m the lamest of them all')

    cy.get('#modify-btn').click()

    cy.get('#SLI-15000101').contains('Pope AFB')
    cy.get('#SLI-15000101').contains('Non-Flyable')
    cy.get('#SLI-15000101').contains('Medium')
    cy.get('#SLI-15000101').contains('I\'m the lamest of them all')
  });

  //CLEAR

  it('Should be able to clear the form', () => {
    cy.get('#SLI-15000101').click()

    cy.get('#clear-btn').click()

    cy.get('#tailNumber').should('have.value', "")
    cy.get('#aircraftName').should('have.value', "")
    cy.get('#baseName').should('have.value', "")
    cy.get('#flyable').should('have.value', "")
    cy.get('#priority').should('have.value', "")
    cy.get('#description').should('have.value', "")
  });

  //DELETE

  it('Should be able to delete a record from the list', () => {
    cy.get('#SLI-15000101').click()

    cy.get('#delete-btn').click()

    cy.get('#SLI-15000101').should('not.exist');
  });
})