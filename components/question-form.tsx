'use client';

import { useEffect, useRef, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { XIcon } from 'lucide-react';
import { Editor } from '@tinymce/tinymce-react';
import envConfig from '@/config';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { getUserById } from '@/actions/user.action';
import { createQuestion } from '@/actions/question.action';
import { TagBadge } from './tags-badge';

const formSchema = z.object({
  title: z.string().trim().min(1, { message: 'Required' }).min(5).max(120),
  content: z.string().min(20),
  tags: z.array(z.string().trim().min(1).max(15)).min(1, { message: 'Required' }).max(3),
});

type FormValues = z.infer<typeof formSchema>;

export default function QuestionForm({ userId }: { userId: string }) {
  const editorRef = useRef(null);
  const router = useRouter();

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, field: any) => {
    if (e.key === 'Enter' && field.name === 'tags') {
      e.preventDefault();
      const tagInput = e.target as HTMLInputElement;
      const tagValue = tagInput.value.trim().toLocaleLowerCase(); // trim for removing spaces and toLowerCase for consistency
      if (tagValue.length > 15) {
        form.setError('tags', {
          type: 'required',
          message: 'Tag length should be less than 15 characters',
        });
      }
      if (!field.value.includes(tagValue as never)) {
        form.setValue('tags', [...field.value, tagValue]);
        tagInput.value = '';
        form.clearErrors('tags');
      } else {
        form.trigger();
      }
    }
  };

  const handleTagRemove = (tag: string, field: any) => {
    const newTags = field.value.filter((t: string) => t !== tag);
    form.setValue('tags', newTags);
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      content: '',
      tags: [],
    },
  });

  async function onSubmit(values: FormValues) {
    console.log(values);
    try {
      const getMongoUser = await getUserById(userId!);
      const payload = { ...values, author: getMongoUser._id };
      await createQuestion(payload);
      router.push('/');
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Question Title <span className="text-brand-500">*</span>
              </FormLabel>
              <FormControl>
                <Input className="no-focus paragraph-regular light-border-2 border" {...field} />
              </FormControl>
              <FormDescription>
                Be specific and imagine you&apos;re asking a question to another person
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Detail explanation of your problem <span className="text-brand-500">*</span>
              </FormLabel>
              <FormControl>
                <Editor
                  apiKey={envConfig.TINY_API_KEY}
                  // @ts-ignore
                  onInit={(evt, editor) => (editorRef.current = editor)}
                  onBlur={field.onBlur}
                  onEditorChange={(content) => field.onChange(content)}
                  init={{
                    height: 350,
                    menubar: false,
                    placeholder: 'Explain your problem in detail...',
                    plugins: [
                      'advlist',
                      'autolink',
                      'lists',
                      'link',
                      'image',
                      'charmap',
                      'print',
                      'preview',
                      'anchor',
                      'searchreplace',
                      'visualblocks',
                      'codesample',
                      'fullscreen',
                      'insertdatetime',
                      'media',
                      'table',
                    ],
                    toolbar:
                      'undo redo | codesample | bold italic forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist fullscreen',
                    content_style: 'body { font-family:Inter; font-size:14px }',
                  }}
                />
              </FormControl>
              <FormDescription>
                Introduce the problem and expand the context to include any extra details that help.
                Minimum 10 characters.
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Tags <span className="text-brand-500">*</span>
              </FormLabel>
              <FormControl>
                <>
                  <Input
                    placeholder="Add tags..."
                    className="no-focus paragraph-regular light-border-2 border"
                    onKeyDown={(e) => handleInputKeyDown(e, field)}
                  />
                  {field.value.length > 0 && (
                    <div className="mt-2.5 flex items-center gap-2.5">
                      {field.value.map((tag: string) => (
                        <TagBadge key={tag} size="sm">
                          {tag}
                          <XIcon
                            className="h-3.5 w-3.5"
                            role="button"
                            onClick={() => handleTagRemove(tag, field)}
                          />
                        </TagBadge>
                      ))}
                    </div>
                  )}
                </>
              </FormControl>
              <FormDescription>
                Add upto 3 tags to describe what your question is about. You need to press enter to
                add a tag.
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <Button type="submit" className="primary-gradient px-10 text-light-800">
          Submit
        </Button>
      </form>
    </Form>
  );
}