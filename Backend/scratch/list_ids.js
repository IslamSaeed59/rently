const fs = require("fs");
const path = require("path");

const dir = "f:\\webdeveloper\\New 2026\\Saadon\\Backend\\uploads\\ids";
const files = fs
  .readdirSync(dir)
  .map((f) => ({
    name: f,
    time: fs.statSync(path.join(dir, f)).mtime.getTime(),
  }))
  .sort((a, b) => b.time - a.time)
  .slice(0, 4);

console.log(files);
