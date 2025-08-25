import { PageHeader } from '@/components/page-header';
import { SettingsForm } from './_components/settings-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getSettings } from '@/lib/data';

export default async function SettingsPage() {
    const settings = await getSettings();

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            <PageHeader
                title="Settings"
                subtitle="Configure application settings and preferences."
            />
            <Card className="max-w-2xl">
                <CardHeader>
                    <CardTitle>Low Stock Alerts</CardTitle>
                    <CardDescription>
                        Manage phone numbers for receiving low stock alerts. The system will first
                        try to send a WhatsApp message. If that fails, it will fall back to sending
                        a standard SMS text message. This requires separate backend configuration
                        (e.g., Twilio `TWILIO_WHATSAPP_NUMBER` and `TWILIO_SMS_NUMBER`).
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <SettingsForm currentSettings={settings} />
                </CardContent>
            </Card>
        </div>
    );
}
