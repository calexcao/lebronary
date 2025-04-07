"use client";

import { StarIcon } from "lucide-react";

function Rating({
  rating,
  ratingClick,
}: {
  rating: number;
  ratingClick?: (index: number) => void;
}) {
  return (
    <div className="flex">
      {[...Array(5)].map((_, index) => (
        <StarIcon
          size={16}
          key={index}
          onClick={() => ratingClick?.(index + 1)}
          className="cursor-pointer text-yellow-300 hover:text-yellow-500"
          fill={index < rating ? "yellow" : "none"}
        />
      ))}
    </div>
  );
}

export default Rating;
