import React, { useState } from 'react';


export const Homepage = () => {


    const [cards, setCards] = useState([
        {
            title: "",
            inputField: "",
            content: "",
        }
    ])

    const addCard = () => {
        setCards([...cards, { title: "", inputField:"",content: "" }]);
    }

    const deleteCard = (index) => {
        setCards(cards.filter((card, i) => i !== index));
    }

    return (
        <div class="cards">
            <h1>Cards</h1>
            {cards.map((card, i) => (
                <div key={i}>
                    <h2>{card.title}</h2>
                    <textarea value={card.content} onChange={(e) => setCards(cards.map((c, i) => i === c.id ? { ...c, content: e.target.value } : c))} />
                    <input class="pog" value={card.inputField} onChange={(e) => setCards(cards.map((c) => i === c.id ? { ...c, inputField: e.target.value } : c))} />
                    <button onClick={() => deleteCard(i)}>Delete</button>
                </div>
            ))}
            <button onClick={addCard}>Add Card</button>
        </div>
    )
}

