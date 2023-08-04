import React, { useEffect, useState, useRef } from 'react';
import { useParams } from "react-router-dom";

export const VehicleId = () => {
    console.log(useParams())
    const { vehicleid } = useParams();
    const [make, setMake] = useState('');
    const [model, setModel] = useState('');
    const [year, setYear] = useState('');
    const [odometer, setOdometer] = useState('');
    const [service_history, setServiceHistory] = useState('');
    const textAreaRef = useRef(null);

    useEffect(() => {
        let ignore = false;
        
        async function startFetching() {
            
            const data = {
                vehicle_id: vehicleid
            };
            const headers = {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin':'*',
                'Access-Control-Allow-Methods':'POST,PATCH,OPTIONS'
            };
            fetch("http://localhost:5000/get_vehicle", {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(data),
            })
            .then((response)=>{
                response.json().then(function(result){
                    if (!ignore) {
                        // console.log(result["vehicle"][0][1])
                        setMake(result["vehicle"][0][1]);
                        setModel(result["vehicle"][0][2]);
                        setYear(result["vehicle"][0][3]);
                        setOdometer(result["vehicle"][0][4]);
                        setServiceHistory(result["vehicle"][0][5]);
                    }
                })
            })
            .then((data) => {
                console.log('Success:', data);
                
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        }
        
        startFetching();

        return () => {
            ignore = true;
        };
      },[vehicleid]);

    const updateServiceHistory = () => {
        const data = {
            vehicle_id: vehicleid,
            service_history: textAreaRef.current.value
        };
        const headers = {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin':'*',
            'Access-Control-Allow-Methods':'POST,PATCH,OPTIONS'
        };
        fetch("http://localhost:5000/update_vehicle_service_history", {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data),
        })
        .then((data) => {
            console.log('Success:', data);
            
        })
        .catch((error) => {
            console.error('Error:', error);
        });
        
    }

    const sendNotif= () => {
        const data = {
            make: make,
            model: model,
            year: year,
            odometer: odometer
        };
        const headers = {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin':'*',
            'Access-Control-Allow-Methods':'POST,PATCH,OPTIONS'
        };
        fetch("http://localhost:5000/send_reminder", {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data),
        })
        .then((data) => {
            console.log('Success:', data);
            
        })
        .catch((error) => {
            console.error('Error:', error);
        });
        
    }

    const onBack = () => {
        window.location='/main';
    }

    return (
        <div id="root">
            <button onClick={onBack}>Go Back to Vehicle Page</button>
            <h1>Vehicle Information</h1>
            <p><strong>Make:</strong>{make}</p>
            <p><strong>Model:</strong>{model}</p>
            <p><strong>Year:</strong>{year}</p>
            <p><strong>Odometer Reading:</strong>{odometer} miles</p>
            <span><button id="updateHistoryBtn" onClick={updateServiceHistory}>Update Service History</button><button id="NotifBtn" onClick={sendNotif}>Send Service Reminder</button></span>

            <h2>Service History & Notes</h2>
            <textarea ref={textAreaRef} id="service_history" defaultValue={service_history} name="service_history" rows="4" cols="50"></textarea>
        </div>
    );
}