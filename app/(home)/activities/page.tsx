import ActivityDateSelect from "@/components/ActivityDateSelect";
import { prisma } from "@/lib/prisma";
import { addDays, format, parse } from "date-fns";
import { Calendar, Clock, Users, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchParams } from "@/lib/utils";

async function Activities(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;

  const activities = await prisma.activities.findMany({
    where: {
      date: {
        gte: parse(searchParams.from as string, "yyyy-MM-dd", new Date()),
        lte: addDays(
          parse(searchParams.to as string, "yyyy-MM-dd", new Date()),
          1
        ),
      },
    },
    orderBy: {
      date: "asc",
    },
  });

  // Group activities by date
  const groupedActivities: Record<string, typeof activities> =
    activities.reduce((groups, activity) => {
      const dateKey = format(new Date(activity.date), "yyyy-MM-dd");
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(activity);
      return groups;
    }, {} as Record<string, typeof activities>);

  return (
    <div className="container mx-auto p-4 pt-10 space-y-8">
      <div className="flex flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">Library Activities</h1>
        <ActivityDateSelect />
      </div>

      {activities.length > 0 ? (
        <div className="space-y-10">
          {Object.entries(groupedActivities).map(
            ([dateKey, dateActivities]) => (
              <div key={dateKey} className="space-y-4">
                <div className="flex items-center">
                  <Calendar className="mr-2" />
                  <h2 className="text-xl font-semibold">
                    {format(new Date(dateKey), "EEEE, MMMM d, yyyy")}
                  </h2>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {dateActivities.map((activity) => (
                    <div
                      key={activity.activity_id}
                      className="border rounded-lg overflow-hidden flex flex-col"
                    >
                      <div className="bg-popover p-4">
                        <div className="flex justify-between items-start">
                          <h3 className="text-lg font-bold">
                            {activity.title}
                          </h3>
                          <span className="text-xs px-2 py-1 rounded-full bg-secondary text-foreground">
                            {activity.age_group}
                          </span>
                        </div>
                        <div className="flex items-center text-sm mt-2 text-muted-foreground">
                          <Clock size={14} className="mr-1" />
                          <span>
                            {activity.start_time} - {activity.end_time}
                          </span>
                        </div>
                      </div>

                      <div className="p-4 flex-grow">
                        <p className="text-sm">{activity.description}</p>
                      </div>

                      <div className="border-t p-4 flex justify-between items-center">
                        <div className="flex items-center">
                          <Users size={14} className="mr-1" />
                          <span className="text-xs">
                            Capacity: {activity.capacity}
                          </span>
                        </div>
                        {/* Work in progress, temp redirect */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex items-center gap-1"
                          asChild
                        >
                          <a href={`/activities/${activity.activity_id}`}>
                            Details
                            <ChevronRight size={16} />
                          </a>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      ) : (
        <div className="bg-secondary/10 rounded-lg p-8 text-center">
          <p className="text-xl font-semibold">
            No activities found for selected dates
          </p>
          <p className="text-muted-foreground mt-2">
            Try selecting a different date range
          </p>
        </div>
      )}
    </div>
  );
}

export default Activities;
