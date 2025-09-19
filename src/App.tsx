import React, { useState, useEffect } from 'react';
import { Trophy, RotateCcw } from 'lucide-react';
import MonkImage from './monk1.png'; // <-- Updated PNG

interface Question {
  question: string;
  correctAnswer: string;
  alternatives: string[];
  explanation: string;
}

const HinduMythologyQuizBot = () => {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showGreeting, setShowGreeting] = useState(true);
  const [animateMonk, setAnimateMonk] = useState(true);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);

  const questions = [
    { question: "Who is the destroyer god in the Hindu trinity (Trimurti)?", correctAnswer: "Shiva", alternatives: ["Brahma", "Vishnu", "Krishna"], explanation: "Lord Shiva is known as the destroyer and transformer in the Hindu Trimurti, responsible for cosmic cycles." },
    { question: "What is the name of Lord Vishnu's divine weapon?", correctAnswer: "Sudarshan Chakra", alternatives: ["Trishul", "Vel", "Gada"], explanation: "The Sudarshan Chakra is Lord Vishnu's spinning discus weapon that never misses its target." },
    { question: "Who is the monkey god known for his devotion to Rama?", correctAnswer: "Hanuman", alternatives: ["Sugriva", "Angada", "Bali"], explanation: "Lord Hanuman is the devoted follower of Rama, known for his strength, courage, and unwavering devotion." },
    { question: "What is the name of the sacred river that flows from Lord Shiva's hair?", correctAnswer: "Ganga", alternatives: ["Yamuna", "Saraswati", "Narmada"], explanation: "River Ganga (Ganges) descended from heaven and was caught in Lord Shiva's hair to reduce its force." },
    { question: "Who is the elephant-headed god of wisdom and remover of obstacles?", correctAnswer: "Ganesha", alternatives: ["Kartikeya", "Indra", "Varuna"], explanation: "Lord Ganesha, son of Shiva and Parvati, is worshipped before starting any new venture." },
    { question: "What is the name of Krishna's flute?", correctAnswer: "Murali", alternatives: ["Veena", "Damaru", "Conch"], explanation: "Lord Krishna's divine flute Murali could enchant all beings with its melodious sound." },
    { question: "Who is the goddess of wealth and prosperity?", correctAnswer: "Lakshmi", alternatives: ["Saraswati", "Durga", "Kali"], explanation: "Goddess Lakshmi is the consort of Vishnu and bestows wealth, fortune, and prosperity." },
    { question: "What is the name of Arjuna's bow in the Mahabharata?", correctAnswer: "Gandiva", alternatives: ["Pinaka", "Saranga", "Kodanda"], explanation: "Gandiva was Arjuna's divine bow, given by Varuna, which made him invincible in battle." },
    { question: "Who is the king of demons (Asuras) in Hindu mythology?", correctAnswer: "Ravana", alternatives: ["Hiranyakashipu", "Mahishasura", "Kumbhakarna"], explanation: "Ravana, the ten-headed king of Lanka, was a great devotee of Shiva but was defeated by Rama." },
    { question: "What is the name of the cosmic serpent on which Vishnu rests?", correctAnswer: "Shesha", alternatives: ["Vasuki", "Takshaka", "Kaliya"], explanation: "Shesha (also called Ananta) is the thousand-headed serpent that serves as Vishnu's bed in the cosmic ocean." },
    { question: "Who is the goddess of knowledge and arts?", correctAnswer: "Saraswati", alternatives: ["Lakshmi", "Parvati", "Radha"], explanation: "Goddess Saraswati, consort of Brahma, is the deity of knowledge, music, arts, and learning." },
    { question: "What is the name of Lord Shiva's vehicle?", correctAnswer: "Nandi", alternatives: ["Garuda", "Mushika", "Vahana"], explanation: "Nandi, the sacred bull, is Lord Shiva's vehicle and gatekeeper, symbolizing righteousness." },
    { question: "Who wrote the epic Ramayana?", correctAnswer: "Valmiki", alternatives: ["Vyasa", "Kalidasa", "Tulsidas"], explanation: "Sage Valmiki composed the original Sanskrit Ramayana, earning him the title 'Adi Kavi' (first poet)." },
    { question: "What is the name of Indra's weapon?", correctAnswer: "Vajra", alternatives: ["Chakra", "Trishul", "Gada"], explanation: "Vajra is Indra's thunderbolt weapon, made from the bones of sage Dadhichi." },
    { question: "Who is the son of Vayu (wind god) in the Ramayana?", correctAnswer: "Hanuman", alternatives: ["Bhima", "Garuda", "Jatayu"], explanation: "Hanuman is considered the son of Vayu, which grants him the power of flight and incredible strength." },
    { question: "What is the name of the divine cow that grants all wishes?", correctAnswer: "Kamadhenu", alternatives: ["Surabhi", "Nandini", "Kapila"], explanation: "Kamadhenu is the wish-fulfilling divine cow, mother of all cows, emerged during the churning of the ocean." },
    { question: "Who is the king of gods in Greek mythology?", correctAnswer: "Zeus", alternatives: ["Poseidon", "Hades", "Apollo"], explanation: "Zeus is the ruler of Mount Olympus and god of the sky and thunder in Greek mythology." },
    { question: "In Norse mythology, what is the name of Thor's hammer?", correctAnswer: "Mjolnir", alternatives: ["Gungnir", "Gram", "Laevateinn"], explanation: "Mjolnir was crafted by dwarves and could level mountains in Norse mythology." },
    { question: "Who is the Egyptian god of the dead with a jackal head?", correctAnswer: "Anubis", alternatives: ["Ra", "Horus", "Set"], explanation: "Anubis guides souls to the afterlife and oversees mummification in Egyptian mythology." },
    { question: "In Japanese mythology, what are fox spirits called?", correctAnswer: "Kitsune", alternatives: ["Tengu", "Oni", "Yokai"], explanation: "Kitsune are intelligent fox spirits that grow more tails as they become more powerful." }
  ];

  const startWelcomeMessage = () => {
    setShowGreeting(false);
    setShowWelcomeMessage(true);
    setTimeout(() => {
      setShowWelcomeMessage(false);
      setGameStarted(true);
      setScore(0);
      setTotalQuestions(0);
      setFeedback('');
      generateNewQuestion();
    }, 3000);
  };

  const generateNewQuestion = () => {
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    setCurrentQuestion(randomQuestion);
    setUserAnswer('');
    setShowAnswer(false);
    setFeedback('');
  };

  const checkAnswer = () => {
    if (!userAnswer.trim()) {
      setFeedback("Please enter an answer first, dear disciple!");
      return;
    }
    if (!currentQuestion) return;
    const isCorrect = userAnswer.toLowerCase().trim() === currentQuestion.correctAnswer.toLowerCase();
    setTotalQuestions(prev => prev + 1);
    if (isCorrect) {
      setScore(prev => prev + 1);
      setFeedback("🎉 GOOD JOB MATE! PROCEED TO NEXT");
    } else {
      setFeedback(`❌ INCORRECT! GOOD LUCK FOR NEXT`);
    }
    setShowAnswer(true);
  };

  const nextQuestion = () => generateNewQuestion();

  const resetGame = () => {
    setGameStarted(false);
    setShowGreeting(true);
    setShowWelcomeMessage(false);
    setAnimateMonk(true);
    setScore(0);
    setTotalQuestions(0);
    setFeedback('');
    setCurrentQuestion(null);
  };

  useEffect(() => {
    if (showGreeting) {
      const timer = setTimeout(() => setAnimateMonk(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showGreeting]);

  const fontClass = "font-[Philosopher]";

  if (!gameStarted && showWelcomeMessage) {
    return (
      <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-100 via-orange-200 to-yellow-300 ${fontClass}`}>
        <div className="text-center space-y-4">
          <img src={MonkImage} alt="Monk" className="w-28 h-32 mx-auto drop-shadow-xl animate-bounce" />
          <h1 className="text-4xl bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent font-bold">
            🕉️ Welcome, Seekers of Wisdom! 🕉️
          </h1>
          <p className="text-xl text-amber-800">Preparing your mythical journey...</p>
        </div>
      </div>
    );
  }

  if (!gameStarted && showGreeting) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-amber-100 via-orange-200 to-yellow-300 space-y-6 ${fontClass}`}>
        <img src={MonkImage} alt="Monk" className={`w-28 h-32 drop-shadow-xl ${animateMonk ? 'animate-bounce' : ''}`} />
        <h1 className="text-5xl bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent font-bold">Gyani</h1>
        <p className="text-lg text-amber-700">Journey through ancient wisdom with your spiritual guide!</p>
        {!animateMonk && (
          <button 
            onClick={startWelcomeMessage}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-full font-semibold hover:scale-105 transition"
          >
            Begin Your Quest
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-100 via-orange-200 to-yellow-300 p-4 ${fontClass}`}>
      <div className="max-w-2xl w-full bg-amber-900/80 rounded-xl p-6 text-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <img src={MonkImage} alt="Monk" className="w-10 h-12 drop-shadow-md" />
            <h2 className="text-2xl font-bold text-yellow-300">Gyani</h2>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-amber-800 px-3 py-1 rounded-full space-x-2">
              <Trophy size={18} className="text-yellow-400" />
              <span className="font-bold text-yellow-300">{score}/{totalQuestions}</span>
            </div>
            <button onClick={resetGame} className="bg-orange-600 hover:bg-orange-700 p-2 rounded-full">
              <RotateCcw size={18} />
            </button>
          </div>
        </div>

        {/* Question */}
        {currentQuestion && (
          <div className="bg-amber-800/50 rounded-lg p-4 mb-6">
            <h3 className="text-xl text-yellow-200 mb-4">{currentQuestion.question}</h3>
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Share your wisdom here..."
              className="w-full px-4 py-2 rounded-lg bg-amber-900/40 border border-amber-600 focus:ring-2 focus:ring-yellow-400 mb-4"
              onKeyPress={(e) => e.key === 'Enter' && !showAnswer && checkAnswer()}
              disabled={showAnswer}
            />
            {!showAnswer ? (
              <button 
                onClick={checkAnswer}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 px-6 py-3 rounded-lg font-semibold"
              >
                Seek Wisdom 🙏
              </button>
            ) : (
              <button 
                onClick={nextQuestion}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 px-6 py-3 rounded-lg font-semibold"
              >
                Continue Journey ✨
              </button>
            )}
          </div>
        )}

        {/* Feedback */}
        {showAnswer && (
          <div>
            <div className={`mb-4 p-3 rounded-lg ${feedback.includes('GOOD JOB') ? 'bg-green-800/30 border border-green-500' : 'bg-red-800/30 border border-red-500'}`}>
              {feedback}
            </div>
            <div className="bg-amber-700/40 p-3 rounded-lg">
              <p className="font-semibold text-yellow-300">Correct Answer: {currentQuestion?.correctAnswer}</p>
              <p className="text-sm text-amber-200 mt-2">💡 {currentQuestion?.explanation}</p>
            </div>
          </div>
        )}

        {/* Progress */}
        {totalQuestions > 0 && (
          <div className="mt-6">
            <div className="flex justify-between mb-2 text-sm text-yellow-300">
              <span>Your Spiritual Progress</span>
              <span>{Math.round((score / totalQuestions) * 100)}% Enlightenment</span>
            </div>
            <div className="w-full bg-amber-900 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full"
                style={{ width: `${(score / totalQuestions) * 100}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HinduMythologyQuizBot;
