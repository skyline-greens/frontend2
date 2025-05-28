import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import TemperatureLineChart from '@/features/warehouses/components/wh-line-graph';
import HumidityLineChart from '@/features/warehouses/components/wh-humidity';
import ConsumptionLineChart from '@/features/warehouses/components/consumption-graph';
import { getCellsByWarehouseId } from '@/actions/cells';
import CellSelect from '@/features/warehouses/components/cell-select';

type PageProps = {
  params: Promise<{ warehouseId: string }>;
};

export default async function Page({ params }: PageProps) {
  const { warehouseId } = await params;
  const cells = await getCellsByWarehouseId(warehouseId);

  return (
    <PageContainer scrollable={true}>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title={`Warehouse ${warehouseId}`}
            description={`Manage Warehouse ${warehouseId} in your agriculture system`}
          />
        </div>
        <Separator />

        <CellSelect warehouseId={warehouseId} cells={cells} />

        <ConsumptionLineChart warehouseId={warehouseId} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <HumidityLineChart warehouseId={warehouseId} />
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <TemperatureLineChart warehouseId={warehouseId} />
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
