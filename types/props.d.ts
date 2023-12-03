export interface SearchParamsProps {
  params: {
    id: string;
  };
  searchParams: {
    q?: string;
    filter?: string;
    page?: number;
    pageSize?: number;
  };
}
