describe("Main Functional Tests", () => {
  const username = Math.random().toString(36).substring(2, 8);
  const password = Math.random().toString(36).substring(2, 8);
  const firstname = Math.random().toString(36).substring(2, 8);
  const secondname = Math.random().toString(36).substring(2, 8);
  beforeEach(() => {
    cy.visit("http://localhost:5500");
    if (cy.get("#taskdiv").should("be.not.visible")) {
      cy.get("#username").type(username);
      cy.get("#firstname").type(firstname);
      cy.get("#secondname").type(secondname);
      cy.get("#password").type(password);
      cy.get("#registersubmit").click();
    }
  });
  it("should allow adding a new task", () => {
    cy.get("#add-task").click();
    cy.get("#taskdiv").should("be.visible");
  });
});
