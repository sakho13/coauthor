"use client"

import { FullScreenLoading } from "@/components/atoms/FullScreenLoading"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { firebaseClient } from "@/utils/firebaseClient"
import { useGetNovels } from "@/utils/hooks/useNovels"
import { useAuthStore } from "@/utils/stores/useAuthStore"
import { signOut } from "firebase/auth"
import { Home, Plus, User, LibraryBig, LogOut, ChevronUp } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { toast } from "sonner"

type Props = {
  children: React.ReactNode
}

export default function PrivateLayout({ children }: Props) {
  const { accessToken } = useAuthStore()
  const { dataGetNovels } = useGetNovels()

  const signout = async () => {
    signOut(firebaseClient.auth).then(() => {
      toast.success("ログアウトしました")
      redirect("/")
    })
  }

  if (!accessToken) {
    return <FullScreenLoading />
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <SidebarContent>
            <h1 className='font-bold pl-4 select-none'>CoAuthor</h1>
          </SidebarContent>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className='select-none'>
              ページ
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem key={"sidebar-home"}>
                  <SidebarMenuButton asChild>
                    <a href={"/home"}>
                      <Home />
                      <span>Home</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem key={"sidebar-novels"}>
                  <SidebarMenuButton asChild>
                    <a href={"/novels"}>
                      <LibraryBig />
                      <span>Novels</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel className='select-none'>小説</SidebarGroupLabel>
            <SidebarGroupAction title='新しい小説を作成する' asChild>
              <Link href='/novel/new'>
                <Plus />
              </Link>
            </SidebarGroupAction>

            <SidebarGroupContent>
              <SidebarMenu>
                {dataGetNovels && dataGetNovels.success && (
                  <>
                    {dataGetNovels.data.novels.map((novel) => (
                      <SidebarMenuItem key={novel.id}>
                        <SidebarMenuButton asChild>
                          <a
                            href={`/novel/${novel.id}`}
                            className='w-full whitespace-nowrap'
                          >
                            <p className='text-ellipsis overflow-hidden'>
                              {novel.title}
                            </p>
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel className='select-none'>
              ヘルプ
            </SidebarGroupLabel>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    <User /> アカウント
                    <ChevronUp className='ml-auto' />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  side='top'
                  className='w-[--radix-popper-anchor-width]'
                >
                  <DropdownMenuItem asChild>
                    <a href={"/profile"}>
                      <User />
                      <span>プロフィール</span>
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={signout}>
                    <LogOut />
                    <span>ログアウト</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <main className='w-full'>
        <SidebarTrigger />

        {children}
      </main>
    </SidebarProvider>
  )
}
