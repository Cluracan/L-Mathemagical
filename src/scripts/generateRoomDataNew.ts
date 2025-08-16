import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import rooms from "../assets/data/roomData";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const roomIds = Object.keys(rooms);
const roomId = `${roomIds.map((id) => ` | '${id}'`).join("\n")}`;

console.log(roomId);
