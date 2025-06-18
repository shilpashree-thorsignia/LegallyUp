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
      1: [
        'companyName', 'businessType', 'businessAddress', 'countryRegion', 'contactEmail', 'websiteUrl', 'policyDate'
      ],
      2: [
        'dataTypesCollected', 'usesCookies', 'collectsSensitiveData', 'purposeOfUsage', 'sendsMarketingEmails'
      ],
      3: [
        'sharesWithThirdParties', 'securityMeasures', 'userRightsAccess', 'userRightsDelete', 'userRightsUpdate', 'policyUpdateNotification'
      ]
    },
    powerOfAttorney: {
      1: [
        'poaType', 'principalFullName', 'principalAddress', 'principalPan', 'principalDob'
      ],
      2: [
        'agentFullName', 'agentAddress', 'agentPan', 'agentRelationshipToPrincipal'
      ],
      3: [
        'specificPowersGranted', 'limitationsOnPowers', 'durationOfPoa', 'governingLawAndJurisdiction'
      ],
      4: [
        'witness1FullName', 'witness1Address', 'witness2FullName', 'witness2Address', 'poaEffectiveDate'
      ]
    },
    refundPolicy: {
      1: [
        'companyName', 'businessType', 'contactEmail', 'websiteUrl', 'policyScope'
      ],
      2: [
        'refundEligibilityConditions', 'howToRequestRefund', 'refundProcessingTimeframe'
      ],
      3: [
        'nonRefundableItems', 'hasExchangePolicy', 'returnShippingResponsibility', 'returnShippingInstructions'
      ],
      4: [
        'policyEffectiveDate'
      ]
    },
    websiteServicesAgreement: {
      1: [
        'serviceProviderCompanyName', 'serviceProviderAddress', 'serviceProviderEmail', 'clientCompanyName', 'clientAddress', 'clientEmail', 'agreementDate', 'projectName'
      ],
      2: [
        'websiteDescription', 'servicesIncluded', 'specificDeliverables', 'projectStartDate', 'projectCompletionDate'
      ],
      3: [
        'totalProjectCost', 'paymentSchedule'
      ],
      4: [
        'intellectualPropertyOwnership', 'confidentialityClause', 'agreementTerm'
      ],
      5: [
        'terminationConditions', 'terminationNoticePeriod', 'governingLawAndJurisdiction', 'disputeResolutionMethod', 'agreementEffectiveDate'
      ]
    },
    cookiesPolicy: {
      1: [
        'companyName', 'businessType', 'businessAddress', 'countryRegion', 'contactEmail', 'websiteUrl', 'usesCookies', 'lastUpdated'
      ],
      2: [
        'typesOfCookiesUsed', 'cookieDetailsList', 'cookiePolicyManagement'
      ],
      3: [
        'contactPersonPolicy', 'linkToPrivacyPolicy'
      ]
    },
    eula: {
      1: [
        'licensorCompanyName', 'licensorAddress', 'licensorEmail', 'productName', 'platform', 'productDescription'
      ],
      2: [
        'licenseType', 'licenseDuration', 'permittedUses'
      ],
      3: [
        'usageRestrictions'
      ],
      4: [
        'supportTerms', 'updatePolicy', 'intellectualPropertyStatement'
      ],
      5: [
        'terminationConditions'
      ]
    }
    // Add other document types as needed
  };

  return requiredFields[documentType]?.[step] || [];
};
