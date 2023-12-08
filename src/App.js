// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Jeopardy.css';

function App() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [question, setQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState([]);


  const fetchCategories = async () => {
    try {
      const response = await axios.get('https://jservice.io/api/categories', {
        params: {
          count: 10, // Adjust the number of categories as needed
        },
      });
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };
  
  const fetchQuestions = async (categoryId, count) => {
    try {
      const timestamp = new Date().getTime(); // Add a timestamp to the request URL
      const response = await axios.get('https://jservice.io/api/clues', {
        params: {
          category: categoryId,
          count,
          timestamp, // Include timestamp to avoid caching
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching questions:', error);
      return [];
    }
  };
  
  
  

  const handleCategoryClick = async (categoryId) => {
    setSelectedCategory(categoryId);
    const newQuestions = await fetchQuestions(categoryId, 5); // Adjust count as needed
    // Shuffle the questions to randomize their order
    const shuffledQuestions = newQuestions.sort(() => Math.random() - 0.5);
    setQuestions(shuffledQuestions);
    setQuestion(shuffledQuestions[0]); // Set the first question to display
  };


  const handleNextQuestion = () => {
    setUserAnswer(''); // Clear the user's previous answer
    // Find the index of the current question in the shuffled array
    const currentIndex = questions.findIndex((q) => q.id === question.id);
    // Calculate the index of the next question
    const nextIndex = (currentIndex + 1) % questions.length;
    // Set the next question
    setQuestion(questions[nextIndex]);
  };
  
  
  
  

  const handleAnswerSubmit = () => {
    if (userAnswer.toLowerCase() === question.answer.toLowerCase()) {
      setScore(score + (question.value || 100));
    }
    setSelectedCategory(null);
    setUserAnswer('');
  };
  

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="App">
      <h1>Jeopardy Game</h1>
      {!selectedCategory ? (
        <div className="game-board">
          {categories.map((category) => (
            <div
              key={category.id}
              className="category"
              onClick={() => handleCategoryClick(category.id)}
            >
              {category.title}
            </div>
          ))}
        </div>
      ) : (
        <div className="question-card">
    <h2>Category: {categories.find((cat) => cat.id === selectedCategory)?.title}</h2>
    <p>Question: {question?.question}</p>
    <p>Value: {question?.value || 'N/A'}</p>
    <input
      type="text"
      placeholder="Your answer"
      value={userAnswer}
      onChange={(e) => setUserAnswer(e.target.value)}
    />
    <button onClick={handleAnswerSubmit}>Submit Answer</button>
    <button onClick={handleNextQuestion}>Next Question</button>
  </div>
      )}
      <p>Score: {score}</p>
    </div>
  );
}

export default App;
