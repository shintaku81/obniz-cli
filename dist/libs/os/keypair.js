"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EC = require("elliptic").ec;
const ec = new EC("p192");
exports.default = () => {
    const key = ec.genKeyPair();
    const pubPoint = key.getPublic();
    const privkey = key.getPrivate("hex");
    const pubkey = pubPoint.encode("hex");
    return {
        pubkey,
        privkey,
    };
};
// console.log(exports.gen());
//# sourceMappingURL=keypair.js.map