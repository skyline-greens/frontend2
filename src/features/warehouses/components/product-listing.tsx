import { Product } from '@/constants/data';
import { ManageTables } from '@/constants/mock-api';
import { searchParamsCache } from '@/lib/searchparams';
import { WarehouseTable } from './warehouses-tables';
import { columns } from './warehouses-tables/columns';
import { Warehouse } from '@/actions/warehouse';

type ProductListingPage = {};

export default async function ProductListingPage({data}: any) {
  // Showcasing the use of search params cache in nested RSCs
  const page = searchParamsCache.get('page');
  const search = searchParamsCache.get('name');
  const pageLimit = searchParamsCache.get('perPage');
  // const categories = searchParamsCache.get('category');

  const filters = {
    page,
    limit: pageLimit,
    ...(search && { search }),
    ...(data && { data }),
    // ...(categories && { categories: categories })
  };

  const finalData = await ManageTables.getWarehouses(filters);


  console.log('ProductListingPage filters:', filters);
  const totalWarehouses = finalData?.total_warehouses;
  const warehouses: Warehouse[] = finalData?.warehouses || [];





  console.log('ProductListingPage data:', warehouses);

  return (
    <WarehouseTable
      data={warehouses}
      totalItems={totalWarehouses}
      columns={columns}
    />
  );
}
