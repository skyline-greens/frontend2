import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';

import { searchParamsCache } from '@/lib/searchparams';

import { SearchParams } from 'nuqs/server';

import ProductListingPage from '@/features/warehouses/components/product-listing';
import { getWarehouses, Warehouse } from '@/actions/warehouse';
import LineChart from '@/features/warehouses/components/chart';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { Suspense } from 'react';


type pageProps = {
  searchParams: Promise<SearchParams>;
  params: { warehouseId: string };
};

export default async function Page(props: pageProps) {
  const searchParams = await props.searchParams;
  const { warehouseId } = props.params;
  searchParamsCache.parse(searchParams);
  
  let warehouses: Warehouse[] = [];
  try {
    warehouses = await getWarehouses();
    console.log('fendi:', warehouses);
  } catch (err) {
    console.error("Failed to fetch warehouses data:", err);
   
  }
  // This key is used for invoke suspense if any of the search params changed (used for filters).
  // const key = serialize({ ...searchParams });


  return (
    <PageContainer scrollable={false}>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title='Warehouse'
            description='Manage Warehouse in your agriculture system'
          />
        </div>
        <Separator />
   
        <Suspense
                  fallback={
                    <DataTableSkeleton columnCount={5} rowCount={8} filterCount={2} />
                  }
                >
                  <ProductListingPage data={warehouses}  />
                </Suspense>              
                 
        <LineChart warehouseId={warehouseId} />


        

      </div>
    </PageContainer>
  );
}