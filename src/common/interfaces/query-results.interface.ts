interface IQueryResults<T> {
  count: number;
  page: number;
  pageSize: number;
  pageCount: number;
  data: T[];
}

export default IQueryResults;
