import {
  createTransaction,
  getTransactions,
  deleteTransaction,
  updateTransaction,
} from "@/services/transactions";
import { ITransaction } from "@/types/transaction";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const QUERY_KEY = "qkTransaction";

const Create = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};

const Update = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      transaction,
    }: {
      id: string;
      transaction: Partial<ITransaction>;
    }) => updateTransaction(id, transaction),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};

const Delete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};
const ListAll = (skip?: number, take?: number) => {
  return useQuery({
    queryKey: [QUERY_KEY, skip, take],
    queryFn: () => getTransactions(skip, take),
  });
};

export const useTransaction = {
  Create,
  Update,
  Delete,
  ListAll,
};
