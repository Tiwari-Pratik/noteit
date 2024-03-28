
"use client";

import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";

const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="flex-1">
      {!pending ? "SignIn" : "Logging in ..."}
    </Button>
  );
};

export default SubmitButton;
