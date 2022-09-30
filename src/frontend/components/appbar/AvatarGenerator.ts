//GET FIRSTNAME & LASTNAME INITIALS AND SET AVATAR COLOR

const getHashOfString = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    // tslint:disable-next-line: no-bitwise
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  hash = Math.abs(hash);
  return hash;
};

const normalizeHash = (hash: number, min: number, max: number) => {
  return Math.floor((hash % (max - min)) + min);
};

const hRange = [200, 260];
const sRange = [35, 65];
const lRange = [20, 50];

const generateHSL = (name: string): [number, number, number] => {
  const hash = getHashOfString(name);
  const h = normalizeHash(hash, hRange[0], hRange[1]);
  const s = normalizeHash(hash, sRange[0], sRange[1]);
  const l = normalizeHash(hash, lRange[0], lRange[1]);
  return [h, s, l];
};

const HSLtoString = (hsl: [number, number, number]): string => {
  return `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`;
};

const generateColorHsl = (userName: string) => {
  return HSLtoString(generateHSL(userName));
};

function stringAvatar(name: string): object {
  if (name.length > 1) {
    return {
      children: `${name.split(' ')[0][0].toUpperCase()}${name
        .split(' ')[1][0]
        .toUpperCase()}`,
    };
  } else {
    return {
      children: `A`,
    };
  }
}

export { stringAvatar, generateColorHsl };
