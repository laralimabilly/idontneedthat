import { SettingsForm } from "@/components/admin/settings-form";
import { getSiteSettings } from "@/lib/actions/settings";

export default async function SettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Configure your site and affiliate defaults.
        </p>
      </div>

      <div className="max-w-2xl">
        <SettingsForm settings={settings} />
      </div>
    </div>
  );
}
