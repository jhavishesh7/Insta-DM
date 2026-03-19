import { onIntegrate } from "@/actions/integration";
import { redirect } from "next/navigation";

type Props = {
  searchParams: {
    code: string;
  };
};

async function Page({ searchParams: { code } }: Props) {
  if (code) {
    const user = await onIntegrate(code.split("#_")[0]);

    if (user.status === 200 || user.status === 201) {
      return redirect(
        `/dashboard/${user.data?.firstname}${user.data?.lastname}/integrations`
      );
    }

    if (user.status === 404) {
      // User might already have an integration, let's just go back to dashboard
      return redirect('/dashboard');
    }
  }

  return redirect("/dashboard"); // Better than sign-up if something failed but they were already in the app
}

export default Page;
