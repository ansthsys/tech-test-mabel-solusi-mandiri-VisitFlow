import SelectInput from "@components/inputs/select-input";

interface Props {
  label?: string;
  placeholder?: string;
  description?: string;
  withAsterisk?: boolean;
  name: string;
  form?: any;
  isLoading?: boolean;
  className?: string;
  clearable?: boolean;
}

function StatusSelect({ clearable = true, ...props }: Props) {
  return (
    <SelectInput
      clearable={clearable}
      data={[
        { label: "Not visited", value: "NOT_VISITED" },
        { label: "Visited", value: "VISITED" },
      ]}
      {...props}
    />
  );
}

export default StatusSelect;
