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
        throw new Error("Category already exists");
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
