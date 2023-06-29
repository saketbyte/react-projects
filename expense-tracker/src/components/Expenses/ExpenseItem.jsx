import React, { useState } from "react";
// useState allows us to defined changes in values as different states.

import "./ExpenseItem.css";
import Card from "../UI/Card";

import ExpenseDate from "./ExpenseDate";

// we have to do things inside our component function.
// useState is a React hook. They start with the word "use" in their name, and must be called inside the function.
// Not in a nested functino, directly inside, with one exception.
// useState requires a default state value.
//  It requires us to give it an initial value which is used in case no update occurs.
// it returns an array which has two elements --> access to the special variable which is different in different states, and it also returns a function which we can call to assign new values o the same variable.

const ExpenseItem = (props) => {
  const [title, setTitle] = useState(props.title); //array destructuring.

  // This is an event handling function. The event name starts with a capital letter. You should end with handler if you are creating an event handler.
  const clickHandler = () => {
    setTitle("new value for the const title!");
    // console.log(title); <- called as many times as the custom component is used to instatiate an object on screen.  But only once if useState is used for per-component-instance-basis.

    // When the state changes, it will also call the custom function again to re-render.
    // The very specific component, and not all of them as well!!! <3 Wowweee!It is managed by react for each component individually. Each component has a different instance, separate state for each component.

    // It schedules the updated value. And not immediately changes in console log.
  };

  return (
    <li>
      <Card className="expense-item">
        <ExpenseDate date={props.date} />
        {/* when a component does not have any content in between the tags we can write it in above way */}

        <div className="expense-item__description">
          <h2>{title}</h2>
          <div className="expense-item__price">${props.amount}</div>
        </div>
        {/* dont add paranthesis here. */}
        <button onClick={clickHandler}>Change Title</button>
      </Card>
    </li>
  );
};

export default ExpenseItem;
