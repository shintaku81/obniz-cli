import { ec as EC } from "elliptic";
const ec = new EC("p192");

export const generateKeyPair = () => {
  const key = ec.genKeyPair();
  const pubPoint = key.getPublic();
  const privkey = key.getPrivate("hex");
  const pubkey = pubPoint.encode("hex", true);
  return {
    pubkey,
    privkey,
  };
};

// console.log(exports.gen());
