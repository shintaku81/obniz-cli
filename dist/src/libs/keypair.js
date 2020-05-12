"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EC = require("elliptic").ec;
const ec = new EC("p192");
function gen() {
    const key = ec.genKeyPair();
    const pubPoint = key.getPublic();
    const privkey = key.getPrivate("hex");
    const pubkey = pubPoint.encode("hex");
    return {
        pubkey,
        privkey,
    };
}
exports.gen = gen;
// console.log(exports.gen());
