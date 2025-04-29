'use client';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Column, ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

// Define Session type
interface Session {
  id: string;
  startDate: string;
  endDate: string;
  plantType: string;
}

export const columns: ColumnDef<Session>[] = [
  {
    id: 'session id',
    accessorKey: 'id',
    header: ({ column }: { column: Column<Session, unknown> }) => (
      <DataTableColumnHeader column={column} title='Session ID' />
    ),
    cell: ({ cell }) => <div>{cell.getValue<Session['id']>()}</div>
  },
  {
    id: 'start date',
    accessorKey: 'startDate',
    header: ({ column }: { column: Column<Session, unknown> }) => (
      <DataTableColumnHeader column={column} title='Start Date' />
    ),
    cell: ({ cell }) => {
      const date = new Date(cell.getValue<Session['startDate']>());
      return <div>{date.toLocaleDateString()}</div>;
    }
  },
  {
    id: 'end date',
    accessorKey: 'endDate',
    header: ({ column }: { column: Column<Session, unknown> }) => (
      <DataTableColumnHeader column={column} title='End Date' />
    ),
    cell: ({ cell }) => {
      const date = new Date(cell.getValue<Session['endDate']>());
      return <div>{date.toLocaleDateString()}</div>;
    }
  },
  {
    id: 'plant type',
    accessorKey: 'plantType',
    header: ({ column }: { column: Column<Session, unknown> }) => (
      <DataTableColumnHeader column={column} title='Plant Type' />
    ),
    cell: ({ cell }) => <div>{cell.getValue<Session['plantType']>()}</div>
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
