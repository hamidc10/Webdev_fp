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
        <div id="root" class="Vehicle_page">
            <div class="veh_font"> 
                <button class="return_button" onClick={onBack}></button>
                <h4>Vehicle Information</h4>
                <p><strong>Make:</strong><h1>{make}</h1></p>
                <p><strong>Model:</strong><h1>{model}</h1></p>
                <p><strong>Year:</strong><h1>{year}</h1></p>
                <p><strong>Odometer Reading:</strong><h3>{odometer} miles</h3> </p>
                <button class="update_car2" id="updateHistoryBtn" onClick={updateServiceHistory}>Update History</button>
                <button id="NotifBtn"class="discord2" onClick={sendNotif}>Discord Reminder</button>
                

                <h2>Service History & Notes</h2>
            <textarea class="text_box" ref={textAreaRef} id="service_history" defaultValue={service_history} name="service_history" rows="4" cols="50"></textarea>
            </div>
        </div>
    );
}