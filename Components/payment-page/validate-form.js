export default function ValidateForm() {
  const validateCardOwner = (name) => {
    if (!name) {
      return "Card owner is empty";
    } else if (name.trim().length < 3) {
      return "Card owner name is not valid";
    }
    return "";
  };

  const validateExpiryDate = (expDate) => {
    if (!expDate || expDate < new Date()) {
      return "Expiry date is not valid";
    }
    return "";
  };

  const validateCardNumber = () => {
    const cardNumberElement = elements?.getElement(CardNumberElement);
    if (cardNumberElement && !cardNumberElement._complete) {
      return "Card number is not valid";
    }
    return "";
  };

  const validateCvc = () => {
    const cvcElement = elements?.getElement(CardCvcElement);
    if (cvcElement && !cvcElement._complete) {
      return "CVC is not valid";
    }
    return "";
  };

  return {
    validateCardNumber,
    validateCardOwner,
    validateCvc,
    validateExpiryDate,
  };
}
