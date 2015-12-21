


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
      },
      get legalFormLabel() {
        entities.get('LegalForm').getLovItemLabel(partyObject.legalForm);
      },
      get marketingSourceLabel() {
        entities.get('MarketingSource').getLovItemLabel(partyObject.marketingSource);
      },
      get naceCodeLabel() {
        entities.get('NaceCode').getLovItemLabel(partyObject.naceCode);
      },
      get nationalityLabel() {
        entities.get('Country').getLovItemLabel(partyObject.nationality);
      },
      get taxDomicileLabel() {
        entities.get('Country').getLovItemLabel(partyObject.taxDomicile);
      }
    }
  );
}
