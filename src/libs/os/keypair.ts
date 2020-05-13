const EC = require("elliptic").ec;
const ec = new EC("p192");

export default () => {
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
