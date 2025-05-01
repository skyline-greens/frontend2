import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

interface TimeRangeSelectorProps {
  value: 'day' | 'month' | 'year';
  onChange: (value: 'day' | 'month' | 'year') => void;
  disabled?: boolean;
  className?: string;
}

export function TimeRangeSelector({ value, onChange, disabled }: TimeRangeSelectorProps) {
  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className='w-[150px] border-0 bg-green-800 text-white shadow-lg'>
        <SelectValue placeholder='Select range' />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value='day'>Show by day</SelectItem>
        <SelectItem value='month'> Show by month</SelectItem>
        <SelectItem value='year'>Show by year</SelectItem>
      </SelectContent>
    </Select>
  );
}
