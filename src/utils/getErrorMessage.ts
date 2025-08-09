export const getErrorMessage = (error: any, defaultMessage: string = 'An unexpected error occurred.'): string => {
  if (!error) {
    return defaultMessage;
  }

  if (error.response) {
    const data = error.response.data || error.response;
    if (typeof data === 'object' && !Array.isArray(data)) {
      const fieldErrors = Object.keys(data).map(key => {
        const messages = Array.isArray(data[key]) ? data[key].join(' ') : data[key];
        return `${key.replace(/_/g, ' ')}: ${messages}`;
      });
      if (fieldErrors.length > 0) {
        return fieldErrors.join('; ');
      }
    }
    if (data.detail) {
      return typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail);
    }
    if (data.message) {
      return typeof data.message === 'string' ? data.message : JSON.stringify(data.message);
    }
    if (data.error) {
      return typeof data.error === 'string' ? data.error : JSON.stringify(data.error);
    }
  }

  if (error.message) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  try {
    const stringified = JSON.stringify(error);
    if (stringified !== '{}') {
      return stringified;
    }
  } catch (e) {}

  return defaultMessage;
};

export default getErrorMessage; 