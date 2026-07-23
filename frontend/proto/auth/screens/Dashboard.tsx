import { useFlow } from "@robusgauli/proto";
import { Shell } from "../../shell/Shell";
import { Card, Button, PageHeader } from "@/proto-vocab";

/**
 * Lightweight placeholder for the existing authenticated app (the real
 * summary/expense dashboard already exists in frontend/src/App.tsx). This
 * screen only exists so the Login/Register flow has somewhere to land.
 */
export default function Dashboard() {
  const { goto } = useFlow();

  return (
    <Shell>
      <div className="flex justify-center">
        <div className="grid gap-6">
          <PageHeader title="Expense Tracker" subtitle="You're signed in" />
          <Card>
            <div className="grid gap-4">
              <p>
                This stands in for the real expense dashboard (add / list /
                delete / category summary), which already exists in the app.
              </p>
              <Button variant="ghost" onClick={() => goto("login")}>
                Log out
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </Shell>
  );
}
