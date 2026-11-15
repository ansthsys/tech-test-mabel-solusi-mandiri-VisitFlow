import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@components/ui/card";
import {
  Building2,
  CheckCircle2,
  ClipboardList,
  XCircle,
} from "lucide-react";
import { useGetAllEntities } from "@apis/queries/entities";
import { useGetAllActivities } from "@apis/queries/activities";

export function Dashboard() {
  const { data: entities, isLoading: entitiesLoading } = useGetAllEntities({
    search: "",
    segment: "",
  });

  const { data: activities, isLoading: activitiesLoading } = useGetAllActivities(
    {
      search: "",
      segment: "",
      status: "",
      from: "",
      to: "",
    },
  );

  const totalEntity = entities?.length ?? 0;
  const totalActivity = activities?.length ?? 0;
  const visited =
    activities?.filter((activity) => activity.status === "VISITED").length ?? 0;
  const notVisited =
    activities?.filter((activity) => activity.status === "NOT_VISITED")
      .length ?? 0;

  const stats = [
    {
      title: "Total Entity",
      value: totalEntity,
      loading: entitiesLoading,
      icon: Building2,
    },
    {
      title: "Total Activity",
      value: totalActivity,
      loading: activitiesLoading,
      icon: ClipboardList,
    },
    {
      title: "Activity Visited",
      value: visited,
      loading: activitiesLoading,
      icon: CheckCircle2,
    },
    {
      title: "Activity Not Visited",
      value: notVisited,
      loading: activitiesLoading,
      icon: XCircle,
    },
  ];

  return (
    <div className="w-full space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stat.loading ? "..." : stat.value}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
