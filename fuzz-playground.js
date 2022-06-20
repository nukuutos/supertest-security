const fs = require("fs");
const request = require("supertest");
const express = require("express");

const app = express();

app.post("/user", function (req, res) {
  res.status(200).json({ name: "john" });
});

const test = async () => {
  const payloads = fs
    .readFileSync("./supertest-security/payloads/xss.txt", { encoding: "utf-8" })
    .split("\r\n");

  const promises = [];

  for (const payload of payloads) {
    const promise = request(app).post("/user").send({ parameter: payload });
    promises.push(promise);
  }

  const startAt = Date.now();
  const result = await Promise.all(promises);
  const endAt = Date.now();

  const timeForFuzz = (endAt - startAt) / 1000;

  console.log(result[result.length - 1]);

  console.log(timeForFuzz, "seconds");
  console.log("Payloads number: ", payloads.length);
};

test();
