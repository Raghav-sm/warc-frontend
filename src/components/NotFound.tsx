import { useNavigate } from "react-router";

import { Button } from "./ui/button";
import { Card } from "./ui/card";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <Card className="p-8 flex flex-col items-center gap-4 max-w-md w-full">
        <div className="text-6xl font-bold text-primary">404</div>
        <div className="text-2xl font-semibold mb-2">Page Not Found</div>
        <div className="text-muted-foreground mb-4 text-center">
          Sorry, the page you are looking for does not exist.
          <br />
          Please check the URL or return to the home page.
        </div>
        <Button onClick={() => navigate("/")}>Go to Home</Button>
      </Card>
    </div>
  );
}
