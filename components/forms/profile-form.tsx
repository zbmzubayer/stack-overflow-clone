'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LinkIcon } from 'lucide-react';
import { toast } from 'sonner';
import { updateUser } from '@/actions/user.action';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  name: z.string().min(1, { message: 'Required' }).min(3).max(50),
  username: z.string().min(1, { message: 'Required' }).min(3).max(50),
  portfolio: z.string().url(),
  location: z.string().max(50),
  bio: z.string().max(150),
});

type FormValues = z.infer<typeof formSchema>;

interface Props {
  clerkId: string;
  user: string;
}

export default function ProfileForm({ clerkId, user }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const parsedUser = JSON.parse(user);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: parsedUser.name || '',
      username: parsedUser.username || '',
      portfolio: parsedUser.portfolio || '',
      location: parsedUser.location || '',
      bio: parsedUser.bio || '',
    },
  });

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    try {
      await updateUser(clerkId, values);
      toast.success('Profile updated successfully');
      router.back();
    } catch (err) {
      console.log(err);
      toast.error('Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Name <span className="text-brand-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  className="paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Username <span className="text-brand-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  className="paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="portfolio"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Portfolio Link
                <LinkIcon className="ml-1 inline-block h-3.5 w-3.5 text-indigo-500" />
              </FormLabel>
              <FormControl>
                <Input
                  type="url"
                  placeholder="https://www.example.com"
                  className="paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="paragraph-semibold text-dark400_light800">Location</FormLabel>
              <FormControl>
                <Input
                  placeholder="Where are you from?"
                  className="paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="paragraph-semibold text-dark400_light800">Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell about yourself"
                  className="paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="primary-gradient px-10 text-light-800"
        >
          {isSubmitting ? 'Saving...' : 'Save'}
        </Button>
      </form>
    </Form>
  );
}
