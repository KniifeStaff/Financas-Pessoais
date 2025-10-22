import React, { useState, useMemo } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { Transaction } from './types';
import { TransactionType, ExpenseStatus } from './types';

import Sidebar from './components/layout/Sidebar';
import DashboardPage from './components/pages/DashboardPage';
import PayablePage from './components/pages/PayablePage';
import PaidPage from './components/pages/PaidPage';
import IncomePage from './components/pages/IncomePage';
import ReportsPage from './components/pages/ReportsPage';
import SaidasPage from './components/pages/SaidasPage';
import { MenuIcon } from './components/icons/Icons';

type Page = 'dashboard' | 'payable' | 'paid' | 'income' | 'saidas' | 'reports';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('transactions', []);
  const [initialBalance, setInitialBalance] = useLocalStorage<number>('initialBalance', 0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const calculatedBalance = useMemo(() => {
    const totalIncome = transactions
      .filter(t => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + t.amount, 0);
    const totalPaidExpenses = transactions
      .filter(t => t.type === TransactionType.EXPENSE && t.status === ExpenseStatus.PAID)
      .reduce((sum, t) => sum + t.amount, 0);
    return initialBalance + totalIncome - totalPaidExpenses;
  }, [transactions, initialBalance]);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: `${new Date().getTime()}-${Math.random()}`,
    };
    setTransactions(prev => [...prev, newTransaction]);
  };

  const updateTransaction = (updatedTransaction: Transaction) => {
    setTransactions(prev =>
      prev.map(t => (t.id === updatedTransaction.id ? updatedTransaction : t))
    );
  };

  const deleteTransaction = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este registro?')) {
      setTransactions(prev => prev.filter(t => t.id !== id));
    }
  };

  const markAsPaid = (id: string) => {
    setTransactions(prev =>
      prev.map(t => (t.id === id ? { ...t, status: ExpenseStatus.PAID } : t))
    );
  };

  const markAsUnpaid = (id: string) => {
    setTransactions(prev =>
      prev.map(t => (t.id === id ? { ...t, status: ExpenseStatus.PENDING } : t))
    );
  };
  
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage transactions={transactions} balance={calculatedBalance} initialBalance={initialBalance} setInitialBalance={setInitialBalance} />;
      case 'payable':
        return <PayablePage transactions={transactions} addTransaction={addTransaction} markAsPaid={markAsPaid} updateTransaction={updateTransaction} deleteTransaction={deleteTransaction} />;
      case 'paid':
        return <PaidPage transactions={transactions} markAsUnpaid={markAsUnpaid} />;
      case 'income':
        return <IncomePage transactions={transactions} addTransaction={addTransaction} updateTransaction={updateTransaction} deleteTransaction={deleteTransaction} />;
      case 'saidas':
        return <SaidasPage transactions={transactions} addTransaction={addTransaction} updateTransaction={updateTransaction} deleteTransaction={deleteTransaction} />;
      case 'reports':
        return <ReportsPage transactions={transactions} />;
      default:
        return <DashboardPage transactions={transactions} balance={calculatedBalance} initialBalance={initialBalance} setInitialBalance={setInitialBalance} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex justify-between items-center p-4 bg-white border-b border-gray-200 md:justify-end">
           <button onClick={() => setSidebarOpen(true)} className="text-gray-500 focus:outline-none md:hidden">
              <MenuIcon className="h-6 w-6" />
           </button>
           <h1 className="text-2xl font-semibold text-gray-800 capitalize md:hidden">{currentPage}</h1>
           <div className="w-6 h-6 md:hidden"></div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 md:p-8">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

export default App;