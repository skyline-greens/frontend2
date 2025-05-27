'use client';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail
} from '@/components/ui/sidebar';
import { UserAvatarProfile } from '@/components/user-avatar-profile';
import { navItems } from '@/constants/data';
import { useMediaQuery } from '@/hooks/use-media-query';
import Avatar from 'boring-avatars';
import { useUserStore } from '@/store/user'; 
import {
  IconChevronRight,
  IconChevronsDown,
  IconLogout,
  IconPhotoUp,
  IconUserCircle
} from '@tabler/icons-react';
import Image from 'next/image';
// import { SignOutButton } from '@clerk/nextjs';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import * as React from 'react';
import { Icons } from '../icons';
import { logout } from '@/actions/auth';
export const company = {
  name: 'Acme Inc',
  logo: IconPhotoUp,
  plan: 'Enterprise'
};

export default function AppSidebar() {
  const pathname = usePathname();
  const user = useUserStore((state) => state.user);
  const { isOpen } = useMediaQuery();
  const router = useRouter();
  React.useEffect(() => {
    // Side effects based on sidebar state changes
  }, [isOpen]);

   async function signOut() {
    try {
      const success = await logout();
      if (success) {
        router.push("/auth/sign-in");
      }
    } catch (e) {
      // Optionally handle error
     console.error("Sign out error:", e);
    }
  }

  return (
    <Sidebar collapsible='icon'>
      <SidebarHeader className='flex justify-center'>
        <Link
          href='/dashboard'
          className='data-[collapsed=false]:flex data-[collapsed=false]:justify-center data-[collapsed=true]:hidden'
        >
          <Image
            src='/images/logo.png'
            alt='Company Logo'
            width={60}
            height={60}
            className='my-2'
            priority
          />
        </Link>
      </SidebarHeader>
      <SidebarContent className='overflow-x-hidden'>
        <SidebarGroup>
          <SidebarMenu className='space-y-4'>
            {navItems.map((item) => {
              const Icon = item.icon ? Icons[item.icon] : Icons.logo;
              return item?.items && item?.items?.length > 0 ? (
                <Collapsible
                  key={item.title}
                  asChild
                  defaultOpen={item.isActive}
                  className='group/collapsible'
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip={item.title}
                        isActive={pathname === item.url}
                        className={`py-2 text-lg hover:bg-green-100 ${
                          pathname === item.url ? 'bg-green-700 text-white' : ''
                        }`} // Hover and active styles
                      >
                        {item.icon && (
                          <Icon
                            className={`mr-2 h-6 w-6 ${
                              pathname === item.url ? 'text-white' : ''
                            }`} // Icon size and active color
                          />
                        )}
                        <span>{item.title}</span>
                        <IconChevronRight
                          className={`ml-auto h-5 w-5 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 ${
                            pathname === item.url ? 'text-white' : ''
                          }`} // Chevron size and active color
                        />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={pathname === subItem.url}
                              className={`text-base hover:bg-green-100 ${
                                pathname === subItem.url
                                  ? 'bg-green-700 text-white'
                                  : ''
                              }`} // Hover and active styles for sub-items
                            >
                              <Link href={subItem.url}>
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ) : (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={pathname === item.url}
                    className={`py-2 text-lg hover:bg-green-100 ${
                      pathname === item.url ? 'bg-green-700 text-white' : ''
                    }`} // Hover and active styles
                  >
                    <Link href={item.url}>
                      <Icon
                        className={`mr-2 h-6 w-6`} // Icon size and active color
                      />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size='lg'
                  className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-white'
                >

              <div className="flex items-center gap-3">
                <Avatar
                  size={40}
                  name={user?.name}
                  variant="beam"
                  colors={["#fb6900", "#f63700", "#004853", "#007e80", "#00b9bd"]}
                />
                <div className="flex flex-col items-start">
                <span className="font-medium text-sm">{user?.name}</span>
                <span className="text-xs text-muted-foreground">{user?.email}</span>
                </div>
              </div>
     
                  <IconChevronsDown className='ml-auto size-4' />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
                side='bottom'
                align='end'
                sideOffset={4}
              >
                <DropdownMenuLabel className='p-0 font-normal'>
                <div className='px-1 py-1.5 flex items-center gap-3'>
          
                <Avatar
                  size={40}
                  name={user?.name}
                  variant="beam"
                  colors={["#fb6900", "#f63700", "#004853", "#007e80", "#00b9bd"]}
                />
          
              <div className="flex flex-col items-start">
                <span className="font-medium text-sm">{user?.name}</span>
                <span className="text-xs text-muted-foreground">{user?.email}</span>
              </div>
            </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => router.push('/dashboard/profile')}
                  >
                    <IconUserCircle className='mr-2 h-4 w-4' />
                    Profile
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                 onClick={signOut}
                >
                  <IconLogout className='mr-2 h-4 w-4' />
                  Sign Out
                  {/* <SignOutButton redirectUrl='/auth/sign-in' /> */}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
