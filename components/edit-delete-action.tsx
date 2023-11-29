'use client';

import { FileEditIcon, TrashIcon } from 'lucide-react';

interface Props {
  type: 'Question' | 'Answer';
  itemId: string;
}

export default function EditDeleteAction({ type, itemId }: Props) {
  const handleEdit = () => {};
  const handleDelete = () => {
    if (type === 'Question') {
      // delete question
    } else if (type === 'Answer') {
      // delete answer
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
