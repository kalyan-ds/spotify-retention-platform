import { Typography } from '@/components/typography/Typography';
import { Button } from '@/components/buttons/Button';
import { Badge } from '@/components/badges/Badge';
import { Input } from '@/components/inputs/Input';
import { Divider } from '@/components/common/Divider';
import { LoadingScreen, ErrorState, EmptyState } from '@/components/common/Feedback';
import { Card, CardContent } from '@/components/cards/Card';

export function ComponentsPlayground() {
  return (
    <div className="space-y-12 pb-24 max-w-6xl mx-auto">

        {/* Typography Section */}
        <section className="space-y-4">
          <Typography variant="sectionTitle">Typography System</Typography>
          <Divider />
          <div className="grid gap-4 bg-card p-6 rounded-xl border border-border">
            <Typography variant="pageTitle">Page Title (text-3xl font-bold)</Typography>
            <Typography variant="sectionTitle">Section Title (text-xl font-semibold)</Typography>
            <Typography variant="cardTitle">Card Title (text-base font-medium)</Typography>
            <Typography variant="metricValue">Metric Value (text-4xl font-bold)</Typography>
            <Typography variant="metricLabel">Metric Label (text-xs uppercase)</Typography>
            <Typography variant="body">Body (text-sm font-normal text-muted-foreground)</Typography>
            <Typography variant="caption">Caption (text-xs text-muted-foreground)</Typography>
            <Typography variant="smallText">Small Text (text-[10px])</Typography>
          </div>
        </section>

        {/* Buttons Section */}
        <section className="space-y-4">
          <Typography variant="sectionTitle">Button System</Typography>
          <Divider />
          <div className="flex flex-wrap gap-4 bg-card p-6 rounded-xl border border-border items-center">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="success">Success</Button>
            <Button variant="warning">Warning</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="primary" loading>Loading</Button>
            <Button variant="primary" disabled>Disabled</Button>
          </div>
        </section>

        {/* Badges Section */}
        <section className="space-y-4">
          <Typography variant="sectionTitle">Badge System</Typography>
          <Divider />
          <div className="flex flex-wrap gap-4 bg-card p-6 rounded-xl border border-border items-center">
            <Badge variant="success">Success / All-time high</Badge>
            <Badge variant="warning">Warning / Attention</Badge>
            <Badge variant="critical">Critical / Error</Badge>
            <Badge variant="info">Info / Record quarter</Badge>
            <Badge variant="neutral">Neutral / Status</Badge>
          </div>
        </section>

        {/* Inputs Section */}
        <section className="space-y-4">
          <Typography variant="sectionTitle">Input System</Typography>
          <Divider />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-card p-6 rounded-xl border border-border">
            <Input placeholder="Default input..." />
            <Input isSearch placeholder="Search anything..." />
            <Input variant="success" placeholder="Success input..." defaultValue="Valid data" />
            <Input variant="error" placeholder="Error input..." defaultValue="Invalid data" />
            <Input disabled placeholder="Disabled input..." />
          </div>
        </section>

        {/* Feedback Section */}
        <section className="space-y-4">
          <Typography variant="sectionTitle">Feedback Components</Typography>
          <Divider />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card variant="default">
              <CardContent className="p-0 h-64 relative"><LoadingScreen /></CardContent>
            </Card>
            <Card variant="default">
              <CardContent className="p-0 h-64"><EmptyState title="No Data Found" description="Try adjusting your filters to see more results." /></CardContent>
            </Card>
            <Card variant="default" className="md:col-span-2">
              <CardContent className="p-0"><ErrorState onRetry={() => alert('retrying')} /></CardContent>
            </Card>
          </div>
        </section>

      </div>
  );
}

export default ComponentsPlayground;
