import { getWarehouses, getWarehousesStats, Warehouse } from '@/actions/warehouse';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import ProductListingPage from '@/features/warehouses/components/product-listing';
import { searchParamsCache } from '@/lib/searchparams';
import { cn } from '@/lib/utils';
import { SearchParams } from 'nuqs/server';
import { Suspense } from 'react';
import NewWarehouseDialog from '@/features/warehouses/components/new-warehouse-dialog';
import { WarehouseStatsCards } from '@/features/warehouses/components/stats/warehouse-stats';
export const metadata = {
  title: 'Dashboard: Warehouses',
};

type pageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page(props: pageProps) {
  let warehousesStats: any[] = [];
      try {
        warehousesStats = await getWarehousesStats();
      } catch (err) {
        console.error("Failed to fetch warehouses data:", err);
       
      }
  
      console.log('Page data:', warehousesStats);

  const searchParams = await props.searchParams;
  // Allow nested RSCs to access the search params (in a type-safe way)
  searchParamsCache.parse(searchParams);
  let warehouses: Warehouse[] = [];
  try {
    warehouses = await getWarehouses();
  } catch (err) {
    console.error("Failed to fetch warehouses data:", err);
   
  }
  // This key is used for invoke suspense if any of the search params changed (used for filters).
  // const key = serialize({ ...searchParams });

console.log('Page data:', warehouses);

  return (
    <PageContainer scrollable={false}>

      <div className='flex flex-1 flex-col space-y-4'>
        <div >
        <WarehouseStatsCards
      stats={warehousesStats}/>
        </div>
        <div className='flex items-start justify-between'>
          <Heading
            title='Warehouses'
            description='Manage Warehouses in your agriculture system'
          />
            <NewWarehouseDialog />
          {/* <Link
            href='/dashboard/product/new'
            className={cn(buttonVariants(), 'bg-green-700 text-xs md:text-sm')}
          >
            <IconPlus className='mr-2 h-4 w-4' /> Add New Warehouse
          </Link> */}
        </div>
        <Separator />
        <Suspense
          // key={key}S
          fallback={
            <DataTableSkeleton columnCount={5} rowCount={8} filterCount={2} />
          }
        >
          <ProductListingPage data={warehouses}  />
        </Suspense>
      </div>
    </PageContainer>
  );
}
