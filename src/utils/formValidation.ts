interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export const validateFormStep = (formData: any, requiredFields: string[]): ValidationResult => {
  const errors: Record<string, string> = {};
  
  requiredFields.forEach(field => {
    const value = formData[field];
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      errors[field] = 'This field is required';
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const getRequiredFields = (documentType: string, step: number): string[] => {
  // Define required fields for each document type and step
  const requiredFields: Record<string, Record<number, string[]>> = {
    privacyPolicy: {
      1: ['companyName', 'websiteUrl', 'contactEmail'],
      2: ['dataCollected', 'dataUsage', 'dataSharing'],
      3: ['userRightsAccess', 'userRightsDeletion', 'policyUpdateNotification']
    },
    nda: {
      1: ['disclosingPartyName', 'receivingPartyName', 'effectiveDate'],
      2: ['purposeOfDisclosure', 'durationNDA', 'governingLaw'],
      3: ['confidentialInformation', 'obligationsReceivingParty']
    },
    eula: {
      1: ['licensorCompanyName', 'licensorEmail', 'productName', 'productDescription'],
      2: ['licenseType', 'permittedUses', 'restrictions'],
      3: ['licenseFee', 'paymentTerms'],
      4: ['warrantyDisclaimer', 'limitationOfLiability'],
      5: ['governingLawAndJurisdiction', 'eulaEffectiveDate']
    },
    refundPolicy: {
      1: ['companyName', 'websiteUrl', 'contactEmail'],
      2: ['refundEligibility', 'refundTimeframe'],
      3: ['refundProcess', 'nonRefundableItems'],
      4: ['policyEffectiveDate']
    },
    cookiesPolicy: {
      1: ['companyName', 'websiteUrl', 'contactEmail', 'usesCookies'],
      2: ['cookieTypes', 'cookiePurposes', 'cookieDuration'],
      3: ['linkToPrivacyPolicy']
    },
    websiteServicesAgreement: {
      1: ['serviceProviderCompanyName', 'clientCompanyName', 'serviceProviderEmail', 'clientEmail'],
      2: ['scopeOfServices', 'projectTimeline', 'deliverables'],
      3: ['serviceFees', 'paymentSchedule', 'latePaymentPolicy'],
      4: ['intellectualPropertyOwnership', 'confidentialityClause'],
      5: ['terminationConditions', 'governingLawAndJurisdiction']
    }
  };

  return requiredFields[documentType]?.[step] || [];
};
