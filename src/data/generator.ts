import { faker } from "@faker-js/faker";

const getRandomLetters = (count: number): string => {
  let chars = "";
  for (let i = 0; i < count; i++) {
    // 97 == a, 122 == z
    chars += String.fromCharCode(97 + Math.random() * 25);
  }
  return chars;
};

export const generateRandomNumbers = (count: number): string => {
  return Array(count)
    .fill([])
    .map(() => faker.number.int(9))
    .join("");
};

export const generateRandomLastName = () => {
  let randomLastName =
    faker.person.lastName().toLowerCase() + getRandomLetters(5);
  return (
    randomLastName.charAt(0).toUpperCase() + randomLastName.slice(1)
  ).replace(/[^0-9a-z]/gi, "");
};

// creates a timestamp in YYYYMMddHHmm format from a random date between now and Jan 1, 1970
export const generateTimestamp = (): string => {
  const now = new Date();
  const pastDate = new Date(now.getTime() - Math.random() * now.getTime());
  const year = pastDate.getFullYear();
  const month = String(pastDate.getMonth() + 1).padStart(2, "0");
  const day = String(pastDate.getDate()).padStart(2, "0");
  const hours = String(pastDate.getHours()).padStart(2, "0");
  const minutes = String(pastDate.getMinutes()).padStart(2, "0");
  return `${year}${month}${day}${hours}${minutes}`;
};
