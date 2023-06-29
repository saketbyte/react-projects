import React, { useState } from "react";
import "./ExpenseForm.css";

const ExpenseForm = (props) => {
  const [enteredTitle, setEnteredTitle] = useState("");
  const [enteredAmount, setEnteredAmount] = useState("");
  const [enteredDate, setEnteredDate] = useState("");

  // Method 2:
  //   const [userInput, setUserInput] = useState({
  //     enteredTitle: "",
  //     enteredAmount: "",
  //     enteredDate: "",
  //   });
  //   We need to update all three properties when we define as above.

  const titleChangeHandler = (event) => {
    setEnteredTitle(event.target.value);

    // console.log(props);
    // We need to update enteredAmount and enteredDate keys as well, to avoid dropping other keys.

    // Method 2:
    // setUserInput({
    //   ...userInput, // using previous values of the
    //   enteredTitle: event.target.value, // OverWrites key value pairs.

    // enteredAmount: '',
    // enteredDate:''
    // });
    // found this event.target.value from developer console in chrome.
  };

  const amountChangeHandler = (event) => {
    setEnteredAmount(event.target.value);
    // Method 2:
    //     setUserInput({ ...userInput, enteredAmount: event.target.value });
  };

  const dateChangeHandler = (event) => {
    setEnteredDate(event.target.value);
    // Method 2:
    //     setUserInput({ ...userInput, enteredDate: event.target.value });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    //  tp prevent the default behaviour of code, which is to reload the page and send a POST request by form submission.

    const expenseData = {
      title: enteredTitle,
      amount: +enteredAmount,
      date: new Date(enteredDate),
    };

    // console.log(expenseData);
    props.onSaveExpenseData(expenseData);
    // Here in above line, we passed data from Expense form to the parent component the NewExpense component.
    setEnteredTitle("");
    setEnteredDate("");
    setEnteredAmount("");
  };

  return (
    <form onSubmit={submitHandler}>
      <div className="new-expense__controls">
        <div className="new-expense__control">
          {/* Title, Amount, Date and then a Button */}
          <label>Title</label>
          <input type="text" value={enteredTitle} onChange={titleChangeHandler} />
        </div>

        <div className="new-expense__control">
          <label>Amount</label>
          <input type="number" value={enteredAmount} min="0.01" step="0.01" onChange={amountChangeHandler} />
        </div>

        <div className="new-expense__control">
          <label>Date</label>
          <input type="date" value={enteredDate} min="2019-01-01" max="2025-01-01" onChange={dateChangeHandler} />
        </div>
      </div>

      <div className="new-expense__actions">
        <button type="submit"> Add Expense </button>
      </div>
    </form>
  );
};

export default ExpenseForm;
