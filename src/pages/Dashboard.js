import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Cards from '../components/Cards';
import moment from "moment";
import { toast } from 'react-toastify';
import { auth, db } from "../firebase";
import { addDoc, collection, getDocs, query, deleteDoc, doc, updateDoc, writeBatch } from "firebase/firestore";
import AddExpenseModal from '../components/Modals/addExpense';
import AddIncomeModal from '../components/Modals/addIncome';
import { useAuthState } from 'react-firebase-hooks/auth';
import TransactionsTable from '../components/TransactionsTable';
import Charts from '../components/Charts/index.js';
import NoTransactions from '../components/NoTransactions';

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user] = useAuthState(auth);
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);

  const showExpenseModal = () => {
    setIsExpenseModalVisible(true);
  };

  const showIncomeModal = () => {
    setIsIncomeModalVisible(true);
  };

  const handleExpenseCancel = () => {
    setIsExpenseModalVisible(false);
  };

  const handleIncomeCancel = () => {
    setIsIncomeModalVisible(false);
  };

  const onFinish = (values, type) => {
    const newTransaction = {
      type: type,
      date: (values.date).format("YYYY-MM-DD"),
      amount: parseFloat(values.amount),
      tag: values.tag,
      name: values.name,
    };
    addTransaction(newTransaction);
  };

  async function addTransaction(transaction, many) {
    try {
      const docRef = await addDoc(
        collection(db, `users/${user.uid}/transactions`),
        transaction
      );
      console.log("Document written with ID: ", docRef.id);

      setTransactions((prevTransactions) => [...prevTransactions, { id: docRef.id, ...transaction }]);
      calculateBalance([...transactions, { id: docRef.id, ...transaction }]);

      if (!many) toast.success("Transaction Added!");
    } catch (e) {
      console.error("Error adding document: ", e);
      if (!many) toast.error("Couldn't add transaction");
    }
  }

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user]);

  async function fetchTransactions() {
    setLoading(true);
    if (user) {
      const q = query(collection(db, `users/${user.uid}/transactions`));
      const querySnapshot = await getDocs(q);
      let transactionsArray = [];
      querySnapshot.forEach((doc) => {
        transactionsArray.push({ id: doc.id, ...doc.data() });
      });
      setTransactions(transactionsArray);
      console.log("transactions array", transactionsArray);
      toast.success("Transactions Fetched!");
      calculateBalance(transactionsArray);
    }
    setLoading(false);
  }

  const updateTransaction = async (updatedTransaction) => {
    try {
      const transactionRef = doc(db, `users/${user.uid}/transactions`, updatedTransaction.id);
      await updateDoc(transactionRef, updatedTransaction);
      fetchTransactions();
      toast.success("Transaction Updated");
    } catch (e) {
      console.error("Error updating document: ", e);
      toast.error("Couldn't update transaction");
    }
  };

  const deleteTransaction = async (transactionId) => {
    try {
      const transactionRef = doc(db, `users/${user.uid}/transactions`, transactionId);
      await deleteDoc(transactionRef);
      fetchTransactions();
      toast.success("Transaction Deleted");
    } catch (e) {
      console.error("Error deleting document: ", e);
      toast.error("Couldn't delete transaction");
    }
  };

  const calculateBalance = (transactionsArray) => {
    let incomeTotal = 0;
    let expensesTotal = 0;

    transactionsArray.forEach((transaction) => {
      if (transaction.type === "income") {
        incomeTotal += transaction.amount;
      } else {
        expensesTotal += transaction.amount;
      }
    });

    setIncome(incomeTotal);
    setExpense(expensesTotal);
    setTotalBalance(incomeTotal - expensesTotal);
  };

  const resetData = async () => {
    if (user) {
      const q = query(collection(db, `users/${user.uid}/transactions`));
      const querySnapshot = await getDocs(q);

      const batch = writeBatch(db);

      querySnapshot.forEach((document) => {
        const docRef = doc(db, `users/${user.uid}/transactions`, document.id);
        batch.delete(docRef);
      });

      await batch.commit();
    }

    setIncome(0);
    setExpense(0);
    setTotalBalance(0);
    setTransactions([]);
    toast.success("Data Reset!");
  };

  let sortedTransactions = transactions.sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  });

  return (
    <div>
      <Header />

      {loading ? (
        <p>Loading... </p>
      ) : (
        <>
          <Cards
            income={income}
            expense={expense}
            totalBalance={totalBalance}
            showExpenseModal={showExpenseModal}
            showIncomeModal={showIncomeModal}
            resetData={resetData}
          />
          {transactions.length !== 0 ? (
            <Charts sortedTransactions={sortedTransactions} />
          ) : (
            <NoTransactions />
          )}
          <AddExpenseModal
            isExpenseModalVisible={isExpenseModalVisible}
            handleExpenseCancel={handleExpenseCancel}
            onFinish={onFinish}
          />
          <AddIncomeModal
            isIncomeModalVisible={isIncomeModalVisible}
            handleIncomeCancel={handleIncomeCancel}
            onFinish={onFinish}
          />
          <TransactionsTable
            transactions={transactions}
            addTransaction={addTransaction}
            fetchTransactions={fetchTransactions}
            updateTransaction={updateTransaction}
            deleteTransaction={deleteTransaction}
          />
        </>
      )}
    </div>
  );
}

export default Dashboard;
