import { getCurrentUser } from "@/lib/auth";
import { NavBar } from "@/components/nav-bar";

export async function SiteNav() {
  const user = await getCurrentUser();
  return (
    <NavBar
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
