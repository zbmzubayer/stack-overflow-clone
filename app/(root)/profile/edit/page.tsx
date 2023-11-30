import { getUserById } from '@/actions/user.action';
import ProfileForm from '@/components/forms/profile-form';
import { auth } from '@clerk/nextjs';

export default async function EditProfilePage() {
  const { userId } = auth();
  const mongoUser = await getUserById(userId!);
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Edit Profile</h1>
      <div className="mt-9">
        <ProfileForm clerkId={userId!} user={JSON.stringify(mongoUser)} />
      </div>
    </>
  );
}
