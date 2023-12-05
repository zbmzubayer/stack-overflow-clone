import type { Metadata } from 'next';
import { SignIn } from '@clerk/nextjs';

export const metadata: Metadata = {
  title: 'Dev Overflow | Login',
  description: 'Login to Dev Overflow',
};

export default function SignInPage() {
  return <SignIn />;
}
