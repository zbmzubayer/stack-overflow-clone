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

export type MetaDataProps = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};
