import { ITransaction } from "@/types/transaction";
import { api } from "../api";
import { toast } from "react-toastify";

export async function getTransactions(skip?: number, take?: number) {
  try {
    const params = new URLSearchParams();
    if (skip !== undefined) params.append("skip", skip.toString());
    if (take !== undefined) params.append("take", take.toString());

    const response = await api.get(`/transaction?${params.toString()}`);
    return response.data;
  } catch (error) {
    throw new Error("Erro ao buscar transações: " + error);
  }
}

export async function createTransaction(transaction: ITransaction) {
  try {
    const response = await api.post("/transaction", transaction);
    toast.success("Transação adicionada com sucesso!");
    return response.data;
  } catch (error) {
    throw new Error("Erro ao criar transação: " + error);
  }
}

export async function updateTransaction(
  id: string,
  transaction: Partial<ITransaction>
) {
  try {
    const response = await api.patch(`/transaction/${id}`, transaction);
    toast.success("Transação atualizada com sucesso!");
    return response.data;
  } catch (error) {
    throw new Error("Erro ao atualizar transação: " + error);
  }
}

export async function deleteTransaction(id: string) {
  try {
    await api.delete(`/transaction/${id}`);
    toast.success("Transação excluída com sucesso!");
  } catch (error) {
    throw new Error("Erro ao excluir transação: " + error);
  }
}
