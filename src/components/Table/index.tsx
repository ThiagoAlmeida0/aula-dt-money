import { ITransaction } from "@/types/transaction";
import { formatCurrency, formatDate } from "@/utils";
import { useState } from "react";
import { ConfirmModal } from "../ConfirmModal";
import { useTransaction } from "@/hooks/transactions";

export interface ITableProps {
    data: ITransaction[]
    onEdit?: (transaction: ITransaction) => void
}

export function Table({data, onEdit}: ITableProps) {   
    const [deleteModal, setDeleteModal] = useState<{isOpen: boolean, transactionId: string | null}>({
        isOpen: false,
        transactionId: null
    });

    const deleteTransactionMutation = useTransaction.Delete();

    const handleDeleteClick = (transactionId: string) => {
        setDeleteModal({
            isOpen: true,
            transactionId
        });
    };

    const handleConfirmDelete = async () => {
        if (deleteModal.transactionId) {
            await deleteTransactionMutation.mutateAsync(deleteModal.transactionId);
            setDeleteModal({isOpen: false, transactionId: null});
        }
    };

    const handleCloseModal = () => {
        setDeleteModal({isOpen: false, transactionId: null});
    };

    return (  
        <>     
        <table className="w-full mt-16 border-0 border-separate border-spacing-y-2 ">
        <thead>
            <tr>
                <th className="px-4 text-left text-table-header text-base font-medium">Título</th>
                <th className="px-4 text-left text-table-header text-base font-medium">Preço</th>
                <th className="px-4 text-left text-table-header text-base font-medium">Categoria</th>
                <th className="px-4 text-left text-table-header text-base font-medium">Data</th>
                <th className="px-4 text-left text-table-header text-base font-medium">Ações</th>                                   
            </tr>
        </thead>
        <tbody>
            {data.map((transaction, index) => (
                <tr key={index} className="bg-white h-16 rounded-lg">
                    <td className="px-4 py-4 whitespace-nowrap text-title">{transaction.title}</td>
                    <td className={`px-4 py-4 whitespace-nowrap text-right ${transaction.type === 'INCOME'? "text-income" : "text-outcome"}`}>{formatCurrency(transaction.price)}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-table">{transaction.category}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-table">{transaction.data ? formatDate(new Date(transaction.data)) : ''}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-table">
                        <div className="flex space-x-2">
                            {onEdit && (
                                <button
                                    onClick={() => onEdit(transaction)}
                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                >
                                    Editar
                                </button>
                            )}
                            <button
                                onClick={() => handleDeleteClick(transaction.id!)}
                                className="text-red-600 hover:text-red-800 text-sm font-medium"
                            >
                                Excluir
                            </button>
                        </div>
                    </td>                             
                </tr>
            ))}
        </tbody>
    </table>

    <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        title="Excluir Transação"
        message="Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
    />
    </> 
    )
}