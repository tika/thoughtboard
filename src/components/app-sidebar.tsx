"use client";

import { SignOutButton, useUser } from "@clerk/nextjs";
import {
  BookOpenIcon,
  FeatherIcon,
  HomeIcon,
  LogOutIcon,
  UserIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { CreateReflectionModal } from "@/components/create-reflection-modal";
import { PostModal } from "@/components/create-remark-modal";
import { ProfileAvatar } from "@/components/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Remark } from "@/db/schema";
import { formatDistanceToNow } from "date-fns";

interface AppSidebarProps {
  profile: {
    handle: string;
    avatarUrl: string | null;
  };
  readyRemark: Remark | null;
}

export function AppSidebar({ profile, readyRemark }: AppSidebarProps) {
  const pathname = usePathname();
  const { user } = useUser();
  const [isDismissed, setIsDismissed] = useState(false);

  const navItems = [
    { href: "/", label: "Home", icon: HomeIcon },
    { href: "/reflections", label: "Reflections", icon: BookOpenIcon },
    { href: `/${profile.handle}`, label: "My Profile", icon: UserIcon },
  ];

  return (
    <aside className="flex h-full w-80 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      {/* Top Section - New Remark Button */}
      <div className="border-b border-sidebar-border p-4">
        <div suppressHydrationWarning>
          <PostModal
            trigger={
              <Button className="w-full" variant="default" size="default">
                <FeatherIcon className="size-4" />
                New Remark
              </Button>
            }
          />
        </div>
      </div>

      {/* Navigation Section */}
      <nav className="flex flex-col gap-1 p-4" aria-label="Main navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={buttonVariants({
                variant: isActive ? "secondary" : "ghost",
                size: "default",
                className: "w-full justify-start",
              })}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Reflection Queue Section */}
      {readyRemark && !isDismissed && (
        <div className="border-t border-sidebar-border p-4">
          <Card className="bg-sidebar-accent border-sidebar-border">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">
                Ready to Reflect?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-sidebar-accent-foreground">
                <p className="font-medium mb-1">You said...</p>
                <p className="text-muted-foreground italic">
                  &ldquo;{readyRemark.content}&rdquo;
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {formatDistanceToNow(readyRemark.createdTs, {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <div suppressHydrationWarning>
                <CreateReflectionModal
                  remark={readyRemark}
                  trigger={
                    <Button className="w-full" variant="default" size="sm">
                      Begin Reflection
                    </Button>
                  }
                />
              </div>
              <Button
                className="w-full"
                variant="outline"
                size="sm"
                onClick={() => setIsDismissed(true)}
              >
                Dismiss
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* Bottom Section - User Profile */}
      <div className="mt-auto border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3 mb-3">
          <div suppressHydrationWarning>
            <ProfileAvatar profile={profile} size={40} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">@{profile.handle}</p>
          </div>
        </div>
        <div suppressHydrationWarning>
          <SignOutButton>
            <Button variant="ghost" size="sm" className="w-full justify-start">
              <LogOutIcon className="size-4" />
              Sign Out
            </Button>
          </SignOutButton>
        </div>
      </div>
    </aside>
  );
}
