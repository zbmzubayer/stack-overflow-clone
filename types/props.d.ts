export type ParamsProps = {
  params: { id: string };
};

export type SearchParamsProps = {
  searchParams: {
    q?: string;
    filter?: string;
    page?: number;
    pageSize?: number;
  };
};

export type ParamsSearchProps = ParamsProps & SearchParamsProps;
