import fs from "fs";
import path from "path";

const FIXTURES_PATH = path.join(__dirname, "../fixtures");

export default function loadFixture(fixturePath) {
  fixturePath = path.join(FIXTURES_PATH, fixturePath);
  return fs.readFileSync(fixturePath).toString();
}

loadFixture.json = (fixturePath) => {
  return JSON.parse(loadFixture(fixturePath));
};
