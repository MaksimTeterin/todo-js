describe("Todo App", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5500"); // Замените на URL вашего приложения
  });

  it("should load the login form", () => {
    cy.get("#loginlogin").should("be.visible");
    cy.get("#loginpassword").should("be.visible");
    cy.get("#loginsubmit").should("be.visible");
  });

  it("should load the registration form", () => {
    cy.get("#username").should("be.visible");
    cy.get("#firstname").should("be.visible");
    cy.get("#secondname").should("be.visible");
    cy.get("#password").should("be.visible");
    cy.get("#registersubmit").should("be.visible");
  });
  it("should allow user registration with valid data", () => {
    cy.get("#username").type(Math.random().toString(36).substring(2, 8));
    cy.get("#firstname").type(Math.random().toString(36).substring(2, 8));
    cy.get("#secondname").type(Math.random().toString(36).substring(2, 8));
    cy.get("#password").type("password123");
    cy.get("#registersubmit").click();
    cy.get("#taskdiv").should("be.visible");
  });
});
