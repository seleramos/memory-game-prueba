import { useEffect, useState } from "react";
import "./App.css";
import SingleCard from "./components/SingleCard";
import Swal from "sweetalert2";
import StopWatch from "./components/StopWatch";


// array of card images
const cardImages = [
  { src: "/img/1.png", matched: false },
  { src: "/img/2.png", matched: false },
  { src: "/img/3.png", matched: false },
  { src: "/img/4.png", matched: false },
  { src: "/img/5.png", matched: false },
  { src: "/img/7.png", matched: false },
];

function App() {
  const [cards, setCards] = useState([]);
  const [turns, setTurns] = useState(0);
  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [contador, setContador] = useState(Number(0));

  const [isActive, setIsActive] = useState(true);
  const [isPaused, setIsPaused] = useState(true);
  const [time, setTime] = useState(0);
  useEffect(() => {
    let interval = null;
  
    if (isActive && isPaused === false) {
      interval = setInterval(() => {
        setTime((time) => time + 10);
      }, 10);
    } else {
      clearInterval(interval);
    }
    return () => {
      clearInterval(interval);
    };
  }, [isActive, isPaused]);
  
  
  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
  };
  
  const handlePauseResume = () => {
    setIsPaused(!isPaused);
  };
  const handleReset = () => {
    console.log("paso")
    setTime(0);
  };





  // shuffle cards, duplicate cards to get set of 12, assign random ID to each
  const shuffleCards = () => {
    const shuffledCards = [...cardImages, ...cardImages] // 2 lots of card images
      .sort(() => Math.random() - 0.5) // shuffled array
      .map((card) => ({ ...card, id: Math.random() })); // add on random ID number to each card

    setChoiceOne(null);
    setChoiceTwo(null);
    setCards(shuffledCards);
    setTurns(0);
    setContador(0);
    setIsPaused(true)
    handleReset()
    handleStart ()
    handlePauseResume ()

  };

  // handle a user choice, update choice one or two
  const handleChoice = (card) => {
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
    setIsPaused(false)
     // if choiceOne is null (is false), update with setChoiceOne, else update choiceTwo with setChoiceTwo
  };

  // reset game automagically
  useEffect(() => {
    shuffleCards();
  }, );

  const terminacion = () => {
    Swal.fire({
      title: "BIEN!",
      html: `
      <div className="timer">
      <span>
      Has ganado en : 
      </span>
      <span className="digits">
        ${("0" + Math.floor((time / 60000) % 60)).slice(-2)}'
      </span>
      <span className="digits">
        ${("0" + Math.floor((time / 1000) % 60)).slice(-2)}''
      </span>
      <span className="digits mili-sec">
        ${("0" + ((time / 10) % 100)).slice(-2)}'''
      </span>
    </div>
      `,
      icon: "success",
      confirmButtonText: "ok",
    }).then((resut) => {
      if (resut.isConfirmed) {
        shuffleCards();
      }
    });
  };

  // compare two selected cards
  useEffect(() => {
    
    if (choiceOne && choiceTwo) {
      setDisabled(true);
      if (choiceOne.src === choiceTwo.src) {
        setCards((prevCards) => {
          return prevCards.map((card) => {
            if (card.src === choiceOne.src) {
              return { ...card, matched: true };
            } else {
              return card;
            }
          });
        });
        setContador((prevContador) => Number(prevContador) + 1);
        if (contador ===5) {
          terminacion();
          setIsPaused(true)
        }
        resetTurn();
      } else {
        setTimeout(() => resetTurn(), 1000);
      }
    }
  }, [choiceOne, choiceTwo]);

  // reset choices and increase number of turns
  const resetTurn = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setTurns((prevTurns) => prevTurns + 1);
    setDisabled(false);
  };

  return (
    <div className="App">
      <h1>Pokemon Matching</h1>
      <h5>
        Prueba tu memoria con pokemons!! Un trabajo de Benjamin Oyarzun,
        Santiago Faginoli, Ariadna Ali.
      </h5>
      <button onClick={shuffleCards} className="btn">
        Nuevo juego
      </button>
      <div style={{justifyContent:"center",display:"flex",marginTop:"10px"}}>
      <StopWatch isActive={isActive} isPaused={isPaused} time={time}/>
      </div>
      <p>Turnos: {turns}</p>
      <div className="card-grid">
        {cards.map((card) => (
          <SingleCard
            key={card.id}
            card={card}
            handleChoice={handleChoice}
            cardFlipped={
              card === choiceOne || card === choiceTwo || card.matched
            }
            disabled={disabled}
          />
        ))}
      </div>
      <div>
      </div>
    </div>
  );
}

export default App;
