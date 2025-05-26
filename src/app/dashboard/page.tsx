
import { redirect } from 'next/navigation';
import { getAuth } from '@/actions/auth';
export default async function Dashboard() {
  // const { userId } = await auth();
    const auth = await getAuth();

    console.log("auth", auth);

  if (!auth.isAuth) {
    return redirect('/auth/sign-in');
  } else {
    redirect('/dashboard/overview');
  }
}
