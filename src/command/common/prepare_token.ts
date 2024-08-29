import { getDefaultStorage } from "../../libs/storage.js";

export const PrepareToken = async (input: {
  token?: string;
}): Promise<string> => {
  const token = input.token || getDefaultStorage().get("token");
  if (!token) {
    throw new Error("Token is required");
  }
  return token;
};
