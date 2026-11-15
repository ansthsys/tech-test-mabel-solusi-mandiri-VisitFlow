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

function SegmentSelect({ clearable = true, ...props }: Props) {
  return (
    <SelectInput
      clearable={clearable}
      data={[
        { label: "B2G", value: "B2G" },
        { label: "B2B", value: "B2B" },
      ]}
      {...props}
    />
  );
}

export default SegmentSelect;
