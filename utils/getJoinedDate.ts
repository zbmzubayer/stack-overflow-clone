export default function getJoinedDate(date: Date): string {
  const day = date.getDate();
  const month = date.toLocaleDateString('default', { month: 'long' });
  const year = date.getFullYear();

  return `${day} ${month}, ${year}`;
}
