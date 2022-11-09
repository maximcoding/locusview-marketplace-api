export const stringToBoolean = (value) => {
  if (typeof value == 'boolean') {
    switch (value) {
      case true:
        return true;
      case false:
        return false;
    }
  }
  switch (value?.toLowerCase().trim()) {
    case 'true':
    case 'yes':
    case '1':
      return true;
    case 'false':
    case 'no':
    case '0':
    case null:
      return false;
    default:
      return Boolean(value);
  }
};
