import db from "@/firebaseConfig";
import { User } from "@/types/User";
import { collection, getDocs, query, where } from "firebase/firestore";

const Login = async (username: string, password: string): Promise<User> => {
  const q = query(
    collection(db, "users"),
    where("username", "==", username.trim()),
  );

  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) {
    throw new Error("User not found");
  }
  const userData = querySnapshot.docs[0].data() as User;

  if (userData.password !== password) {
    throw new Error("Incorrect password");
  }

  return userData;
};

export { Login };
