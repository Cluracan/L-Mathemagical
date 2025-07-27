import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
// https://iamwebwiz.medium.com/how-to-fix-dirname-is-not-defined-in-es-module-scope-34d94a86694d
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const roomsPath = path.join(__dirname, "../assets/data/rooms.json");
const outputPath = path.join(__dirname, "../types/RoomId.ts");

const roomsRaw = fs.readFileSync(roomsPath, "utf-8");
const rooms = JSON.parse(roomsRaw);

const roomIds = Object.keys(rooms);
const roomIdType = `// Auto-generated from rooms.json — do not edit manually
export type RoomId = \n    'blocked'
${roomIds.map((id) => `  | '${id}'`).join("\n")};
`;

fs.writeFileSync(outputPath, roomIdType, "utf-8");
console.log(`✅ Generated RoomId type with ${roomIds.length} entries.`);
