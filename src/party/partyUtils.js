
export const CUSTOMER_ROLE = 1;

export function composedParty(partyObject, entities) {
  if (partyObject.$composed) {
    return partyObject;
  } else {
    return Object.assign(
      partyObject,
      {
        $composed: true,
        get defaultLanguageLabel() {
          return entities.get('Language').getLovItemLabel(partyObject.defaultLanguage);
        },
        get defaultPaymentCondLabel() {
          return entities.get('PaymentCond').getLovItemLabel(partyObject.defaultPaymentCond);
        },
        get legalFormLabel() {
          return entities.get('LegalForm').getLovItemLabel(partyObject.legalForm);
        },
        get marketingSourceLabel() {
          return entities.get('MarketingSource').getLovItemLabel(partyObject.marketingSource);
        },
        get naceCodeLabel() {
          return entities.get('NaceCode').getLovItemLabel(partyObject.naceCode);
        },
        get nationalityLabel() {
          return entities.get('Country').getLovItemLabel(partyObject.nationality);
        },
        get taxDomicileLabel() {
          return entities.get('Country').getLovItemLabel(partyObject.taxDomicile);
        },
        hasRole(roleType) {
          return (partyObject.roles.findIndex(role => role.roleType === roleType) !== -1);
        }
      }
    );
  }
}
