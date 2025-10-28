"use client";

import {
  useState,
  useEffect,
  ForwardRefExoticComponent,
  RefAttributes,
} from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import DashboardSkeleton from "./dashboard-skeleton";
import {
  MessageSquare,
  Mail,
  Phone,
  Package,
  Users,
  TrendingUp,
  LucideProps,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { getAdminDashboardStats } from "@/lib/api";

interface DashboardStats {
  package: {
    name: string;
    tier: string;
    renewalDate: string | Date;
  };
  channels: {
    whatsapp: { name: string; limit: number; used: number };
    sms: { name: string; limit: number; used: number };
    email: { name: string; limit: number; used: number };
  };
  stats: {
    messagesToday: number;
    totalSales: number;
    totalProducts: number;
    totalCustomers: number;
  };
  messagesTrend: { date: string | Date; messages: number; sales: number }[];
  channelDistribution: { name: string; value: number; color: string }[];
}

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const user = useAuthStore((s) => s.user);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAdminDashboardStats(user?.shop?.id as string);
        setDashboardStats(res);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [user?.shop?.id]);

  if (isLoading || !dashboardStats) return <DashboardSkeleton />;

  const whatsappRemaining =
    dashboardStats.channels.whatsapp.limit -
    dashboardStats.channels.whatsapp.used;
  const smsRemaining =
    dashboardStats.channels.sms.limit - dashboardStats.channels.sms.used;
  const emailRemaining =
    dashboardStats.channels.email.limit - dashboardStats.channels.email.used;

  const whatsappPercent =
    (dashboardStats.channels.whatsapp.used /
      dashboardStats.channels.whatsapp.limit) *
    100;
  const smsPercent =
    (dashboardStats.channels.sms.used / dashboardStats.channels.sms.limit) *
    100;
  const emailPercent =
    (dashboardStats.channels.email.used / dashboardStats.channels.email.limit) *
    100;

  return (
    <main className="min-h-screen bg-background px-3 py-4 sm:p-6 md:p-8">
      <section className="space-y-6">
        {/* Header */}
        <header className="space-y-1 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Welcome back! Here’s your account overview.
          </p>
        </header>

        {/* Package Info */}
        <Card className="border-primary/20 bg-linear-to-br from-primary/5 to-transparent">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle className="text-base sm:text-lg">
                    Current Package
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Your active subscription plan
                  </CardDescription>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-lg sm:text-2xl font-bold text-primary">
                  {dashboardStats.package.name}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Tier: {dashboardStats.package.tier}
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Main Stats Grid */}
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Messages Today"
            value={dashboardStats.stats.messagesToday.toLocaleString()}
            icon={MessageSquare}
            trend="+12%"
          />
          <StatCard
            title="Total Sales"
            smValue="PKR"
            value={`${dashboardStats.stats.totalSales.toLocaleString()}`}
            icon={TrendingUp}
            trend="+8%"
          />
          <StatCard
            title="Total Products"
            value={dashboardStats.stats.totalProducts}
            icon={Package}
            trend="+5"
          />
          <StatCard
            title="Total Customers"
            value={dashboardStats.stats.totalCustomers}
            icon={Users}
            trend="+24"
          />
        </div>

        {/* Channel Limits */}
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <ChannelCard
            name={dashboardStats.channels.whatsapp.name}
            used={dashboardStats.channels.whatsapp.used}
            limit={dashboardStats.channels.whatsapp.limit}
            remaining={whatsappRemaining}
            percent={whatsappPercent}
            icon={MessageSquare}
          />
          <ChannelCard
            name={dashboardStats.channels.sms.name}
            used={dashboardStats.channels.sms.used}
            limit={dashboardStats.channels.sms.limit}
            remaining={smsRemaining}
            percent={smsPercent}
            icon={Phone}
          />
          <ChannelCard
            name={dashboardStats.channels.email.name}
            used={dashboardStats.channels.email.used}
            limit={dashboardStats.channels.email.limit}
            remaining={emailRemaining}
            percent={emailPercent}
            icon={Mail}
          />
        </div>

        {/* Charts */}
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
          {/* Messages & Sales Trend */}
          <Card className="lg:col-span-2 overflow-x-auto">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">
                Messages & Sales Trend
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Weekly performance overview
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] sm:h-[300px]">
                <ChartContainer
                  config={{
                    messages: {
                      label: "Messages",
                      color: "hsl(var(--chart-1))",
                    },
                    sales: { label: "Sales", color: "hsl(var(--chart-2))" },
                  }}
                  className="h-full w-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dashboardStats.messagesTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" fontSize={12} />
                      <YAxis fontSize={12} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar
                        dataKey="messages"
                        fill="var(--color-messages)"
                        radius={[8, 8, 0, 0]}
                      />
                      <Bar
                        dataKey="sales"
                        fill="var(--color-sales)"
                        radius={[8, 8, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          {/* Channel Distribution */}
          <Card className="overflow-x-auto">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">
                Channel Distribution
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Messages by channel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] sm:h-[300px] flex justify-center items-center">
                <ChartContainer
                  config={{
                    whatsapp: {
                      label: "WhatsApp",
                      color: "hsl(var(--chart-1))",
                    },
                    sms: { label: "SMS", color: "hsl(var(--chart-2))" },
                    email: { label: "Email", color: "hsl(var(--chart-3))" },
                  }}
                  className="h-full w-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Pie
                        data={dashboardStats.channelDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius="80%"
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {dashboardStats.channelDistribution.map(
                          (entry, index) => (
                            <Cell key={index} fill={entry.color} />
                          )
                        )}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}

type usedIcon = ForwardRefExoticComponent<
  Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
>;

interface IStatCard {
  title: string;
  value: string | number;
  icon: usedIcon;
  trend: string;
  smValue?: string;
}

function StatCard({ title, value, icon: Icon, trend, smValue }: IStatCard) {
  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-1">
        <CardTitle className="text-xs sm:text-sm font-medium">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-xl sm:text-2xl font-bold">
          <span className="text-sm">{smValue}</span>
          {value}
        </div>
        <p className="text-[10px] sm:text-xs text-muted-foreground">
          {trend} from last week
        </p>
      </CardContent>
    </Card>
  );
}

interface IChannelCard {
  name: string;
  used: number;
  limit: number;
  remaining: number;
  percent: string | number;
  icon: usedIcon;
}

function ChannelCard({
  name,
  used,
  limit,
  remaining,
  percent,
  icon: Icon,
}: IChannelCard) {
  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className="h-5 w-5 text-primary" />
            <CardTitle className="text-sm sm:text-base">{name}</CardTitle>
          </div>
          <span className="text-xs font-semibold text-primary">
            {Math.round(Number(percent))}%
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <Progress value={Number(percent)} className="h-2" />
          <div className="flex justify-between text-[10px] sm:text-xs text-muted-foreground">
            <span>Used: {used.toLocaleString()}</span>
            <span>Limit: {limit.toLocaleString()}</span>
          </div>
        </div>
        <div className="rounded-md bg-muted p-2 sm:p-3 text-center sm:text-left">
          <p className="text-xs sm:text-sm font-semibold text-foreground">
            {remaining.toLocaleString()}{" "}
            <span className="text-[10px] sm:text-xs text-muted-foreground">
              remaining
            </span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
