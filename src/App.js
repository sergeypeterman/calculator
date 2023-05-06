import React, { useState } from "react";
import "./index.css";

function Calculator() {
  //result = arg[i] <operator[i]> arr[i+1]
  // arg[i] = (0 <modificator> parseFloat(current))
  /*div div = div modificator=1/-1
    div mult = mult modificator=1/-1
    div add = div modificator=1
    add add = add modificator=1
    add sub = minus modificator=-1
    sub add = minus modificator=1*/

  const [result, setResult] = useState(0);
  const [arg, setArg] = useState([]); // array for storing arguments
  const [current, setCurrent] = useState([0]); // array to read from input
  const [operator, setOperator] = useState([]); // array for operands to use on arguments
  const [modificator, setModificator] = useState(0); // -1/0/1 for arguments, 1: positive, -1: negative, 0: n\a (eg number is being entered)
  const [eq, setEq] = useState(0); // not pressed: 0; equals is pressed: 1; processed: 2

  ///////////////////////////////////////////////
  const OPERATORS = ["divide", "mult", "add", "sub"];
  const EQ_IDLE = 0;
  const EQ_PRESSED = 1;
  const EQ_PROCESSED = 2;

  ///////////////////////////////////////////////   ///////////////////////////////////////////////
  const resetCalc = () => {
    ////args to keep not resetted?
    setEq(EQ_IDLE);
    setCurrent([0]);
    setArg([]);
    setOperator([]);
    setModificator(0);
  };

  ///////////////////////////////////////////////
  const buttonClick = (value) => {
    //console.log(`from buttonClick start, value: ${value}`)

    if (typeof value === "number") {
      /////////////////////////////////////////if number is pressed

      setModificator(0); //number is being entered
      if (eq === EQ_PROCESSED) {
        //if number is being entered after = then reset all
        resetCalc();
      }

      let digits = [...current];

      if (digits[0] === 0) {
        digits.shift(); //remove leading zero
      } else if (digits[0] === "-") {
        if (digits[1] === 0) {
          digits.splice(1, 1); //remove leading zero after '-'
        }
      }
      digits.push(value);
      //console.log(`buttonClick()->number value: ${value}, digits: ${digits}`);
      setCurrent(digits);
    } else if (value === ".") {
      ///////////////////////////////////////////////// decimal separator
      if (eq !== EQ_PROCESSED) {
        let dot = [...current];
        current.indexOf(value) < 0 && dot.push(".");
        setCurrent(dot);
      }
    } else if (OPERATORS.includes(value)) {
      /////////////////////////////////////////////////////operator /-*+ is  pressed
      //console.log(`buttonClick()-> else if(OPERATORS.includes -> eq: ${eq}`);
      let num = [...arg];
      let newOperator = [...operator];
      let rst = result;

      if (eq === EQ_PROCESSED) {
        //if operator is being entered after = then continue

        num.splice(0);
        newOperator.splice(0);
        num.push(rst);
        newOperator.push(value);
        setEq(EQ_IDLE);
        setCurrent([0]);
        setArg(num);
        setOperator(newOperator);
        console.log(
          `buttonClick()-> else if(OPERATORS.includes -> after = num: ${num}, rst=${rst}, operatros: ${newOperator}`
        );
        return;
      }

      if (modificator === 0) {
        //operator is pressed first time -> add operator to array, add current to arg array
        num.push(transformToNum(current));
        newOperator.push(value);
        setCurrent([0]);
        setArg(num);
        setOperator(newOperator);

        setModificator(1);
        //console.log(num, newOperator, `mod:${modificator}`);
      } else {
        //operator is pressed second or more time
        if (value === "sub" && modificator === 1) {
          setModificator(-1); //will be translated to negative
          current.unshift("-");
        } else if (value === "sub" && modificator === -1) {
          setModificator(1); //will be translated to positive
          current.shift();
        } else {
          if (modificator === -1) {
            setModificator(1);
            current.shift();
          }

          console.log(
            "operator discarded: " +
              newOperator.pop() +
              ", new operator:" +
              value
          );
          newOperator.push(value);
          setOperator(newOperator);
        }
      }
    } else if (value === "equal") {
      /////////////////////////////////////////////// equal pressed

      if (eq === EQ_PROCESSED) {
        console.log(`buttonClick() -> value === 'equal' -> already processed`);
      } else {
        setEq(EQ_PRESSED);
        let num = [...arg];
        let newOperator = [...operator];

        num.push(transformToNum(current));
        newOperator.push(value);
        setArg(num);
        setOperator(newOperator);
        console.log(`from buttonClick(), value: ${value}, num: ${num}`);
        resultValue();
        console.log(`from buttonClick(), value: ${value}, num: ${num}`);
      }
    } else if (value === "reset") {
      /////////////////////////////////////////////// reset pressed
      resetCalc();
    }
    // console.log(`from buttonClick end, value: ${value}`)
  };

  ///////////////////////////////////////////////
  const transformToNum = (input = []) => {
    return parseFloat(input.join(""));
  };

  ///////////////////////////////////////////////
  const getFormula = () => {
    let formula = [];
    let mods = [...operator];

    mods = mods.map((elem) => {
      switch (elem) {
        case OPERATORS[0]:
          return " / ";
        case OPERATORS[1]:
          return " * ";
        case OPERATORS[2]:
          return " + ";
        case OPERATORS[3]:
          return " - ";
        case "equal":
          return " = ";

        default:
          return "undef";
      }
    });

    for (let i = 0; i < arg.length; i++) {
      formula.push(arg[i]);
      i < mods.length && formula.push(mods[i]);
    }

    return formula;
  };

  ///////////////////////////////////////////////
  const doCalc = () => {
    let calcResult = 0;

    calcResult = arg[0];
    for (let i = 1; i < arg.length; i++) {
      switch (operator[i - 1]) {
        case OPERATORS[0]: //  /
          console.log("doCalc() " + calcResult + "/" + arg[i]);
          calcResult /= arg[i];

          break;
        case OPERATORS[1]: // *
          console.log("doCalc() " + calcResult + "*" + arg[i]);
          calcResult *= arg[i];

          break;
        case OPERATORS[2]: // +
          console.log("doCalc() " + calcResult + "+" + arg[i]);
          calcResult += arg[i];

          break;
        case OPERATORS[3]: // -
          console.log("doCalc() " + calcResult + "-" + arg[i]);
          calcResult -= arg[i];

          break;
        default:
          break;
      }
    }

    return calcResult;
  };

  ///////////////////////////////////////////////
  const resultValue = () => {
    if (eq === EQ_PRESSED) {
      let res = result;

      res = doCalc();

      setResult(res);

      setCurrent([0]);
      console.log(`resultValue(): result: ${result}, res: ${res}, eq: ${eq}`);
      setEq(EQ_PROCESSED);
      return res;
    } else if (eq === EQ_IDLE) {
      return current.join("");
    }
    return result;
  };

  ///////////////////////////////////////////////    ///////////////////////////////////////////////

  return (
    <div id="calculator">
      <div id="screen">
        <p id="memory">{getFormula()}</p>
        <p id="display">{resultValue()}</p>
      </div>
      <div id="pad">
        <button
          id="clear"
          className="hor"
          onClick={(event) => buttonClick("reset")}
        >
          AC
        </button>
        <button
          id="divide"
          className="operator"
          onClick={(event) => buttonClick("divide")}
        >
          /
        </button>
        <button
          id="multiply"
          className="operator"
          onClick={(event) => buttonClick("mult")}
        >
          X
        </button>
        <button id="seven" className="num" onClick={(event) => buttonClick(7)}>
          7
        </button>
        <button id="eight" className="num" onClick={(event) => buttonClick(8)}>
          8
        </button>
        <button id="nine" className="num" onClick={(event) => buttonClick(9)}>
          9
        </button>
        <button
          id="subtract"
          className="operator"
          onClick={(event) => buttonClick("sub")}
        >
          -
        </button>
        <button id="four" className="num" onClick={(event) => buttonClick(4)}>
          4
        </button>
        <button id="five" className="num" onClick={(event) => buttonClick(5)}>
          5
        </button>
        <button id="six" className="num" onClick={(event) => buttonClick(6)}>
          6
        </button>
        <button
          id="add"
          className="operator"
          onClick={(event) => buttonClick("add")}
        >
          +
        </button>
        <button id="one" className="num" onClick={(event) => buttonClick(1)}>
          1
        </button>
        <button id="two" className="num" onClick={(event) => buttonClick(2)}>
          2
        </button>
        <button id="three" className="num" onClick={(event) => buttonClick(3)}>
          3
        </button>
        <button
          id="equals"
          className="ver"
          onClick={(event) => buttonClick("equal")}
        >
          =
        </button>
        <button
          id="zero"
          className="hor num"
          onClick={(event) => buttonClick(0)}
        >
          0
        </button>
        <button
          id="decimal"
          className="num hor"
          onClick={(event) => buttonClick(".")}
        >
          .
        </button>
      </div>
    </div>
  );
}

export default Calculator;
