'use client';
import { Column, ColumnDef } from '@tanstack/react-table';
import { Text } from 'lucide-react';
import { CellAction } from './cell-action';
import { Warehouse } from '@/actions/warehouse';

export const columns: ColumnDef<Warehouse>[] = [
  {
    id: 'id',
    accessorKey: 'id',
    header: 'ID',
    cell: ({ cell }) => <div>{cell.getValue<Warehouse['id']>()}</div>,
    meta: {
      label: 'ID',
      placeholder: 'Search warehouses...',
      variant: 'text',
      icon: Text
    },
    enableColumnFilter: false
  },
  {
    id: 'name',
    accessorKey: 'name',
    header: 'Name',
    cell: ({ cell }) => <div>{cell.getValue<Warehouse['name']>()}</div>,
    meta: {
      label: 'Name',
      placeholder: 'Search warehouses...',
      variant: 'text',
      icon: Text
    },
    enableColumnFilter: true
  },
  {
    id: 'capacity',
    accessorKey: 'capacity',
    header: 'Capacity',
    cell: ({ cell }) => <div>{cell.getValue<Warehouse['capacity']>()}</div>,
    meta: {
      label: 'Capacity',
      placeholder: 'Search capacity...',
      variant: 'text',
      icon: Text
    },
    enableColumnFilter: false
  },
  {
    id: 'mac',
    accessorKey: 'mac',
    header: 'MAC Address',
    cell: ({ cell }) => <div>{cell.getValue<Warehouse['mac']>()}</div>,
    meta: {
      label: 'MAC Address',
      placeholder: 'Search MAC...',
      variant: 'text',
      icon: Text
    },
    enableColumnFilter: false
  },
  {
    id: 'farmId',
    accessorKey: 'farmId',
    header: 'Farm ID',
    cell: ({ cell }) => <div>{cell.getValue<Warehouse['farmId']>()}</div>,
    meta: {
      label: 'Farm ID',
      placeholder: 'Search farm...',
      variant: 'text',
      icon: Text
    },
    enableColumnFilter: false
  },
  {
    id: 'managerId',
    accessorKey: 'managerId',
    header: 'Manager ID',
    cell: ({ cell }) => <div>{cell.getValue<Warehouse['managerId']>()}</div>,
    meta: {
      label: 'Manager ID',
      placeholder: 'Search manager...',
      variant: 'text',
      icon: Text
    },
    enableColumnFilter: false
  },
  {
    id: 'createdAt',
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ cell }) => <div>{cell.getValue<Warehouse['createdAt']>()}</div>,
    meta: {
      label: 'Created At',
      placeholder: 'Search created...',
      variant: 'text',
      icon: Text
    },
    enableColumnFilter: false
  },
  {
    id: 'updatedAt',
    accessorKey: 'updatedAt',
    header: 'Updated At',
    cell: ({ cell }) => <div>{cell.getValue<Warehouse['updatedAt']>()}</div>,
    meta: {
      label: 'Updated At',
      placeholder: 'Search updated...',
      variant: 'text',
      icon: Text
    },
    enableColumnFilter: false
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];