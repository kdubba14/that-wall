const request = require("supertest");
const moxios = require("moxios");
require("dotenv").config();
const express = require("express");
// const app = require("../app");
const signupConfirm = require("../routes/signupConfirm");
const db = require("../db");

const initSignup = () => {
  const app = express();
  // await db.authenticate();
  app.use("/api/signup", signupConfirm);
  // process.on("exit", () => db.close());
  return app;
};

describe("Test the signup path from user creation to email", () => {
  beforeEach(() => {
    moxios.install();
  });
  afterEach(() => {
    moxios.uninstall();
    // try {
    //   await db.close();
    // } catch (error) {
    //   console.log("error");
    // }
  });
  jest.setTimeout(30000);
  test("user and email success to be true", async () => {
    const app = initSignup();
    // expect.assertions(1);
    try {
      let signUpCall = await request(app)
        .post("/api/signup")
        .send({
          alias: "EM_",
          email: "dvdncnqr@gmail.com",
          color: "bb00ff",
          password: "Abc123!!"
        });

      return expect(signUpCall.body.emailSuccess).toBe(true);
    } catch (err) {
      throw new Error("test fetch not working!");
    }
    // .expect(/dvdncnqr@gmail.com/)
    // return expect(signUpCall.body.emailSuccess).toBe(true);
  });
});
