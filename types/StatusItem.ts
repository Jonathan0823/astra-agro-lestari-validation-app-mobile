type StatusType = boolean | "x";

type StatusItem = {
  label: string;
  status1: StatusType;
  status2: StatusType;
};

export { StatusType, StatusItem };
