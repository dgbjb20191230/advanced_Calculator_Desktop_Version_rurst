import { useState } from "react";
import "./App.css";

function App() {
  const [display, setDisplay] = useState<string>("0");
  const [memory, setMemory] = useState<number>(0);
  const [history, setHistory] = useState<string[]>([]);
  const [angleMode, setAngleMode] = useState<string>("弧度制");
  const [newNumberStarted, setNewNumberStarted] = useState<boolean>(false);
  const [lastOperationWasEquals, setLastOperationWasEquals] = useState<boolean>(false);
  const [lastValue, setLastValue] = useState<number | null>(null);
  const [lastOperator, setLastOperator] = useState<string | null>(null);
  const [lastInput, setLastInput] = useState<number | null>(null); // 用于实现重复等号操作

  // Memory functions
  const handleMemoryClear = () => setMemory(0);
  const handleMemoryRecall = () => {
    setDisplay(memory.toString());
    setNewNumberStarted(true);
  };
  const handleMemoryStore = () => setMemory(parseFloat(display));
  const handleMemoryPlus = () => {
    try {
      const currentValue = parseFloat(display);
      if (isNaN(currentValue)) return;
      setMemory(memory + currentValue);
    } catch (error) {
      console.error("内存加法错误:", error);
    }
  };
  const handleMemoryMinus = () => {
    try {
      const currentValue = parseFloat(display);
      if (isNaN(currentValue)) return;
      setMemory(memory - currentValue);
    } catch (error) {
      console.error("内存减法错误:", error);
    }
  };

  // Number input
  const handleNumberInput = (num: string) => {
    if (display === "Error") {
      setDisplay(num);
    } else if (display === "0" || newNumberStarted || lastOperationWasEquals) {
      setDisplay(num);
      setNewNumberStarted(false);
      setLastOperationWasEquals(false);
    } else {
      // 限制输入长度，防止溢出
      if (display.length < 16) {
        setDisplay(display + num);
      }
    }
  };

  // Decimal point
  const handleDecimalPoint = () => {
    if (display === "Error") {
      setDisplay("0.");
    } else if (newNumberStarted || lastOperationWasEquals) {
      setDisplay("0.");
      setNewNumberStarted(false);
      setLastOperationWasEquals(false);
    } else if (!display.includes(".")) {
      setDisplay(display + ".");
    }
  };

  // Clear functions
  const handleClear = () => {
    setDisplay("0");
    setNewNumberStarted(false);
    setLastOperationWasEquals(false);
    setLastValue(null);
    setLastOperator(null);
    setLastInput(null);
  };

  const handleClearEntry = () => {
    setDisplay("0");
    setNewNumberStarted(false);
  };

  // Toggle angle mode
  const handleAngleMode = () => {
    setAngleMode(angleMode === "弧度制" ? "角度制" : "弧度制");
  };

  // Calculate result based on operation
  const calculateResult = (a: number, b: number, op: string): number => {
    switch (op) {
      case "+":
        return a + b;
      case "-":
        return a - b;
      case "×":
        return a * b;
      case "÷":
        if (b === 0) return NaN; // 处理除以零
        return a / b;
      case "^":
        return Math.pow(a, b);
      default:
        return b;
    }
  };

  // Format display value to prevent scientific notation and long decimals
  const formatDisplayValue = (value: number): string => {
    if (!isFinite(value) || isNaN(value)) return "Error";
    
    // 直接使用精确的字符串表示法
    const strValue = value.toString();
    
    // 如果数字太大或太小，避免科学记数法显示
    if (Math.abs(value) >= 1e16 || (Math.abs(value) < 1e-7 && value !== 0)) {
      // 格式化为固定小数位数
      return value.toFixed(8).replace(/\.?0+$/, '');
    }
    
    // 如果是整数，直接返回
    if (Number.isInteger(value)) return strValue;
    
    // 限制小数位数最多为10位
    if (strValue.includes('.') && strValue.split('.')[1].length > 10) {
      return value.toFixed(10).replace(/\.?0+$/, '');
    }
    
    return strValue;
  };

  // Basic operations
  const handleBasicOperation = (op: string) => {
    try {
      if (display === "Error") {
        return;
      }
      
      const currentValue = parseFloat(display);
      
      if (isNaN(currentValue)) {
        setDisplay("Error");
        return;
      }
      
      if (lastOperationWasEquals || lastValue === null) {
        // 如果上一次是等号操作或者没有前一个值，直接保存当前值
        setLastValue(currentValue);
        setLastOperator(op);
      } else {
        // 否则计算结果
        const result = calculateResult(lastValue, currentValue, lastOperator!);
        
        if (isNaN(result) || !isFinite(result)) {
          setDisplay("Error");
          return;
        }
        
        setDisplay(formatDisplayValue(result));
        setLastValue(result);
        setLastOperator(op);
      }
      
      setNewNumberStarted(true);
      setLastOperationWasEquals(false);
    } catch (error) {
      setDisplay("Error");
      console.error("计算错误:", error);
    }
  };

  // Equals operation
  const handleEquals = () => {
    try {
      if (display === "Error") {
        return;
      }
      
      const currentValue = parseFloat(display);
      
      if (isNaN(currentValue)) {
        setDisplay("Error");
        return;
      }
      
      // 重复等号操作 - 使用上一个操作符和最后输入的值
      if (lastOperationWasEquals && lastOperator && lastInput !== null) {
        const result = calculateResult(parseFloat(display), lastInput, lastOperator);
        
        if (isNaN(result) || !isFinite(result)) {
          setDisplay("Error");
          return;
        }
        
        // 添加到历史记录
        const calculationText = `${display} ${lastOperator} ${lastInput} = ${formatDisplayValue(result)}`;
        setHistory(prev => {
          const newHistory = [...prev, calculationText];
          // 限制历史记录数量为最新的10条
          return newHistory.slice(-10);
        });
        
        setDisplay(formatDisplayValue(result));
        setNewNumberStarted(true);
        // 不改变 lastOperationWasEquals 状态
      }
      // 正常等号操作 - 需要上一个值和操作符
      else if (lastValue !== null && lastOperator !== null) {
        const result = calculateResult(lastValue, currentValue, lastOperator);
        
        if (isNaN(result) || !isFinite(result)) {
          setDisplay("Error");
          return;
        }
        
        // 添加到历史记录
        const calculationText = `${lastValue} ${lastOperator} ${currentValue} = ${formatDisplayValue(result)}`;
        setHistory(prev => {
          const newHistory = [...prev, calculationText];
          // 限制历史记录数量为最新的10条
          return newHistory.slice(-10);
        });
        
        setDisplay(formatDisplayValue(result));
        setLastInput(currentValue); // 保存最后输入的值用于重复操作
        setLastOperationWasEquals(true);
        setNewNumberStarted(true);
      }
    } catch (error) {
      setDisplay("Error");
      console.error("计算错误:", error);
    }
  };

  // Percentage operation
  const handlePercentage = () => {
    try {
      if (display === "Error") {
        return;
      }
      
      const currentValue = parseFloat(display);
      if (isNaN(currentValue)) {
        setDisplay("Error");
        return;
      }
      
      const value = currentValue / 100;
      setDisplay(formatDisplayValue(value));
    } catch (error) {
      setDisplay("Error");
      console.error("百分比错误:", error);
    }
  };

  // Toggle positive/negative
  const handlePlusMinus = () => {
    try {
      if (display === "Error" || display === "0") {
        return;
      }
      
      const currentValue = parseFloat(display);
      if (isNaN(currentValue)) {
        setDisplay("Error");
        return;
      }
      
      setDisplay(formatDisplayValue(currentValue * -1));
    } catch (error) {
      setDisplay("Error");
      console.error("正负号切换错误:", error);
    }
  };

  // Scientific operations
  const handleScientific = (op: string) => {
    try {
      if (display === "Error") {
        return;
      }
      
      const currentValue = parseFloat(display);
      
      if (isNaN(currentValue)) {
        setDisplay("Error");
        return;
      }
      
      let result: number;
      
      switch(op) {
        case "sqrt":
          if (currentValue < 0) {
            setDisplay("Error");
            return;
          }
          result = Math.sqrt(currentValue);
          break;
        case "abs":
          result = Math.abs(currentValue);
          break;
        case "pow":
          // x^y operation
          setLastValue(currentValue);
          setLastOperator("^");
          setNewNumberStarted(true);
          return;
        case "pow2":
          result = Math.pow(currentValue, 2);
          break;
        case "pow3":
          result = Math.pow(currentValue, 3);
          break;
        case "inv":
          if (currentValue === 0) {
            setDisplay("Error");
            return;
          }
          result = 1 / currentValue;
          break;
        case "fact":
          if (currentValue < 0 || !Number.isInteger(currentValue)) {
            setDisplay("Error");
            return;
          }
          result = factorial(currentValue);
          break;
        case "sin":
          result = angleMode === "弧度制" ? 
            Math.sin(currentValue) : 
            Math.sin(currentValue * Math.PI / 180);
          break;
        case "cos":
          result = angleMode === "弧度制" ? 
            Math.cos(currentValue) : 
            Math.cos(currentValue * Math.PI / 180);
          break;
        case "tan":
          const tanAngle = angleMode === "弧度制" ? 
            currentValue : 
            currentValue * Math.PI / 180;
          // 检查无效的 tan 值 (90°, 270° 等)
          if (Math.abs(Math.cos(tanAngle)) < 1e-10) {
            setDisplay("Error");
            return;
          }
          result = Math.tan(tanAngle);
          break;
        case "log":
          if (currentValue <= 0) {
            setDisplay("Error");
            return;
          }
          result = Math.log10(currentValue);
          break;
        case "ln":
          if (currentValue <= 0) {
            setDisplay("Error");
            return;
          }
          result = Math.log(currentValue);
          break;
        case "exp":
          result = Math.exp(currentValue);
          break;
        default:
          return;
      }
      
      if (isNaN(result) || !isFinite(result)) {
        setDisplay("Error");
        return;
      }
      
      setDisplay(formatDisplayValue(result));
      setNewNumberStarted(true);
    } catch (error) {
      setDisplay("Error");
      console.error("科学计算错误:", error);
    }
  };

  // Factorial calculation
  const factorial = (n: number): number => {
    if (n === 0 || n === 1) return 1;
    if (n < 0 || !Number.isInteger(n) || n > 170) return NaN;
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
      if (!isFinite(result)) return Infinity;
    }
    return result;
  };

  // Double zero input
  const handleDoubleZero = () => {
    if (display === "Error") {
      setDisplay("0");
    } else if (display === "0" || newNumberStarted) {
      setDisplay("0");
    } else if (display.length < 15) {
      setDisplay(display + "00");
    }
    setNewNumberStarted(false);
    setLastOperationWasEquals(false);
  };

  // Triple zero input
  const handleTripleZero = () => {
    if (display === "Error") {
      setDisplay("0");
    } else if (display === "0" || newNumberStarted) {
      setDisplay("0");
    } else if (display.length < 14) {
      setDisplay(display + "000");
    }
    setNewNumberStarted(false);
    setLastOperationWasEquals(false);
  };

  return (
    <div className="calculator">
      <h1 className="title">高级计算器</h1>
      
      <div className="display-container">
        <div className="display">{display}</div>
      </div>
      
      <div className="mode-selector">
        <button onClick={handleAngleMode}>{angleMode}</button>
      </div>
      
      <div className="history-container">
        <div className="history-label">历史记录</div>
        <div className="history-list">
          {history.map((item, index) => (
            <div key={index} className="history-item">{item}</div>
          ))}
        </div>
      </div>
      
      {/* 内存功能按钮行 */}
      <div className="memory-row">
        <button className="memory-btn" onClick={handleMemoryClear}>MC</button>
        <button className="memory-btn" onClick={handleMemoryRecall}>MR</button>
        <button className="memory-btn" onClick={handleMemoryStore}>MS</button>
        <button className="memory-btn" onClick={handleMemoryPlus}>M+</button>
        <button className="memory-btn" onClick={handleMemoryMinus}>M-</button>
      </div>
      
      {/* 科学计算按钮第一行 */}
      <div className="science-row">
        <button className="scientific-btn" onClick={() => handleScientific("sqrt")}>√</button>
        <button className="scientific-btn" onClick={() => handleScientific("abs")}>|x|</button>
        <button className="scientific-btn" onClick={() => handleScientific("pow")}>x^y</button>
        <button className="scientific-btn" onClick={() => handleScientific("fact")}>n!</button>
        <button className="scientific-btn" onClick={() => handleScientific("pow2")}>x²</button>
      </div>
      
      {/* 科学计算按钮第二行 */}
      <div className="science-row">
        <button className="scientific-btn" onClick={() => handleScientific("sin")}>sin</button>
        <button className="scientific-btn" onClick={() => handleScientific("cos")}>cos</button>
        <button className="scientific-btn" onClick={() => handleScientific("tan")}>tan</button>
        <button className="scientific-btn" onClick={() => handleScientific("log")}>log</button>
        <button className="scientific-btn" onClick={() => handleScientific("ln")}>ln</button>
      </div>
      
      {/* 主数字键盘和函数键 */}
      <div className="buttons-grid">
        {/* 第一行 */}
        <button className="function-btn" onClick={() => handleScientific("inv")}>1/x</button>
        <button className="function-btn" onClick={() => handleScientific("exp")}>e^x</button>
        <button className="function-btn" onClick={handlePlusMinus}>+/-</button>
        <button className="function-btn" onClick={handlePercentage}>%</button>
        <button className="clear-btn" onClick={handleClear}>AC</button>
        
        {/* 第二行 */}
        <button className="number-btn" onClick={() => handleNumberInput("7")}>7</button>
        <button className="number-btn" onClick={() => handleNumberInput("8")}>8</button>
        <button className="number-btn" onClick={() => handleNumberInput("9")}>9</button>
        <button className="operation-btn" onClick={() => handleBasicOperation("÷")}>÷</button>
        <button className="clear-btn" onClick={handleClearEntry}>CE</button>
        
        {/* 第三行 */}
        <button className="number-btn" onClick={() => handleNumberInput("4")}>4</button>
        <button className="number-btn" onClick={() => handleNumberInput("5")}>5</button>
        <button className="number-btn" onClick={() => handleNumberInput("6")}>6</button>
        <button className="operation-btn" onClick={() => handleBasicOperation("×")}>×</button>
        <button className="number-btn" onClick={() => handleNumberInput("0")}>0</button>
        
        {/* 第四行 */}
        <button className="number-btn" onClick={() => handleNumberInput("1")}>1</button>
        <button className="number-btn" onClick={() => handleNumberInput("2")}>2</button>
        <button className="number-btn" onClick={() => handleNumberInput("3")}>3</button>
        <button className="operation-btn" onClick={() => handleBasicOperation("-")}>-</button>
        <button className="number-btn" onClick={handleDecimalPoint}>.</button>
        
        {/* 第五行 - 重新布局，让等号按钮变宽 */}
        <button className="number-btn" onClick={handleDoubleZero}>00</button>
        <button className="number-btn" onClick={handleTripleZero}>000</button>
        <button className="operation-btn" onClick={() => handleBasicOperation("+")}>+</button>
        <button className="equals-btn" onClick={handleEquals}>=</button>
      </div>
      
      <div className="footer">
        © 2025 高级计算器应用
      </div>
    </div>
  );
}

export default App;
