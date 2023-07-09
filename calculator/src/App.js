import { useReducer } from "react";
import "./styles.css";
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";

// Standard way of declaring certain titles.
export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  EVALUATE: "evaluate",
  CHOOSE_OPERATION: "choose-operation",
};

// Let me explain the useReducer hook:
// it TAKES two arguments --> A reducer function as defined below and the initial value which is also the state definition.
// it RETURNS two things --> current state and a dispatch function.
// So we have 4 things to talk about - reducer and dispatch function, current state and it's definition.

// reducer --> It is a function which we are supposed to provide to this hook for making updates to the state and provide
// it as a single function to the useReducer hook. The reducer function in this hook must be defined in a way such that it
// receives two JS objects as arguments : current state and [ACTION_TYPE and some other information if need be but as single JS object]. Here it is state and {type, payload} object which contains the type and some other information. It returns in the end.

// dispatch --> It first checks if the state is a simple JS object and then it checks if it is defined or undefined.
// Once CONFIRM IT CALLS THE REDUCER FUNCTION WITH CURRENT STATE AND ACTION TYPE/MORE INFO AND IF A STATE CHANGE IS DETECTED BASED ON THE NEW STATE RETURNED BY THE REDUCER FUNCTION DISPATCH FUNCTION RENDERS THE DOM ELEMENT AGAIN.
// A lot of this is done in the backend which we do not get to know, so it is abstract.

// Current state is the state being sent to reducer function through dispatch function.
// Definition of current state: the number of key-value pairs that you need to use in the program for the information to be managed by useReducer state hook is defined when we set the initial value, it can always be updated ofcourse, but for structure we do so there or we pass an empty JS object.

// useReducer is very similar to useState, but it lets you move the state update logic from event handlers into a single function outside of your component. Read more about choosing between useState and useReducer.

function reducer(state, { type, payload }) {
  // Defining the reducer function for useReducer hook.

  switch (type) {
    // Based on the type received by dispatch function, we can go for the different cases.
    // to render the digits being entered in the input div of calculator, ADD_DIGIT
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        };
      }
      if (payload.digit === "0" && state.currentOperand === "0") return state;
      if (payload.digit === "." && state.currentOperand.includes(".")) return state;

      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      };
    //  To clear the screen return an empty object for a situation just like at the beginning.
    case ACTIONS.CLEAR:
      return {};
    // to calculate based on +,=,/ and x and handling some edge cases.
    case ACTIONS.CHOOSE_OPERATION:
      // If there is nothing to calculate
      if (state.currentOperand == null && state.previousOperand == null) return state;
      //  The second operand has not been entered, and the user pressed an operator key, but now wants to go for a different operand key, so update the operation: paylod.operation value and move ahead.
      if (state.currentOperand == null) return { ...state, operation: payload.operation };

      //  Real beauty of the calculator:
      // This if condition sets the previous operand and makes space for new operand to which this should be added. 20 + was given but it was like - prev = null, curr = 20 and op = +, it transforms it to the new state as prev = 20, curr = null and op = +

      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        };
      }
      //  Send the previousOperand as newly calculated result and operation as the newly selected operand if any otherwise null.
      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null,
      };
    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: null, // Make the current operand null, ie nothing to display
        };
      }
      if (state.currentOperand == null) return state; // return as it is if there is nothing to delete
      if (state.currentOperand.length === 1) {
        return { ...state, currentOperand: null }; // edge case: if only one digit is typed then remove that and return null
      }

      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1), // return everything but the last entered character
      };

    case ACTIONS.EVALUATE:
      //  We can not evaluate if we do not have all 3 information bits.
      if (state.operation == null || state.currentOperand == null || state.previousOperand == null) {
        return state;
      }

      return {
        ...state,
        overwrite: true,

        /* overwrite is set to true here, to overwrite the result displayed after  which the user     would like the new data to be displayed.
          Updated at -> EVALUATE, DELETE_DIGIT AND ADD_DIGIT
          */
        // When evaluated
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state),
      };
    default:
      break;
  }
}

function evaluate({ currentOperand, previousOperand, operation }) {
  /*
JavaScript does not enforce strict parameter matching, which allows you to pass any number of arguments to a function. This flexibility can be useful in certain cases, such as when you want to write functions that can handle a variable number of arguments or when you want to ignore additional arguments intentionally. However, it's important to design your functions with clear expectations and document the expected arguments to avoid confusion and potential bugs.

function addNumbers(a, b) {
  console.log("a:", a);
  console.log("b:", b);
  return a + b;
}

console.log(addNumbers(2, 3));  // Output: a: 2, b: 3
console.log(addNumbers(2, 3, 4));  // Output: a: 2, b: 3


*/

  // converting the strings to floating point literals.
  const prev = parseFloat(previousOperand);
  const curr = parseFloat(currentOperand);

  // if any of the operand is not defined return empty string.
  if (isNaN(prev) || isNaN(curr)) return "";

  let computation = "";

  // Perform the operation and return the result based on the operation value.
  switch (operation) {
    case "+":
      computation = prev + curr;
      break;

    case "-":
      computation = prev - curr;
      break;

    case "*":
      computation = prev * curr;
      break;

    case "÷":
      computation = prev / curr;
      break;

    default:
  }
  return computation;
}

// Google it when needed.
const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", { maximumFractionDigits: 0 });

// Function to split based on the decimal and format only specific part and rejoin and return the formatted part.
function formatOperand(operand) {
  if (operand == null) return;
  const [integer, decimal] = operand.toString().split(".");
  if (decimal == null) return INTEGER_FORMATTER.format(integer);
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
}

function App() {
  // Using the reducer hook
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(reducer, {});

  // dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: 1 } });
  // JSX starts
  return (
    <div className="calculator-grid">
      <div className="output">
        {/* previous-operand will contain the previous number and calculation sign. current-operand will contain the current operand. */}

        {/* Displaying the formatted operand */}
        <div className="previous-operand">
          {formatOperand(previousOperand)} {operation}
        </div>
        <div className="current-operand">{formatOperand(currentOperand)}</div>
      </div>

      {/* Associating the dispatch function of useReducer hook instead of so many onClickHandler functions we can use the type: attribute in the useReducer to call the same reduce function which will have conditional reducing based on the value that we associate it with in type: attribute.  */}
      <button className="span-two" onClick={() => dispatch({ type: ACTIONS.CLEAR })}>
        AC
      </button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>DEL</button>
      {/* <DigitButton digit = "÷" dispatch = {dispatch}/> */}

      {/* So one interesting thing that you would see here is:
      
      The components have a prop called dispatch which will be used in onClick function of the JSX that they contain. This dispatch prop will contain the dispatch function of the reducer hook itself. Then in the component file, we will specify the type: attribute of the call.

      While the usual buttons being specified here are simple buttons which have the dispatch function mentioned directly with type: attribute.   
      
       */}
      <OperationButton operation="÷" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />

      <OperationButton operation="*" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />

      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />

      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button className="span-two" onClick={() => dispatch({ type: ACTIONS.EVALUATE })}>
        =
      </button>
      <div className="footer">
        Made with React by <a href="https://github.com/saketbyte">Samriddh Singh</a>
      </div>
    </div>
  );
}

export default App;
