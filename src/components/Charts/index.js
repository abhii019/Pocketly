import React from 'react';
import { Line, Pie } from '@ant-design/charts';

function Charts({ sortedTransactions }) {
  // Prepare data for Line chart
  const lineData = sortedTransactions.map((item) => ({
    date: item.date,
    amount: item.amount,
  }));

  // Prepare data for Pie chart
  const spendingData = sortedTransactions.filter((transaction) => transaction.type === "expense");

  // Calculate total spending per tag for Pie chart
  const tagAmounts = spendingData.reduce((acc, transaction) => {
    const { tag, amount } = transaction;
    acc[tag] = acc[tag] ? acc[tag] + amount : amount;
    return acc;
  }, {});

  // Format data for Pie chart
  const pieData = Object.keys(tagAmounts).map((tag) => ({
    tag,
    amount: tagAmounts[tag],
  }));

  // Configurations for Line chart
  const lineConfig = {
    data: lineData,
    width: 500,
    height: 400,
    autofit: true,
    xField: 'date',
    yField: 'amount',
  };

  // Configurations for Pie chart
  const pieConfig = {
    data: pieData,
    width: 500,
    height: 400,
    autofit: true,
    angleField: 'amount',
    colorField: 'tag',
  };

  return (
    <div className='charts-wrapper'>
      <div>
        <h2>Your Analytics</h2>
        <Line {...lineConfig} />
      </div>
      <div>
        <h2>Your Spendings</h2>
        <Pie {...pieConfig} />
      </div>
    </div>
  );
}

export default Charts;
