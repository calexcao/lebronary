"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

//Category
export async function addCategory(name: string, path: string) {
  try {
    const category = await prisma.$transaction([
      prisma.categories.create({
        data: {
          name: name,
        },
      }),
    ]);

    revalidatePath(path);
    return category;
  } catch (error) {
    throw error;
  }
}
