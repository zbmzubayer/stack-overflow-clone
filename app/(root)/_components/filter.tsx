import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface FilterProps {
  filters: {
    name: string;
    value: string;
  }[];
  containerClass?: string;
  className?: string;
}

export default function Filter({ filters, containerClass, className }: FilterProps) {
  return (
    <div className={containerClass}>
      <Select>
        <SelectTrigger
          className={`background-light800_dark300 light-border text-dark500_light700 rounded-lg px-5 ${className}`}
        >
          <SelectValue placeholder="Select a filter" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {filters.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
