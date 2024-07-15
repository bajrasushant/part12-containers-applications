describe("Blog app", function () {
  beforeEach(function () {
    cy.request("POST", `${Cypress.env("BACKEND")}/testing/reset`);
    const user = {
      name: "Sushant test",
      username: "test",
      password: "test@123",
    };
    const user2 = {
      name: "Sushant test2",
      username: "anothertest",
      password: "test@123",
    };
    cy.request("POST", `${Cypress.env("BACKEND")}/users`, user);
    cy.request("POST", `${Cypress.env("BACKEND")}/users`, user2);
    cy.visit("");
  });

  it("Login form is shown", function () {
    cy.contains("login to the application");
    cy.contains("username");
    cy.contains("password");
    cy.contains("login");
  });

  describe("Login", function () {
    it("succeeds with correct credentials", function () {
      cy.contains("login to the application");
      cy.get("#username").type("test");
      cy.get("#password").type("test@123");
      cy.get("#login-button").click();
      cy.contains("Sushant test is logged in");
      cy.contains("logout");
    });

    it("fails with wrong credentials", function () {
      cy.contains("login to the application");
      cy.get("#username").type("test1");
      cy.get("#password").type("test@123");
      cy.get("#login-button").click();
      cy.get(".error")
        .should("contain", "wrong credentials")
        .and("have.css", "color", "rgb(255, 0, 0)");
    });
  });

  describe("when logged in", function () {
    beforeEach(function () {
      cy.login({ username: "test", password: "test@123" });
    });

    it("A blog can be created", function () {
      cy.contains("new form").click();
      cy.get("#title").type("test title");
      cy.get("#author").type("test writer");
      cy.get("#url").type("https://www.testwebsite.com");
      cy.get("#submit-new-blog").click();
      cy.get(".success")
        .should("contain", "a new blog test title by test writer added")
        .and("have.css", "color", "rgb(0, 128, 0)");
      cy.get(".blog_list")
        .should("contain", "test title")
        .and("contain", "test writer");
    });

    describe("When a blog is created", function () {
      beforeEach(() => {
        cy.createBlog({
          title: "like test",
          author: "test writer",
          url: "https://www.testwebsite.com",
        });
        cy.contains("view").click();
      });

      describe("a blog can be liked", function () {
        it("initially like is zero", function () {
          cy.get(".blogLikes").contains("0");
        });
        it("likes increase after the like button is clicked", function () {
          cy.get(".like-button").click();
          cy.get(".blogLikes").contains("1");
        });
      });

      describe("a blog can be deleted", function () {
        it("remove button is shown", function () {
          cy.contains("remove");
        });

        it("when remove button clicked blog removed", function () {
          cy.contains("remove").click();
          cy.should("not.contain", "like test");
          cy.should("not.contain", "test writer");
          cy.get(".success")
            .should("contain", "successfully deleted")
            .and("have.css", "color", "rgb(0, 128, 0)");
        });
      });

      describe("when different user logged in", function () {
        it("remove button is not shown", function () {
          cy.contains("logout").click();
          cy.login({ username: "anothertest", password: "test@123" });
          cy.contains("Sushant test2 is logged in");
          cy.contains("view").click();
          cy.contains("remove").should("not.exist");
        });
      });
    });

    describe("blogs are ranked by likes", function () {
      beforeEach(function () {
        cy.createBlog({
          title: "The title with the most likes",
          author: "FSO",
          url: "fullstackopen.com",
        });
        cy.createBlog({
          title: "The title with the second most likes",
          author: "FSO",
          url: "fullstackopen.com",
        });
      });
      it("title with the most likes ranks first", function () {
        cy.contains("The title with the most likes")
          .parent()
          .as("theFirst")
          .contains("view")
          .click();
        cy.get("@theFirst").contains("button", "like").click();
        cy.get(".blog")
          .eq(0)
          .should("contain", "The title with the most likes");
        cy.get(".blog")
          .eq(1)
          .should("contain", "The title with the second most likes");
      });
      it.only("title with the second most likes when liked most ranks first", function () {
        cy.contains("The title with the most likes")
          .parent()
          .as("theFirst")
          .contains("view")
          .click();
        cy.get("@theFirst").contains("button", "like").click();
        cy.contains("The title with the second most likes")
          .parent()
          .as("theSecond")
          .contains("view")
          .click();
        cy.get("@theSecond")
          .contains("button", "like")
          .click()
          .wait(500)
          .click();
        cy.get(".blog")
          .eq(1)
          .should("contain", "The title with the most likes");
        cy.get(".blog")
          .eq(0)
          .should("contain", "The title with the second most likes");
      });
    });
  });
});
