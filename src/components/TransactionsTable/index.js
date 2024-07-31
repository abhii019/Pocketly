import React, { useState, useEffect } from 'react';
import { Select, Table, Radio, Button, Input, Modal } from 'antd';
import searchImg from "../../assets/search.svg";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Papa from 'papaparse';

const { Option } = Select;

function TransactionsTable({ transactions, addTransaction, updateTransaction, deleteTransaction, fetchTransactions }) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [sortKey, setSortKey] = useState("");
  const [balance, setBalance] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState(null);

  useEffect(() => {
    calculateBalanceAndExpenses();
  }, [transactions]);

  const calculateBalanceAndExpenses = () => {
    let totalIncome = 0;
    let totalExpenses = 0;

    transactions.forEach((transaction) => {
      const amount = parseFloat(transaction.amount);
      if (!isNaN(amount)) {
        if (transaction.type === 'income') {
          totalIncome += amount;
        } else if (transaction.type === 'expense') {
          totalExpenses += amount;
        }
      }
    });

    setBalance(totalIncome - totalExpenses);
    setExpenses(totalExpenses);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Tag",
      dataIndex: "tag",
      key: "tag",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <>
          <Button onClick={() => handleEdit(record)}>Edit</Button>
          <Button onClick={() => handleDelete(record)} danger>Delete</Button>
        </>
      ),
    },
  ];

  const filteredTransactions = transactions.filter((transaction) => {
    const searchMatch = search
      ? transaction.name && transaction.name.toLowerCase().includes(search.toLowerCase())
      : true;
    const typeMatch = typeFilter ? transaction.type === typeFilter : true;

    return searchMatch && typeMatch;
  });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortKey === "date") {
      return new Date(a.date) - new Date(b.date);
    } else if (sortKey === "amount") {
      return a.amount - b.amount;
    } else {
      return 0;
    }
  });

  function exportCsv() {
    const csv = Papa.unparse(transactions, {
      fields: ["name", "type", "date", "amount", "tag"],
    });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "transactions.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function importFromCsv(event) {
    event.preventDefault();
    try {
      Papa.parse(event.target.files[0], {
        header: true,
        complete: async function (results) {
          const newTransactions = results.data.map(transaction => ({
            ...transaction,
            amount: parseFloat(transaction.amount) || 0
          }));
          
          for (const transaction of newTransactions) {
            await addTransaction(transaction, true);
          }
          toast.success("All Transactions Added");
          fetchTransactions();
        },
      });
    } catch (e) {
      toast.error(e.message);
    }
  }

  const handleEdit = (record) => {
    setCurrentTransaction(record);
    setIsModalVisible(true);
  };

  const handleDelete = (record) => {
    deleteTransaction(record.id);
    fetchTransactions();
  };

  const handleOk = async () => {
    await updateTransaction(currentTransaction);
    fetchTransactions();
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentTransaction({ ...currentTransaction, [name]: value });
  };

  return (
    <div>
      <ToastContainer />
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          gap: "1rem",
          alignItems: "center",
          marginBottom: "1rem",
        }}
        className="input-flex-wrapper"
      >
        <div className="input-flex">
          <img src={searchImg} width="16" alt="search" />
          <input
            placeholder="Search by Name"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select
          className="select-input"
          onChange={(value) => setTypeFilter(value)}
          value={typeFilter}
          placeholder="Filter"
          allowClear
        >
          <Option value="">All</Option>
          <Option value="income">Income</Option>
          <Option value="expense">Expense</Option>
        </Select>
      </div>
      <div className="my-table">
        <div
          style={{
            display: "flex",
            justifyContent :"space-around",
            alignItems: "center",
            width: "100%",
            marginBottom: "1rem",
          }}
        >
          <h2 className="heading" style={{ fontWeight: "", fontFamily: "Monsterat", marginLeft: "0px"}}>My Transactions</h2>
          <Radio.Group
            className="input-radio"
            onChange={(e) => setSortKey(e.target.value)}
            value={sortKey}
          >
            <Radio.Button value="">No Sort</Radio.Button>
            <Radio.Button value="date">Sort by Date</Radio.Button>
            <Radio.Button value="amount">Sort by Amount</Radio.Button>
          </Radio.Group>
          <div className='impexp'
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "1rem",
              width: "400px",
              
            }}
          >
            <button className="btnn" onClick={exportCsv}>
              Export to CSV
            </button>
            <label htmlFor="file-csv" className="btn btn-blue">
              Import from CSV
            </label>
            <input
              id="file-csv"
              type="file"
              accept=".csv"
              required
              style={{ display: "none" }}
              onChange={importFromCsv}
            />
          </div>
        </div>
        <Table
          dataSource={sortedTransactions}
          columns={columns}
          scroll={{ x: true }}
        />
      </div>
      <Modal title="Edit Transaction" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Input
          placeholder="Name"
          name="name"
          value={currentTransaction?.name || ''}
          onChange={handleInputChange}
          style={{ marginBottom: "1rem" }}
        />
        <Select
          placeholder="Type"
          name="type"
          value={currentTransaction?.type || ''}
          onChange={(value) => setCurrentTransaction({ ...currentTransaction, type: value })}
          style={{ marginBottom: "1rem" }}
        >
          <Option value="income">Income</Option>
          <Option value="expense">Expense</Option>
        </Select>
        <Input
          placeholder="Date"
          name="date"
          value={currentTransaction?.date || ''}
          onChange={handleInputChange}
          style={{ marginBottom: "1rem" }}
        />
        <Input
          placeholder="Amount"
          name="amount"
          value={currentTransaction?.amount || ''}
          onChange={handleInputChange}
          style={{ marginBottom: "1rem" }}
        />
        <Input
          placeholder="Tag"
          name="tag"
          value={currentTransaction?.tag || ''}
          onChange={handleInputChange}
          style={{ marginBottom: "1rem" }}
        />
      </Modal>
    </div>
  );
}

export default TransactionsTable;
