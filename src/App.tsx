import { useState, useEffect } from "react";
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
  const [message, setMessage] = useState<string | null>(null); // 用于显示操作提示消息
  const [showHistory, setShowHistory] = useState<boolean>(false); // 控制历史记录弹窗显示

  // Effect for component cleanup
  useEffect(() => {
    return () => {
      // 清理所有可能的计时器
      const timers = window.setTimeout(() => {}, 0);
      for (let i = 0; i < timers; i++) {
        window.clearTimeout(i);
      }
    };
  }, []);

  // Memory functions
  const handleMemoryClear = () => {
    setMemory(0);
    setMessage("内存清除：已清除全部内存");
    setTimeout(() => setMessage(null), 2000);
  };

  const handleMemoryRecall = () => {
    setDisplay(memory.toString());
    setNewNumberStarted(true);
    setMessage(`调用内存：当前内存值 ${memory}`);
    setTimeout(() => setMessage(null), 2000);
  };

  const handleMemoryStore = () => {
    const value = parseFloat(display);
    setMemory(value);
    setMessage(`存储内存：已存储 ${value}`);
    setTimeout(() => setMessage(null), 2000);
  };

  const handleMemoryPlus = () => {
    try {
      const currentValue = parseFloat(display);
      if (isNaN(currentValue)) return;
      const newMemory = memory + currentValue;
      setMemory(newMemory);
      setMessage(`内存加法：新内存值 ${newMemory}`);
      setTimeout(() => setMessage(null), 2000);
    } catch (error) {
      console.error("内存加法错误:", error);
    }
  };

  const handleMemoryMinus = () => {
    try {
      const currentValue = parseFloat(display);
      if (isNaN(currentValue)) return;
      const newMemory = memory - currentValue;
      setMemory(newMemory);
      setMessage(`内存减法：新内存值 ${newMemory}`);
      setTimeout(() => setMessage(null), 2000);
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
    setMessage("AC: 全部清除");
    setTimeout(() => setMessage(null), 2000);
  };

  const handleClearEntry = () => {
    setDisplay("0");
    setNewNumberStarted(false);
    setMessage("CE: 清除当前输入");
    setTimeout(() => setMessage(null), 2000);
  };

  // Backspace function
  const handleBackspace = () => {
    if (display === "Error" || display === "0" || lastOperationWasEquals) {
      setDisplay("0");
      setNewNumberStarted(false);
      setMessage("退格: 无法退格");
      setTimeout(() => setMessage(null), 2000);
      return;
    }

    // Remove the last character
    const newDisplay = display.length > 1 ? display.slice(0, -1) : "0";
    setDisplay(newDisplay);
    setMessage("退格: 删除最后一位");
    setTimeout(() => setMessage(null), 2000);
  };

  // Toggle angle mode
  const handleAngleMode = () => {
    setAngleMode(angleMode === "弧度制" ? "角度制" : "弧度制");
  };

  // Toggle history modal
  const toggleHistoryModal = () => {
    setShowHistory(!showHistory);
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

      // 显示百分比操作描述
      setMessage(`百分比计算: ${currentValue}%`);

      // 2秒后计算并显示结果
      setTimeout(() => {
        const value = currentValue / 100;
        const result = formatDisplayValue(value);

        // 添加到历史记录
        const calculationText = `${currentValue} % = ${result}`;
        setHistory(prev => {
          const newHistory = [...prev, calculationText];
          // 限制历史记录数量为最新10条
          return newHistory.slice(-10);
        });

        setDisplay(result);
        setMessage(null); // 清除消息
      }, 2000);
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

      // 显示正负号切换描述
      setMessage(`正负号切换: ${currentValue} → ${-currentValue}`);

      // 2秒后显示结果
      setTimeout(() => {
        const negatedValue = currentValue * -1;
        const result = formatDisplayValue(negatedValue);

        // 添加到历史记录
        const calculationText = `+/-(${currentValue}) = ${result}`;
        setHistory(prev => {
          const newHistory = [...prev, calculationText];
          // 限制历史记录数量为最新10条
          return newHistory.slice(-10);
        });

        setDisplay(result);
        setMessage(null); // 清除消息
      }, 2000);
    } catch (error) {
      setDisplay("Error");
      console.error("正负号切换错误:", error);
    }
  };

  // 获取科学计算函数的描述
  const getScientificDescription = (op: string, value: number): string => {
    switch(op) {
      case "sqrt":
        return `开平方根: √${value}`;
      case "abs":
        return `绝对值: |${value}|`;
      case "pow":
        return `幂运算: ${value}^y`;
      case "pow2":
        return `平方: ${value}²`;
      case "pow3":
        return `立方: ${value}³`;
      case "inv":
        return `倒数: 1/${value}`;
      case "fact":
        return `阶乘: ${value}!`;
      case "sin":
        return `正弦: sin(${value}${angleMode === "弧度制" ? "" : "°"})`;
      case "cos":
        return `余弦: cos(${value}${angleMode === "弧度制" ? "" : "°"})`;
      case "tan":
        return `正切: tan(${value}${angleMode === "弧度制" ? "" : "°"})`;
      case "log":
        return `常用对数: log₁₀(${value})`;
      case "ln":
        return `自然对数: ln(${value})`;
      case "exp":
        return `指数函数: e^${value}`;
      default:
        return "";
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

      // 显示函数描述
      const description = getScientificDescription(op, currentValue);
      setMessage(description);

      // 设置延迟，2秒后计算并显示结果
      setTimeout(() => {
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

        const formattedResult = formatDisplayValue(result);

        // 添加到历史记录
        const opSymbols = {
          sqrt: `√(${currentValue})`,
          abs: `|${currentValue}|`,
          pow2: `${currentValue}²`,
          pow3: `${currentValue}³`,
          inv: `1/${currentValue}`,
          fact: `${currentValue}!`,
          sin: `sin(${currentValue}${angleMode === "弧度制" ? "" : "°"})`,
          cos: `cos(${currentValue}${angleMode === "弧度制" ? "" : "°"})`,
          tan: `tan(${currentValue}${angleMode === "弧度制" ? "" : "°"})`,
          log: `log₁₀(${currentValue})`,
          ln: `ln(${currentValue})`,
          exp: `e^${currentValue}`
        };

        const opText = op in opSymbols ? opSymbols[op as keyof typeof opSymbols] : `${op}(${currentValue})`;
        const calculationText = `${opText} = ${formattedResult}`;

        setHistory(prev => {
          const newHistory = [...prev, calculationText];
          // 限制历史记录数量为最新10条
          return newHistory.slice(-10);
        });

        setDisplay(formattedResult);
        setNewNumberStarted(true);
        setMessage(null); // 清除消息
      }, 2000); // 2秒后执行
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
        <div className="message">{message}</div>
      </div>

      <div className="mode-selector">
        <button onClick={handleAngleMode}>{angleMode}</button>
      </div>

      <div className="history-container">
        <button className="history-button" onClick={toggleHistoryModal}>查看历史记录</button>
      </div>

      {/* 历史记录弹窗 */}
      {showHistory && (
        <div className="history-modal">
          <div className="history-modal-content">
            <div className="history-modal-header">
              <div className="history-modal-title">计算历史记录</div>
              <button className="history-modal-close" onClick={toggleHistoryModal}>×</button>
            </div>
            <div className="history-list">
              {history.length > 0 ? (
                history.map((item, index) => (
                  <div key={`history-${index}`} className="history-item">{item}</div>
                ))
              ) : (
                <div className="history-item">暂无计算记录</div>
              )}
            </div>
          </div>
        </div>
      )}

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

        {/* 第五行 - 重新布局，添加退格键，等号按钮改为正常大小 */}
        <button className="number-btn" onClick={handleDoubleZero}>00</button>
        <button className="number-btn" onClick={handleTripleZero}>000</button>
        <button className="operation-btn" onClick={() => handleBasicOperation("+")}>+</button>
        <button className="backspace-btn" onClick={handleBackspace}>←</button>
        <button className="equals-btn" onClick={handleEquals}>=</button>
      </div>
      <div className="footer">
        © 2025 高级计算器
      </div>
    </div>
  );
}

export default App;
