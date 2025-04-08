"use client";

import { addRating, State } from "@/actions/action";
import Rating from "./Rating";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useActionState, useState } from "react";

function CommentBox({ id }: { id: number }) {
  const initialState: State = { message: null };
  const [rating, setRating] = useState(0);
  const addRatingToBook = addRating.bind(null, id);
  const [state, formAction, isPending] = useActionState(
    addRatingToBook,
    initialState
  );

  return (
    <div className="flex flex-col p-2 max-w-5xl">
      <div className="flex flex-col border rounded-lg p-4">
        <p className="font-semibold text-lg py-1">Share Your Thoughts</p>
        <form action={formAction}>
          <input type="hidden" name="rating" value={rating} />
          <Rating rating={rating} ratingClick={(index) => setRating(index)} />
          <Textarea
            maxLength={200}
            className="bg-foreground mt-3"
            name="comment"
            placeholder="Leave your comments"
          />
          <Button type="submit" className="mt-3 mb-2" disabled={isPending}>
            Submit
          </Button>
          <div>{state?.message ? <p>{state.message}</p> : null}</div>
        </form>
      </div>
    </div>
  );
}

export default CommentBox;
