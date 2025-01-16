import { useState, useRef } from 'react';
import PersonalDetailsForm from '../../components/personalInfoForm/PersonalDetailsForm';
import CustomerCard from '../../components/customerCard/CustomerCard';


function CustomerCardNew() {

    const [customerEmail, setCustomerEmail] = useState<string>("");
    const [showCard, setShowCard] = useState<boolean>(false);

    const personalDetailsRef = useRef<HTMLDivElement>(null);
    const consentCardRef = useRef<HTMLDivElement>(null);
    return (
        <>
            <div ref={personalDetailsRef}>
                <PersonalDetailsForm
                    onNext={() => { setShowCard(true) }}
                    customerEmail={setCustomerEmail} />
            </div>
            <div ref={consentCardRef}>
                <CustomerCard />
            </div>
        </>
    )
}