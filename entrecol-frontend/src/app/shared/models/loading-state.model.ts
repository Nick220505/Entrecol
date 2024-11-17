export interface LoadingState<T> {
  data: T;
  loading: boolean;
  initialLoad: boolean;
}
