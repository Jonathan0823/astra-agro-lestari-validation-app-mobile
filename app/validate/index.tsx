import db from "@/firebaseConfig";
import { User } from "@/types/User";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { View, Text } from "react-native";

const Index = () => {
  const [message, setMessage] = useState<User[]>([]);
  useEffect(() => {
    const testfireStorage = async () => {
      try {
        const query = await getDocs(collection(db, "users"));
        const result = query.docs.map((doc) => ({
          id: doc.id,
          username: doc.data().username,
        }));
        console.log("Data from Firestore:", result);
        setMessage(result);
      } catch (err) {
        console.error("Error in testfireStorage:", err);
      }
    };

    testfireStorage();
  }, []);
  return (
    <View className="flex-1 p-2">
      <Text>{message[0]?.id}</Text>
      <Text>{message[0]?.username}</Text>
    </View>
  );
};

export default Index;
