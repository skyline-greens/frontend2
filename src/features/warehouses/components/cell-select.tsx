'use client';

import { useRouter } from 'next/navigation';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';
import { getCellsByWarehouseId } from '@/actions/cells';

type Cell = { id: string; name: string };

export default async function CellSelect({
  warehouseId,
}: {
  warehouseId: string;
}) {
  const router = useRouter();
  const cells = await getCellsByWarehouseId(warehouseId);

  const handleCellSelect = (cellId: string) => {
    router.push(`/dashboard/warehouse/${warehouseId}/cell/${cellId}`);
  };

  return (
    <div className="w-full sm:w-64">
      <Select onValueChange={handleCellSelect} disabled={cells.length === 0}>
        <SelectTrigger className="bg-green-700 text-white hover:bg-green-800 focus:ring-green-500">
          <SelectValue placeholder={"Select a Cell"} />
        </SelectTrigger>
        <SelectContent>
          {cells.map((cell) => (
            <SelectItem key={cell.id} value={cell.id}>
              {cell.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
