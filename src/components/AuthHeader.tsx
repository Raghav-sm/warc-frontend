import { NavLink } from "react-router";
import { BrandLogo } from "@/components/BrandLogo";

interface AuthHeaderProps {
  subtitle: string;
}

export default function AuthHeader({ subtitle }: AuthHeaderProps) {
  return (
    <div className="flex flex-col items-center mb-6">
      <NavLink to="/" className="mb-4">
        <BrandLogo variant="full" size="lg" />
      </NavLink>
      <p className="text-muted-foreground text-sm text-center">{subtitle}</p>
    </div>
  );
}
