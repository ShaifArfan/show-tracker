import Register from '@/components/signup/RegisterEmail';
import { SignUpForm } from '@/components/signup/SignUpForm';

function page({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const { token } = searchParams;
  if (token) {
    return <SignUpForm token={token} />;
  }

  return <Register />;
}

export default page;
