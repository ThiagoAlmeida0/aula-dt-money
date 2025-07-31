"use client";
import { BodyContainer } from "@/components/BodyContainer";
import { CardContainer } from "@/components/CardContainer";
import { FormModal } from "@/components/FormModal";
import { Header } from "@/components/Header";
import { Pagination } from "@/components/Pagination";
import { Table } from "@/components/Table";
import { useTransaction } from "@/hooks/transactions";
import { ITotal, ITransaction } from "@/types/transaction";
import { useMemo, useState } from "react";
import { ToastContainer } from "react-toastify";

const ITEMS_PER_PAGE = 10;

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<ITransaction | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  const skip = (currentPage - 1) * ITEMS_PER_PAGE;
  const { data: transactions , isLoading } = useTransaction.ListAll(skip, ITEMS_PER_PAGE);
  const { data: allTransactions } = useTransaction.ListAll(); // Para calcular totais
  const { mutateAsync: addTransaction } = useTransaction.Create();
  const { mutateAsync: updateTransaction } = useTransaction.Update();
  
  const openModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTransaction(null);
  };

  const handleAddModal = (newTransaction: ITransaction) => {
    addTransaction(newTransaction);
  }

  const handleUpdateModal = (id: string, updatedTransaction: Partial<ITransaction>) => {
    updateTransaction({ id, transaction: updatedTransaction });
  }

  const handleEditTransaction = (transaction: ITransaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  }

  const totalTransactions: ITotal = useMemo(() => {
    if (!allTransactions || allTransactions.length === 0) {
      return { totalIncome: 0, totalOutcome: 0, total: 0 };
    }
  
    return allTransactions.reduce(
      (acc: ITotal, { type, price }: ITransaction) => {
        if (type === 'INCOME') {
          acc.totalIncome += price;
          acc.total += price;
        } else if (type === 'OUTCOME') {
          acc.totalOutcome += price;
          acc.total -= price;
        }
        return acc;
      },
      { totalIncome: 0, totalOutcome: 0, total: 0 }
    );
  }, [allTransactions]);

  const totalItems = allTransactions?.length || 0;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div>
      <ToastContainer />
      <Header openModal={openModal} />
      <BodyContainer>
        <CardContainer totals={totalTransactions} />
        <Table data={transactions || []} onEdit={handleEditTransaction} />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          itemsPerPage={ITEMS_PER_PAGE}
          totalItems={totalItems}
        />
        { isModalOpen && (
          <FormModal 
            closeModal={handleCloseModal} 
            formTitle={editingTransaction ? "Editar Transação" : "Adicionar Transação"} 
            addTransaction={editingTransaction ? undefined : handleAddModal}
            updateTransaction={editingTransaction ? handleUpdateModal : undefined}
            editingTransaction={editingTransaction}
          /> 
        )}
      </BodyContainer>
    </div>
  );
}