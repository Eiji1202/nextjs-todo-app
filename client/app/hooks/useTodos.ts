import { API_URL } from "@/constants/url";
import useSWR from "swr";

const fetcher = (key: string) => {
  return fetch(key).then((res) => res.json());
};

export const useTodos = () => {
  const { data, isLoading, error, mutate } = useSWR(`${API_URL}/all-todos`, fetcher);

  return {
    todos: data,
    isLoading,
    error,
    mutate,
  };
};
