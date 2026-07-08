const fs = require("fs");

const fileBuffer = fs.readFileSync("character.glb");
const chunkLength = fileBuffer.readUInt32LE(12);
const jsonString = fileBuffer.toString("utf8", 20, 20 + chunkLength);
const gltf = JSON.parse(jsonString);

console.log("Node 80 details:", JSON.stringify(gltf.nodes[80], null, 2));
