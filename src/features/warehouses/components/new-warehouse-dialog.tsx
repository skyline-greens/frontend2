'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

import { addWarehouse } from '@/actions/warehouse';

export default function NewWarehouseDialog() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get('name');
    const capacity = formData.get('capacity');
    const mac = formData.get('mac');

    if (
      typeof name !== 'string' ||
      typeof mac !== 'string' ||
      !name.trim() ||
      !mac.trim() ||
      isNaN(Number(capacity))
    ) {
      return;
    }

    try {
      await addWarehouse({
        name,
        capacity: Number(capacity),
        mac
      });
      toast.success('Warehouse added!', {
        style: {
          background: "green",
          color: "white",
        },
      });
      setOpen(false);
      router.refresh();
    } catch (err) {
      toast.error('Failed to add warehouse', {
        style: {
          background: "red",
          color: "white",
        },
      });
    }

    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className='border-gray-200 b-2' variant='secondary' size='sm'>
          ＋ Add New Warehouse
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Add New Warehouse</DialogTitle>
          <DialogDescription>
            Enter the warehouse details below.
          </DialogDescription>
        </DialogHeader>
        <form
          id='warehouse-form'
          className='grid gap-4 py-4'
          onSubmit={handleSubmit}
        >
          <div className='grid grid-cols-4 items-center gap-4'>
            <Input
              id='name'
              name='name'
              placeholder='Warehouse name...'
              className='col-span-4'
              required
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Input
              id='capacity'
              name='capacity'
              type='number'
              placeholder='Capacity...'
              className='col-span-4'
              required
              min={0}
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Input
              id='mac'
              name='mac'
              placeholder='MAC (UUID)...'
              className='col-span-4'
              required
              pattern="[0-9a-fA-F-]{36}"
              title="Enter a valid UUID"
            />
          </div>
        </form>
        <DialogFooter>
          <Button type='submit' size='sm' form='warehouse-form'>
            Add Warehouse
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}