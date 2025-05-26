'use client';
import { useUserStore } from '@/store/user';
import Avatar from 'boring-avatars';

export default function ProfileViewPage() {
  const user = useUserStore((state) => state.user);

  return (
    <div className="flex w-full flex-col items-center p-4 max-w-md mx-auto">
      <div className="flex flex-col items-center gap-2 mb-8">
        <Avatar
          size={72}
          name={user?.name || ''}
          variant="beam"
          colors={["#fb6900", "#f63700", "#004853", "#007e80", "#00b9bd"]}
        />
        <div className="font-semibold text-lg">{user?.name}</div>
        <div className="text-muted-foreground text-sm">{user?.email}</div>
      </div>
      <div className="w-full bg-card b-2 border-gray-200 dark:border-gray-700 rounded-xl shadow p-6 flex flex-col gap-4">
        <div>
          <div className="text-sm text-muted-foreground mb-1">Name</div>
          <div className="font-medium">{user?.name}</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground mb-1">Email</div>
          <div className="font-medium">{user?.email}</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground mb-1">Phone</div>
          <div className="font-medium">{user?.phone}</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground mb-1">Role</div>
          <div className="font-medium">{user?.role}</div>
        </div>
      </div>
    </div>
  );
}