import { cpSync, mkdirSync, rmSync, copyFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const destination = join(root, "dist");
rmSync(destination, { recursive: true, force: true });
mkdirSync(destination, { recursive: true });
const publicFiles = ["index.html", "styles.css", "workspace.css", "app.js", "workspace.js", "demo-chat.js", "walkthrough.js", "manifest.webmanifest", "sw.js"];
for (const file of publicFiles) copyFileSync(join(root, file), join(destination, file));
cpSync(join(root, "assets"), join(destination, "assets"), { recursive: true });
console.log(`Built Roadlink web app: ${publicFiles.length} public files plus assets. Backend code and private configuration excluded.`);
