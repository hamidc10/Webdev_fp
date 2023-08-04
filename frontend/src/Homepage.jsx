import React, { useEffect, useState } from 'react';


export const Homepage = () => {



  const Card = ({ vehicle_id, make, model, year, odometer, onVehicle, onDelete, onUpdate }) => {
    return (
      <div class="vehicle_card">
        <button class="Vp_button" onClick={() => onVehicle(vehicle_id)}></button>
        <h2>{make} - {model}</h2>
        <p class="text_plac">Year: {year}</p>
        <p class="text_plac">Odometer: {odometer}</p>
        <button  class="delete_car"onClick={() => onDelete(vehicle_id)}>Delete</button>
        <button class="update_car" onClick={() => onUpdate(vehicle_id)}>Update</button>
      </div>
    )
  }



  const PopUpForm = ({ onSubmit, onCancel, initialData }) => {
    const [vehicle_id, setVehicle_id] = useState(initialData ? initialData.vehicle_id : '');
    const [make, setMake] = useState(initialData ? initialData.make : '');
    const [model, setModel] = useState(initialData ? initialData.model : '');
    const [year, setYear] = useState(initialData ? initialData.year : '');
    const [odometer, setOdometer] = useState(initialData ? initialData.odometer : '');

    const handleSubmit = (e) => {
      e.preventDefault()


      const data = {
        vehicle_id: vehicle_id,
        make: make,
        model: model,
        year: year,
        odometer: odometer,
      }
      const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST,PATCH,OPTIONS'
      }
      fetch("http://localhost:5000/update_vehicle", {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data),
      })
        .then((response) => {
          response.json().then(function (result) {
            console.log("ID", result["vehicle_id"])
            const vehicle_id = String(result["vehicle_id"]);
            onSubmit({ vehicle_id, make, model, year, odometer });
            setVehicle_id('');
            setMake('');
            setModel('');
            setYear('');
            setOdometer('');
          })
        })
        .then((data) => {
          console.log('Success:', data);

        })
        .catch((error) => {
          console.error('Error:', error);
        })


    }

    return (
      <div class="Car_info" >
        <form class="Car_form" onSubmit={handleSubmit}>
          <label class="car_label" htmlFor="make">Make:</label>
          <input
            class='car_input1'
            type="text"
            id="make"
            value={make}
            onChange={(e) => setMake(e.target.value)}
            required
          />
          <label class="car_label" htmlFor="model">Model:</label>
          <input
            class='car_input2'
            type="text"
            id="model"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            required
          />
          <label class="car_label" htmlFor="year">Year:</label>
          <input
            class='car_input3'
            type="number"
            id="year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            required
          />
          <label class="car_label" htmlFor="odometer">Current Odometer:</label>
          <input
            class='car_input4'
            type="number"
            id="odometer"
            value={odometer}
            onChange={(e) => setOdometer(e.target.value)}
            required
          />
          <div class="button_pos">
          <button class="submit_car" type="submit">Submit</button>
          <button class="cancel_car" type="button" onClick={onCancel}>Cancel</button>
          </div>
          
          </form>
      </div>
    )
  }


  const [cards, setCards] = useState([]);
  const [showPopUp, setShowPopUp] = useState(false);
  const [editCard, setEditCard] = useState(null);

  const handleAddCard = (newCard) => {
    setCards([...cards, newCard]);
    setShowPopUp(false);
  }

  const handleUpdateCard = (editedCard) => {
    setCards(cards.map((card) => (card.vehicle_id === editedCard.vehicle_id ? editedCard : card)));
    setEditCard(null);
    setShowPopUp(false);
    window.location.reload();
  }

  const handleVehicleID = (vehicle_id) => {
    window.location = '/main/' + String(vehicle_id)
  }

  const handleDeleteCard = (vehicle_id) => {
    const data = {
      vehicle_id: vehicle_id
    }
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST,PATCH,OPTIONS'
    }
    fetch("http://localhost:5000/remove_vehicle", {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data),
    })
      .then((data) => {
        console.log('Success:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      })
    setCards(cards.filter((card) => card.vehicle_id !== vehicle_id));
  }

  const handleEditCard = (vehicle_id) => {
    const cardToEdit = cards.find((card) => card.vehicle_id === vehicle_id);
    if (cardToEdit) {
      setEditCard(cardToEdit);
      setShowPopUp(true);
    }
  }

  useEffect(() => {
    let ignore = false;

    async function startFetching() {

      const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET'
      }
      fetch("http://localhost:5000/get_vehicles", {
        method: 'GET',
        headers: headers
      })
        .then((response) => {
          response.json().then(function (result) {
            if (!ignore) {
              console.log(result["vehicles"]);
              var data = [];
              for (let vehicle of result["vehicles"]) {
                console.log(vehicle)
                data.push({
                  "vehicle_id": vehicle[0],
                  "make": vehicle[1],
                  "model": vehicle[2],
                  "year": vehicle[3],
                  "odometer": vehicle[4]
                })
              }
              setCards(data)
            }
          })
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }

    startFetching();

    return () => {
      ignore = true;
    }
  }, [])

  return (
    <>
      <div class="Add_cars">
        <div >
          <button  class="Add_button" onClick={() => setShowPopUp(true)}></button>
        </div>
        <div className="card_setup">
          {cards.map((card, index) => (
            <Card
              key={index}
              vehicle_id={card.vehicle_id}
              make={card.make}
              model={card.model}
              year={card.year}
              odometer={card.odometer}
              onDelete={handleDeleteCard}
              onUpdate={handleEditCard}
              onVehicle={handleVehicleID}
            />
          ))}
        </div>
        {showPopUp && (
          <PopUpForm
            onSubmit={editCard ? handleUpdateCard : handleAddCard}
            onCancel={() => { setShowPopUp(false); setEditCard(null); }}
            initialData={editCard}
          />
        )}
      </div>
    </>
  )
}


