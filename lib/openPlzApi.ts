export const getCity = async (city: string) => {
  const response = await fetch(
    `https://openplzapi.org/de/Localities?postalCode=${city}`
  );
  const data = await response.json();
  return data;
};
