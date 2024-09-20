import React from "react";
import { currentUser } from "@/lib/auth";
import { UserInfo } from "@/components/auth/user-info";

const page = async () => {
  const user = await currentUser();

  return <UserInfo label="Server Component" user={user} />;
};

export default page;
