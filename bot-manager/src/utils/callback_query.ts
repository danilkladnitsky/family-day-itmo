export const getCallbackQuery = (query, name?) => {
  const data = query?.update?.callback_query?.data;

  if (name) {
    return JSON.parse(data)[name];
  }

  return JSON.parse(data);
};
