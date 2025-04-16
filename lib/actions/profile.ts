"use server";
import { auth } from "@/auth";

// import { db } from "@/database/drizzle";
// import { eq } from "drizzle-orm";

export const getConfirmations = async (userId: string) => {
  console.log(userId);
  // const result = await db
  //   .select()
  //   .from(confirmations)
  //   .where(eq(confirmations.userId, userId))
  //   .limit(1);
  // console.log(result);
  return true;
};

export const createOrUpdateConfirmations = async (
  props: ConfirmationsProps
) => {
  console.log(props);
  const session = await auth();
  if (!session)
    return {
      success: false,
      error: "You must be logged in to update your confirmations",
    };

  return;

  // const { dataPrivacy, dataProcessing } = props;

  // const user = await db..update({
  //     where: { id: userId },
  //     data: { dataPrivacy, dataProcessing },
  // });

  // try {
  //   await db
  //     .insert(confirmations)
  //     .values({
  //       userId: session.user?.id as string,
  //       dataPrivacy,
  //       dataProcessing,
  //       updatedAt: new Date(), // Update `updatedAt` on conflict
  //     })
  //     .onConflictDoUpdate({
  //       target: confirmations.userId, // Target the unique index on `userId`
  //       set: {
  //         dataPrivacy,
  //         dataProcessing,
  //         updatedAt: new Date(), // Update the timestamp
  //       },
  //     });
  //   return {
  //     success: true,
  //   };
  // } catch (error) {
  //   console.error(error);
  //   return {
  //     success: false,
  //     error: "An error occurred while updating the confirmations",
  //   };
  // }
};
