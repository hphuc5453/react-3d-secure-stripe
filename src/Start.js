import App from "./App"
import './App.css'
import { useNavigate, Route, Routes } from 'react-router-dom';
import BasicCard from './BasicCard'
import { useState } from "react";
import Success from './Success'

export default function Start() {

    let [isBasicSelected, setIsBasicSelected] = useState(false)
    let [isStartedSelected, setIsStartedSelected] = useState(false)
    let [isProfessionalSelected, setIsProfessionalSelected] = useState(false)

    function changeSelecteSubscription(type) {
        switch (type) {
            case 0:
                setIsBasicSelected(true)
                setIsStartedSelected(false)
                setIsProfessionalSelected(false)
                break;

            case 1:
                setIsBasicSelected(false)
                setIsStartedSelected(true)
                setIsProfessionalSelected(false)
                break;
            case 2:
                setIsBasicSelected(false)
                setIsStartedSelected(false)
                setIsProfessionalSelected(true)
                break;
            default:
                break;
        }
    }

    function caculateAmount() {
        if (isBasicSelected) return 10;
        else if (isStartedSelected) return 15;
        else return 85;
    }

    const navigate = useNavigate();

    return (
        <div style={{ flexDirection: 'row', display: 'flex', alignItems: 'center' }}>
            <div style={{ flexDirection: 'column', display: 'flex', alignItems: 'center' }}>
                <div style={{ flexDirection: 'row', display: 'flex' }}>
                    <BasicCard title='Basic' amount={10} descriptions={['Unlimited static codes', 'Save QR Codes', 'Download Codes in .JPEG']} onCardClick={() => changeSelecteSubscription(0)} isSelected={isBasicSelected} />
                    <BasicCard title='Starter' amount={15} descriptions={['10 Dynamic Codes', 'Advanced Code Types', 'Scan Analytics', 'High Quality Downloads']} onCardClick={() => changeSelecteSubscription(1)} isSelected={isStartedSelected} />
                    <BasicCard title='Professional' amount={85} descriptions={['Unlimited Dynamic Codes', 'Account Management', 'Create Folders', 'Generate Labels', 'Manage Campaigns']} onCardClick={() => changeSelecteSubscription(2)} isSelected={isProfessionalSelected} />
                </div>

                <button style={{ maxWidth: 300, marginTop: 100 }} onClick={() => navigate('/payment')}>Continue Payment</button>

            </div>
            <Routes>
                <Route exact path="/payment" element={<App amount={caculateAmount() * 100} />} />
                <Route exact path="/success" element={<Success />} />
            </Routes>
        </div>

    );
}