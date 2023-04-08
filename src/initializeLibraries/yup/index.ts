import BigNumber from 'bignumber.js';
import * as yup from 'yup';

const tokenSchema = yup.object().shape({
  symbol: yup.string().required(),
  decimals: yup.number().required(),
  asset: yup.string().required(),
  address: yup.string().when('isNative', {
    is: true,
    then: schema => schema.optional(),
    otherwise: schema => schema.required(),
  }),
  isNative: yup.boolean().notRequired(),
});

const initializeYup = () => {
  // Add custom validation methods
  yup.addMethod(yup.string, 'positive', function (errorMessage: string) {
    return this.test('positive', errorMessage, function (value: string | undefined) {
      const isPositive = Number(value) > 0;
      return isPositive || this.createError({ message: errorMessage });
    });
  });

  yup.addMethod(
    yup.string,
    'lowerThanOrEqualTo',
    function (maxValue: BigNumber | string | number | undefined, errorMessage: string) {
      return this.test('positive', errorMessage, function (value: string | number | undefined) {
        // Mark value as valid if no maxValue has been defined
        if (maxValue === undefined) {
          return true;
        }

        const isValueValid = typeof value === 'string' || typeof value === 'number';

        const isLessThanOrEqualToMaxValue =
          isValueValid && new BigNumber(value).isLessThanOrEqualTo(maxValue);

        const isValid = isValueValid && isLessThanOrEqualToMaxValue;

        return isValid || this.createError({ message: errorMessage });
      });
    },
  );

  yup.addMethod(yup.object, 'token', () => tokenSchema);
};

export default initializeYup;
