import type { Metadata } from 'next';
import { SignUp } from '@clerk/nextjs';

export const metadata: Metadata = {
  title: 'Dev Overflow | Sign Up',
  description:
    'Create your Dev Overflow account today and start asking questions and answering them!',
};

export default function SignUpPage() {
  return <SignUp />;
}
