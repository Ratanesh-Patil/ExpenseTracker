import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const [expense, setExpense] = useState({ transaction: "", amount: "" });
  const [expenselist, setExpenseList] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    GetExpenseList();
  }, []);

  useEffect(() => {
    calculateTotals();
  }, [expenselist]);

  const GetExpenseList = () => {
    const savedExpenses = localStorage.getItem("expense");
    if (savedExpenses) {
      try {
        const parsedExpenses = JSON.parse(savedExpenses);
        setExpenseList(parsedExpenses);
      } catch (error) {
        console.error("Error parsing expense list from localStorage:", error);
        setExpenseList([]);
      }
    }
  };

  const calculateTotals = () => {
    let income = 0;
    let expenses = 0;

    expenselist.forEach((exp) => {
      const amount = parseFloat(exp.amount);
      if (!isNaN(amount)) {
        if (amount > 0) {
          income += amount;
        } else {
          expenses += Math.abs(amount);
        }
      }
    });

    setTotalIncome(income);
    setTotalExpenses(expenses);
    setBalance(income - expenses);
  };

  const handleSubmit = () => {
    const updatedExpenseList = [...expenselist, expense];
    setExpenseList(updatedExpenseList);
    localStorage.setItem("expense", JSON.stringify(updatedExpenseList));
    setExpense({ transaction: "", amount: "" }); // Reset the input fields after submitting
  };

  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
          <h1 className="text-center text-3xl font-bold mb-6 text-gray-800">
            Expense Tracker
          </h1>
          <div className="flex justify-between items-center p-4 border-2 border-gray-300 rounded-lg mb-6">
            <div className="text-lg text-gray-600">Your Balance</div>
            <div className="text-2xl font-bold text-gray-800">${balance.toFixed(2)}</div>
          </div>
          <div className="flex justify-between mb-6">
            <div className="flex flex-col items-center w-1/2 p-4 border-2 border-gray-300 rounded-lg mr-2">
              <div className="text-lg text-gray-600">Income</div>
              <div className="text-2xl font-bold text-green-600">${totalIncome.toFixed(2)}</div>
            </div>
            <div className="flex flex-col items-center w-1/2 p-4 border-2 border-gray-300 rounded-lg ml-2">
              <div className="text-lg text-gray-600">Expense</div>
              <div className="text-2xl font-bold text-red-600">${totalExpenses.toFixed(2)}</div>
            </div>
          </div>
          <h2 className="text-center text-2xl font-bold mb-4 text-gray-800">
            History
          </h2>
          <div className="overflow-auto h-[200px]">
          {expenselist.map((exp, index) => (
            <div key={index} className="flex justify-between p-4 border-b border-gray-300 ">
              <div className="text-gray-800">{exp.transaction}</div>
              <div className={`font-bold ${exp.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {exp.amount > 0 ? `+${exp.amount}` : exp.amount}
              </div>
            </div>
          ))}
          </div>
          <hr className="mb-6" />
          <div>
            <h6 className="text-center text-xl font-bold mb-4 text-gray-800">
              Add New Transaction
            </h6>
            <div className="flex flex-col space-y-4">
              <label className="w-full text-left text-gray-600">
                Transaction Details
              </label>
              <input
                className="w-full h-12 p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                type="text"
                name="transaction"
                value={expense.transaction}
                placeholder="Enter Transaction Details"
                onChange={(e) =>
                  setExpense((prevExpense) => ({
                    ...prevExpense,
                    [e.target.name]: e.target.value,
                  }))
                }
              />
              <label className="w-full text-left text-gray-600">
                Transaction Amount
              </label>
              <input
                className="w-full h-12 p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                type="text"
                name="amount"
                value={expense.amount}
                placeholder="Enter Transaction Amount"
                onChange={(e) =>
                  setExpense((prevExpense) => ({
                    ...prevExpense,
                    [e.target.name]: e.target.value,
                  }))
                }
              />
              <button
                onClick={handleSubmit}
                className="w-full h-12 p-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition duration-300"
              >
                Add Transaction
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
