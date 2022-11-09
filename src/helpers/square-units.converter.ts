const footToMeterConversionRate = 0.3048;

export class SquareUnitsConverter {
  static feetToMeterConverter(value) {
    const number = parseFloat(value);
    return number * footToMeterConversionRate;
  }

  static meterToFeetConverter(value) {
    if (!isNaN(value)) {
      const number = parseFloat(value);
      return number * footToMeterConversionRate;
    }
  }
}
