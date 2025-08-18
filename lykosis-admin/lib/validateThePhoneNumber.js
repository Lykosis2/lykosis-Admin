export default function validateThePhoneNumber(phoneNumber) {
    // Remove any non-numeric characters
    try{

        const stringPhoneNumber = phoneNumber.toString();
        let cleanedNumber = stringPhoneNumber.replace(/\D/g, '');
    
        // Check for country code and remove it
        if (cleanedNumber.startsWith('905')) {
            cleanedNumber = cleanedNumber.substring(2); // Remove '90'
        } else if (cleanedNumber.startsWith('0')) {
            cleanedNumber = cleanedNumber.substring(1); // Remove leading '0'
        }
    
        // Check if the cleaned number has exactly 10 digits
        if (cleanedNumber.length !== 10) {
            return false;
        }
    
        // Convert to integer and check if it's a valid number
        const numericPhoneNumber = parseInt(cleanedNumber, 10);
        if (isNaN(numericPhoneNumber)) {
            return false;
        }
    
        return numericPhoneNumber;
    }
    catch(err){
        return false
    }
}
