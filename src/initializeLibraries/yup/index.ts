import BigNumber from 'bignumber.js';
import * as yup from 'yup';

const tokenSchema = yup.object().shape({
  symbol: yup.string().required(),
  decimals: yup.number().required(),
  asset: yup.string().required(),
  address: yup.string().required(),
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
        const areParamsValid =
          (typeof value === 'string' || typeof value === 'number') && maxValue !== undefined;

        const isLessThanOrEqualToMaxValue =
          areParamsValid && new BigNumber(value).isLessThanOrEqualTo(maxValue);

        const isValid = areParamsValid && isLessThanOrEqualToMaxValue;

        return isValid || this.createError({ message: errorMessage });
      });
    },
  );

  yup.addMethod(yup.object, 'token', () => tokenSchema);
};

export default initializeYup;
