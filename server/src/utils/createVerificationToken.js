import { nanoid } from "nanoid";

const token = async () => {
  const id = await nanoid(4);
  return id;
};

export default token;
