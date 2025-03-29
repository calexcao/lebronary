"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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
    await prisma.categories.delete({
      where: {
        id: id,
      },
    });

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
}: {
  name: string;
  isbn: string;
  copies: number;
  category: number[];
  path: string;
  photos: string[];
  publish_year: number;
  author: string;
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
    await prisma.books.delete({
      where: {
        id: id,
      },
    });

    revalidatePath(path);
  } catch (error) {
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
}: {
  id: number;
  name: string;
  isbn: string;
  copies: number;
  category: number[];
  path: string;
  publish_year: number;
  author: string;
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

//Photos
export async function addPhoto(
  table: string,
  id: number,
  url: string,
  path: string
) {
  try {
    await prisma.$transaction(async (t) => {
      if (table === "book") {
        await t.book_photos.create({
          data: {
            book_id: id,
            url: url,
          },
        });
      } else if (table === "activity") {
        await t.activity_photos.create({
          data: {
            activity_id: id,
            url: url,
          },
        });
      }
    });
    revalidatePath(path);
  } catch (error) {
    throw error;
  }
}
