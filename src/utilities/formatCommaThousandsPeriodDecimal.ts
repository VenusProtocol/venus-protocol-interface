import commaNumber from 'comma-number';

// TODO: remove once old component have been removed (see VEN-320)
export const formatCommaThousandsPeriodDecimal = commaNumber.bindWith(',', '.');
export default formatCommaThousandsPeriodDecimal;
