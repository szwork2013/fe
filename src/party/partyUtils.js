


export function composedParty(partyObject, entities) {
  return Object.assign(
    partyObject,
    {
      get defaultLanguageLabel() {
        const Language = entities.get('Language');
        return Language.getLovItemLabel(partyObject.defaultLanguage);
      },
      get defaultPaymentCondLabel() {
        const PaymentCond = entities.get('PaymentCond');
        return PaymentCond.getLovItemLabel(partyObject.defaultPaymentCond);
      }
    }
  );
}
