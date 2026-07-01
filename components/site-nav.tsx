import { getCurrentUser } from "@/lib/auth";
import { isLumaConnected } from "@/lib/luma/client";
import { NavBar } from "@/components/nav-bar";

export async function SiteNav() {
  const user = await getCurrentUser();
  return (
    <NavBar
      lumaConnected={isLumaConnected()}
      user={
        user
          ? {
              id: user.id,
              name: user.name,
              email: user.email,
              avatarUrl: user.avatarUrl,
            }
          : null
      }
    />
  );
}
