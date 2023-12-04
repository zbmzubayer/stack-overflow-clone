'use client';

import { usePathname, useRouter } from 'next/navigation';
import { FileEditIcon, TrashIcon } from 'lucide-react';
import { deleteQuestion } from '@/actions/question.action';
import { deleteAnswer } from '@/actions/answer.action';
import { toast } from 'sonner';

interface Props {
  type: 'Question' | 'Answer';
  itemId: string;
}

export default function EditDeleteAction({ type, itemId }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const handleEdit = () => {
    router.push(`/question/edit/${itemId}`);
  };

  const handleDelete = async () => {
    if (type === 'Question') {
      // delete question
      await deleteQuestion({ questionId: itemId, path: pathname });
      toast.warning('Question deleted successfully');
    } else if (type === 'Answer') {
      // delete answer
      await deleteAnswer({ answerId: itemId, path: pathname });
      toast.warning('Answer deleted successfully');
    }
  };

  return (
    <div className="flex items-center gap-3">
      {type === 'Question' && (
        <FileEditIcon
          role="button"
          className="h-3.5 w-3.5 stroke-blue-400 transition-all hover:scale-110"
          onClick={handleEdit}
        />
      )}
      <TrashIcon
        role="button"
        className="h-3.5 w-3.5 stroke-red-500 transition-all hover:scale-110"
        onClick={handleDelete}
      />
    </div>
  );
}
