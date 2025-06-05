import { View, Text, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { StatusItem, StatusType } from "@/types/StatusItem";
import { Dispatch, SetStateAction } from "react";

type ValidationOptionsProps = {
  statusData: StatusItem[];
  setStatusData: Dispatch<SetStateAction<StatusItem[]>>;
};

const StatusBox = ({
  status,
  onPress,
}: {
  status: StatusType;
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
      {status === true && <FontAwesome name="check" size={16} color="lime" />}
      {status === "x" && <FontAwesome name="close" size={16} color="red" />}
    </View>
  </TouchableOpacity>
);

export default function ValidationOptions({
  statusData,
  setStatusData,
}: ValidationOptionsProps) {
  const setExclusiveStatus = (
    rowIndex: number,
    field: "status1" | "status2",
  ) => {
    setStatusData((prev) =>
      prev.map((item, i) => {
        if (i !== rowIndex) return item;

        const newStatus: StatusItem = {
          ...item,
          status1: false,
          status2: false,
        };

        if (field === "status1") newStatus.status1 = true;
        if (field === "status2") newStatus.status2 = "x";

        return newStatus;
      }),
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
            status={item.status1}
            onPress={() => setExclusiveStatus(index, "status1")}
          />
          <StatusBox
            status={item.status2}
            onPress={() => setExclusiveStatus(index, "status2")}
          />
        </View>
      ))}
    </View>
  );
}
