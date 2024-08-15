import React, { useState } from 'react';
import './App.css';

const getRandomSpecialCharacter = (): string => {
  const unicodeRangeStart = 0x2600;
  const unicodeRangeEnd = 0x26FF;
  const randomCodePoint = Math.floor(Math.random() * (unicodeRangeEnd - unicodeRangeStart + 1)) + unicodeRangeStart;
  return String.fromCodePoint(randomCodePoint);
};

const getRandomEmoji = (): string => {
  const emojiRangeStart = 0x1F600;
  const emojiRangeEnd = 0x1F64F;
  const randomCodePoint = Math.floor(Math.random() * (emojiRangeEnd - emojiRangeStart + 1)) + emojiRangeStart;
  return String.fromCodePoint(randomCodePoint);
};

const getRandomCharacter = (): string => {
  const randomIndex = Math.floor(Math.random() * 2);
  return randomIndex === 0 ? getRandomSpecialCharacter() : getRandomEmoji();
};

const App: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [outputText, setOutputText] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  const handleConvert = (text: string) => {
    const randomLength = text.length + Math.floor(text.length * 0.5);
    const randomText = Array.from({ length: randomLength }, getRandomCharacter).join('');

    const hiddenText = [];
    let asciiBuffer = '';

    for (const char of text) {
      if (/[\u4E00-\u9FFF]/.test(char)) {
        if (asciiBuffer) {
          hiddenText.push(asciiBuffer);
          asciiBuffer = '';
        }
        hiddenText.push(char);
      } else {
        asciiBuffer += char;
      }
    }

    if (asciiBuffer) {
      hiddenText.push(asciiBuffer);
    }

    let resultText = '';
    let randomIndex = 0;

    for (const part of hiddenText) {
      const insertLength = Math.floor(Math.random() * (randomLength / hiddenText.length)) + 1;
      resultText += randomText.slice(randomIndex, randomIndex + insertLength);
      randomIndex += insertLength;
      resultText += part;
    }

    if (randomIndex < randomLength) {
      resultText += randomText.slice(randomIndex);
    }

    setOutputText(resultText);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setInputText(text);
    handleConvert(text);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);

    setMessage('已复制爱的结晶！');

    if (timer) {
      clearTimeout(timer);
    }

    const newTimer = setTimeout(() => {
      setMessage('');
    }, 3000);
    setTimer(newTimer);

    handleConvert(inputText);
  };

  return (
    <div className="container">
      <h1 className="title">🥳🎉致米桑🍾🥂</h1>
      {message && <div className="notification">{message}</div>}
      <textarea
        className="input"
        rows={5}
        value={inputText}
        onChange={handleInputChange}
        placeholder="输入爱的宣言"
      />
      <button className="copy-button" onClick={handleCopy}>
        ⇊复制！为米桑打Call！
      </button>
      <textarea
        className="output"
        rows={10}
        value={outputText}
        readOnly
        placeholder="爱来自60w水登"
      />
    </div>
  );
}

export default App;
