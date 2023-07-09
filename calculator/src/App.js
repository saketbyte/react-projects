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
    //
    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previousOperand == null) return state;

      if (state.currentOperand == null) return { ...state, operation: payload.operation };

      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        };
      }

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
          currentOperand: null,
        };
      }
      if (state.currentOperand == null) return state;
      if (state.currentOperand.length === 1) {
        return { ...state, currentOperand: null };
      }

      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      };

    case ACTIONS.EVALUATE:
      if (state.operation == null || state.currentOperand == null || state.previousOperand == null) {
        return state;
      }

      return {
        ...state,
        overwrite: true, // overwrite is set to true here, to overwrite the result displayed after
        // which the user would like the new data to be displayed.
        //  Updated at -> EVALUATE, DELETE_DIGIT AND ADD_DIGIT
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state),
      };
    default:
      break;
  }
}

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
function evaluate({ currentOperand, previousOperand, operation }) {
  const prev = parseFloat(previousOperand);
  const curr = parseFloat(currentOperand);

  if (isNaN(prev) || isNaN(curr)) return "";

  let computation = "";

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

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", { maximumFractionDigits: 0 });

function formatOperand(operand) {
  if (operand == null) return;
  const [integer, decimal] = operand.toString().split(".");
  if (decimal == null) return INTEGER_FORMATTER.format(integer);
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
}

function App() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(reducer, {});

  // dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: 1 } });
  return (
    <div className="calculator-grid">
      <div className="output">
        {/* previous-operand will contain the previous number and calculation sign. current-operand will contain the current operand. */}
        <div className="previous-operand">
          {formatOperand(previousOperand)} {operation}
        </div>
        <div className="current-operand">{formatOperand(currentOperand)}</div>
      </div>

      <button className="span-two" onClick={() => dispatch({ type: ACTIONS.CLEAR })}>
        AC
      </button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>DEL</button>
      {/* <DigitButton digit = "÷" dispatch = {dispatch}/> */}
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
