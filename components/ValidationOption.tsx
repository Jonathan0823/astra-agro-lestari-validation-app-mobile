import { View, Text, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { StatusItem } from "@/types/StatusItem";
import { Dispatch, SetStateAction } from "react";

type ValidationOptionsProps = {
  statusData: StatusItem[];
  setStatusData: Dispatch<SetStateAction<StatusItem[]>>;
};

const StatusBox = ({
  active,
  icon,
  color,
  onPress,
}: {
  active: boolean;
  icon: "check" | "close";
  color: string;
  onPress: () => void;
}) => (
  <TouchableOpacity onPress={onPress}>
    <View
      style={{
        width: 24,
        height: 24,
        borderWidth: 1,
        borderColor: "#000",
        backgroundColor: "#000",
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 4,
      }}
    >
      {active && <FontAwesome name={icon} size={16} color={color} />}
    </View>
  </TouchableOpacity>
);

export default function ValidationOptions({
  statusData,
  setStatusData,
}: ValidationOptionsProps) {
  const setStatus = (index: number, value: boolean) => {
    setStatusData((prev) =>
      prev.map((item, i) => (i === index ? { ...item, status: value } : item)),
    );
  };

  return (
    <View className="mt-10 flex flex-col gap-3 flex-1 w-full items-center">
      {statusData.map((item, index) => (
        <View
          key={index}
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <Text className="text-black font-semibold text-xl w-1/2">
            • {item.label}
          </Text>
          <StatusBox
            active={item.status === true}
            icon="check"
            color="lime"
            onPress={() => setStatus(index, true)}
          />
          <StatusBox
            active={item.status === false}
            icon="close"
            color="red"
            onPress={() => setStatus(index, false)}
          />
        </View>
      ))}
    </View>
  );
}
