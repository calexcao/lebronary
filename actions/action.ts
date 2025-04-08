"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { deleteObject } from "firebase/storage";
import { storageRef } from "@/lib/firebase";
import bcrypt from "bcryptjs";
import { auth, signIn, signOut } from "@/auth";
import { addDays, differenceInCalendarDays } from "date-fns";
import { z } from "zod";
import { stripe } from "@/lib/stripe";
import { formatAmountForStripe } from "@/lib/utils";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

//Category
export async function addCategory(name: string, path: string) {
  try {
    const category = await prisma.$transaction(async (prisma) => {
      const existingCategory = await prisma.categories.findFirst({
        where: { name },
      });

      if (existingCategory) {
        return existingCategory;
      }

      return await prisma.categories.create({
        data: { name },
      });
    });

    revalidatePath(path);
    return category;
  } catch (error) {
    throw error;
  }
}

export async function deleteCategory(id: number, path: string) {
  try {
    await prisma.$transaction([
      prisma.categories.delete({
        where: {
          id: id,
        },
      }),
    ]);

    revalidatePath(path);
  } catch (error) {
    throw error;
  }
}

export async function editCategory(id: number, name: string, path: string) {
  if (!id) throw new Error("Category ID is required");
  try {
    await prisma.categories.update({
      where: {
        id: id,
      },
      data: {
        name: name,
      },
    });

    revalidatePath(path);
  } catch (error) {
    throw error;
  }
}

export async function getCategories(offset: number, limit: number) {
  try {
    let categories;
    let total;

    if (limit === -1) {
      categories = await prisma.categories.findMany();
      total = categories.length;
    } else {
      [categories, total] = await prisma.$transaction([
        prisma.categories.findMany({ skip: offset, take: limit }),
        prisma.categories.count(),
      ]);
    }

    return { data: categories, total: total };
  } catch (error) {
    throw error;
  }
}

//Books
export async function addBook({
  name,
  isbn,
  copies,
  category,
  path,
  photos,
  publish_year,
  author,
  description,
}: {
  name: string;
  isbn: string;
  copies: number;
  category: number[];
  path: string;
  photos: string[];
  publish_year: number;
  author: string;
  description?: string;
}) {
  try {
    await prisma.$transaction(async (t) => {
      const book = await t.books.create({
        data: {
          name: name,
          isbn: isbn,
          copies: copies,
          publish_year: publish_year,
          author: author,
          description: description,
        },
      });

      if (category && category.length > 0) {
        const data = category.map((cat) => ({
          book_id: book.id,
          category_id: cat,
        }));

        await t.category_links.createMany({ data });
      }

      if (photos && photos.length > 0) {
        const data = photos.map((photo) => ({
          book_id: book.id,
          url: photo,
        }));

        await t.book_photos.createMany({ data });
      }

      revalidatePath(path);
    });
  } catch (error) {
    throw error;
  }
}

export async function deleteBook(id: number, path: string) {
  try {
    const book_photos = await prisma.book_photos.findMany({
      where: { book_id: id },
    });

    await prisma.$transaction(
      async (t) =>
        await t.books.delete({
          where: {
            id: id,
          },
        })
    );

    // After database deletion, delete each photo from Firebase storage
    for (const photo of book_photos) {
      try {
        const fileRef = storageRef(photo.url);
        await deleteObject(fileRef);
      } catch (firebaseError) {
        console.error("Error deleting image from Firebase:", firebaseError);
      }
    }

    revalidatePath(path);
  } catch (error) {
    console.error("Error deleting book:", error);
    throw error;
  }
}

export async function editBook({
  id,
  name,
  isbn,
  copies,
  category,
  path,
  publish_year,
  author,
  description,
}: {
  id: number;
  name: string;
  isbn: string;
  copies: number;
  category: number[];
  path: string;
  publish_year: number;
  author: string;
  description?: string;
}) {
  try {
    await prisma.$transaction(async (t) => {
      const book = await t.books.update({
        where: {
          id: id,
        },
        data: {
          name: name,
          isbn: isbn,
          copies: copies,
          publish_year: publish_year,
          author: author,
          description: description,
        },
      });

      await t.category_links.deleteMany({
        where: {
          book_id: book.id,
        },
      });

      if (category && category.length > 0) {
        const data = category.map((cat) => ({
          book_id: book.id,
          category_id: cat,
        }));

        await t.category_links.createMany({ data });
      }

      revalidatePath(path);
    });
  } catch (error) {
    throw error;
  }
}

export async function cancelHold(id: number, path: string) {
  await prisma.$transaction((t) =>
    t.reservations.delete({
      where: {
        reservation_id: id,
      },
    })
  );

  revalidatePath(path);
}

export async function placeHold(id: number, path: string) {
  const session = await auth();
  if (!session) {
    throw new Error("You must be logged in to place a hold.");
  }
  await prisma.$transaction((t) =>
    t.reservations.create({
      data: {
        book_id: id,
        user_id: session?.user.id,
        date: new Date(),
        expiration: addDays(new Date(), 15),
      },
    })
  );

  revalidatePath(path);
}

//Activities
export async function addActivity({
  title,
  description,
  date,
  start_time,
  end_time,
  age_group,
  capacity,
  photos,
  path,
}: {
  title: string;
  description: string;
  date: Date;
  start_time: string;
  end_time: string;
  age_group: string;
  capacity: number;
  photos: string[];
  path: string;
}) {
  try {
    await prisma.$transaction(async (t) => {
      const result = await t.activities.create({
        data: {
          title: title,
          description: description,
          date: date,
          start_time: start_time,
          end_time: end_time,
          age_group: age_group,
          capacity: capacity,
        },
      });

      if (photos && photos.length > 0) {
        const data = photos.map((photo) => ({
          activity_id: result.activity_id,
          url: photo,
        }));

        await t.activity_photos.createMany({ data });
      }
    });

    revalidatePath(path);
  } catch (error) {
    throw error;
  }
}

export async function deleteActivity(id: number, path: string) {
  try {
    await prisma.$transaction([
      prisma.activities.delete({
        where: {
          activity_id: id,
        },
      }),
    ]);

    revalidatePath(path);
  } catch (error) {
    throw error;
  }
}
export async function editActivity({
  activity_id,
  title,
  description,
  date,
  start_time,
  end_time,
  age_group,
  capacity,
  path,
}: {
  activity_id: number;
  title: string;
  description: string;
  date: Date;
  start_time: string;
  end_time: string;
  age_group: string;
  capacity: number;
  path: string;
}) {
  try {
    await prisma.$transaction([
      prisma.activities.update({
        where: {
          activity_id: activity_id,
        },
        data: {
          title: title,
          description: description,
          date: date,
          start_time: start_time,
          end_time: end_time,
          age_group: age_group,
          capacity: capacity,
        },
      }),
    ]);

    revalidatePath(path);
  } catch (error) {
    throw error;
  }
}

//Users
export async function addUser(
  name: string,
  email: string,
  card: string,
  role: string,
  is_active: boolean,
  path: string
) {
  try {
    //Temporary password
    const hashPassword = await bcrypt.hash("password", 10);

    const user = await prisma.$transaction([
      prisma.users.create({
        data: {
          name: name,
          email: email,
          card: card,
          password: role === "staff" ? hashPassword : "",
          role: role,
          is_active: is_active,
          image: "",
          status: role === "staff" ? "pending" : "",
        },
      }),
    ]);
    revalidatePath(path);
    return user;
  } catch (error) {
    throw error;
  }
}

export async function deleteUser(id: string, path: string) {
  try {
    const result = await prisma.$transaction(async (transaction) => {
      await transaction.users.delete({
        where: {
          id: id,
        },
      });
    });

    revalidatePath(path);

    return result;
  } catch (error) {
    throw error;
  }
}

export async function editUser(
  id: string,
  name: string,
  email: string,
  card: string,
  role: string,
  is_active: boolean,
  path: string
) {
  if (!id) return { message: "Missing data is required" };

  try {
    await prisma.$transaction(async (transaction) => {
      await transaction.users.update({
        where: {
          id: id,
        },
        data: {
          name: name,
          email: email,
          role: role,
          card: card,
          is_active: is_active,
        },
      });
    });

    if (path) revalidatePath(path);

    return { message: "user updated" };
  } catch (error) {
    throw error;
  }
}

const passwordFormSchema = z.object({
  new_password: z.string().min(8),
});

export async function updateProfile(prevState: State, formData: FormData) {
  const new_password = formData.get("new_password") as string;
  const old_password = formData.get("old_password") as string;

  const session = await auth();

  if (!session) {
    await signIn();
  }

  const user = await prisma.users.findUnique({
    where: {
      id: session?.user.id,
    },
  });

  if (!user) {
    return { message: "Invalid user" };
  }

  if (new_password) {
    const passwordValidate = passwordFormSchema.safeParse({
      new_password: new_password,
    });

    if (!passwordValidate.success) {
      return { message: "Invalid password" };
    }

    const password_match = await bcrypt.compare(old_password, user.password);

    if (!password_match) {
      return { message: "Invalid password" };
    }

    const new_hash_password = bcrypt.hashSync(new_password, 10);

    await prisma.users.update({
      where: {
        id: session?.user.id,
      },
      data: {
        password: new_hash_password,
        status: "",
      },
    });

    await signOut({
      redirectTo: `/auth/signin?callbackUrl=${encodeURIComponent(
        "/admin"
      )}&message=${encodeURIComponent("password updated, Please log in.")}`,
    });
  }

  return {
    message: "profile updated",
  };
}

//Photos
export async function addPhoto(
  table: string,
  id: number,
  url: string,
  path: string
) {
  try {
    const newPhoto = await prisma.$transaction(async (t) => {
      if (table === "book") {
        return await t.book_photos.create({
          data: {
            book_id: id,
            url: url,
          },
        });
      } else if (table === "activity") {
        return await t.activity_photos.create({
          data: {
            activity_id: id,
            url: url,
          },
        });
      }
    });
    revalidatePath(path);
    return {
      photo_id: newPhoto?.photo_id as number,
      url: newPhoto?.url as string,
    };
  } catch (error) {
    throw error;
  }
}

export async function deletePhoto(table: string, id: number, path: string) {
  try {
    const result = await prisma.$transaction(async (t) => {
      if (table === "book") {
        await t.book_photos.delete({
          where: {
            photo_id: id,
          },
        });
      } else if (table === "activity") {
        await t.activity_photos.delete({
          where: {
            photo_id: id,
          },
        });
      }
    });
    revalidatePath(path);
    return result;
  } catch (error) {
    throw error;
  }
}

//Fines
export async function markAsPaid(id: number, path: string) {
  try {
    await prisma.$transaction(async (transaction) => {
      await transaction.fines.update({
        where: {
          fine_id: id,
        },
        data: {
          paid_date: new Date(),
        },
      });
    });

    revalidatePath(path);

    return { message: "Fine paid" };
  } catch (error) {
    throw error;
  }
}

export async function deleteFine(id: number, path: string) {
  try {
    await prisma.$transaction(async (transaction) => {
      await transaction.fines.delete({
        where: {
          fine_id: id,
        },
      });
    });

    revalidatePath(path);

    return { message: "Fine deleted" };
  } catch (error) {
    throw error;
  }
}

export async function createCheckoutSession(data: FormData) {
  const session = await auth();
  if (!session) throw new Error("you must be logged in");

  const fine_id = +data.get("fine_id")!;
  const fine = await prisma.fines.findUnique({
    where: {
      fine_id: fine_id,
    },
    include: {
      borrowings: {
        include: {
          books: {
            select: { name: true },
          },
        },
      },
    },
  });

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    submit_type: "pay",
    metadata: {
      fine_id: fine_id,
    },
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "cad",
          product_data: {
            name: `Late return fine for ${fine?.borrowings.books.name}`,
          },
          unit_amount: formatAmountForStripe(
            fine?.amount as unknown as number,
            "CAD"
          ),
        },
      },
    ],
    success_url: `${(
      await headers()
    ).get("origin")}/fine/result?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${(await headers()).get("origin")}`,
  });

  redirect(checkoutSession.url!);
}

//Staff Picks
export async function addToStaffPicks(id: number, path: string) {
  const session = await auth();
  if (!session) {
    throw new Error("You must be logged in to add to staff picks.");
  }

  try {
    await prisma.$transaction([
      prisma.staff_picks.create({
        data: {
          book_id: id,
          user_id: session?.user.id,
          date: new Date(),
        },
      }),
    ]);
  } catch (error) {
    throw error;
  }

  revalidatePath(path);
}

export async function removeFromStaffPicks(id: number, path: string) {
  try {
    await prisma.$transaction([
      prisma.staff_picks.delete({
        where: {
          pick_id: id,
        },
      }),
    ]);
  } catch (error) {
    throw error;
  }

  revalidatePath(path);
}

//Ratings
export async function addRating(
  id: number,
  prevState: State,
  formData: FormData
) {
  const session = await auth();
  if (!session) {
    return { message: "You must be logged in to add a rating." };
  }

  await prisma.$transaction([
    prisma.ratings.create({
      data: {
        book_id: id,
        user_id: session?.user.id,
        rating: +formData.get("rating")!,
        review: formData.get("comment") as string,
      },
    }),
  ]);
  return {
    message: "Thank you for your feedback!",
  };
}

//Kiosk
export async function checkout(prevState: State, formData: FormData) {
  const card = formData.get("card") as string;
  const isbn = formData.get("isbn")?.toString().replaceAll("-", "");

  const book = await prisma.books.findFirst({
    where: {
      isbn: isbn,
    },
    select: {
      id: true,
      name: true,
    },
  });

  const user = await prisma.users.findFirst({
    where: {
      card: card,
    },
  });

  if (book && user) {
    const date = new Date();
    await prisma.$transaction(
      async (t) =>
        await t.borrowings.create({
          data: {
            book_id: book.id,
            user_id: user.id,
            borrow_date: date,
            due_date: addDays(date, 14),
          },
        })
    );
    return {
      message: "You have successfully checked out the book",
    };
  }
  return {
    message: "Checkout failed, please see a librarian",
  };
}

export async function checkin(prevState: State, formData: FormData) {
  const isbn = formData.get("isbn")?.toString().replaceAll("-", "");
  const book = await prisma.books.findFirst({
    where: {
      isbn: isbn,
    },
    select: {
      id: true,
      name: true,
    },
  });

  const borrowing = await prisma.borrowings.findFirst({
    where: {
      book_id: book?.id,
    },
  });

  if (!borrowing) {
    return {
      message: "Invalid transaction, please see a librarian",
    };
  }

  const user_id = borrowing?.user_id;
  const return_date = new Date();
  const dayDiff = differenceInCalendarDays(
    return_date,
    borrowing?.due_date as Date
  );
  let message = "";

  await prisma.$transaction(async (t) => {
    await t.borrowings.update({
      where: {
        borrowing_id: borrowing?.borrowing_id,
      },
      data: {
        return_date: return_date,
      },
    });

    if (dayDiff > 0) {
      const amount = dayDiff * 0.5;
      await t.fines.create({
        data: {
          fine_date: return_date,
          amount: amount,
          user_id: user_id,
          borrowing_id: borrowing?.borrowing_id,
        },
      });
      message = `You have a fine of $${amount} for late return`;
    } else {
      message = "Book returned successfully";
    }
  });

  return {
    message: message,
  };
}

//Extra
export type State = {
  message?: string | null;
};
