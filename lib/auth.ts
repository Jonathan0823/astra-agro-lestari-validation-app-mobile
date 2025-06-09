import { User } from "@/types/User";

const user = [
  {
    username: process.env.EXPO_PUBLIC_USERNAME,
    password: process.env.EXPO_PUBLIC_PASSWORD,
  },
];

const Login = async (username: string, password: string): Promise<User> => {
  if (!username || !password) {
    throw new Error("Username and password are required");
  }

  const foundUser = user.find(
    (u) => u.username === username && u.password === password,
  );

  if (!foundUser) {
    throw new Error("Invalid username or password");
  }

  return {
    id: "1",
    username: foundUser.username,
    password: foundUser.password,
  } as User;
};

export { Login };
