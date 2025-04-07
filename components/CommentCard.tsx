import { prisma } from "@/lib/prisma";
import { getAvatarLetter } from "@/lib/utils";
import { format } from "date-fns";
import Rating from "./Rating";
import { Separator } from "./ui/separator";

async function CommentCard({ id }: { id: number }) {
  const ratings = await prisma.ratings.findMany({
    where: {
      book_id: id,
    },
    include: {
      users: {
        select: { name: true },
      },
    },
  });

  return (
    <>
      {ratings.map((rating) => (
        <div key={rating.rating_id} className="flex flex-col p-2 mb-4">
          <div className="flex items-start space-x-4 p-4 max-w-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent">
              {getAvatarLetter(rating.users.name)}
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-semibold capitalize">
                {rating.users.name}
              </h4>
              <div className="flex items-center text-sm space-x-2 text-muted-foreground">
                <p>{format(rating.created_at, "MMMM dd, yyyy")}</p>
                <Rating rating={rating.rating} />
              </div>
              <p className="mt-2">{rating.review}</p>
            </div>
          </div>
          <Separator className="max-w-5xl" />
        </div>
      ))}
    </>
  );
}

export default CommentCard;
