//Valider un numéro de téléphone tunisien
export function validateTunisianPhone(phone: string): boolean {
  // Supprimer tous les caractères non numériques
  const cleaned = phone.replace(/\D/g, '');

  // Vérifier la longueur et le préfixe
  // Format tunisien: 8 chiffres après le préfixe 216
  if (cleaned.length === 11 && cleaned.startsWith('216')) {
    const number = cleaned.slice(3);
    return /^[2-9]\d{7}$/.test(number);
  }

  // Format local: commence par 0, puis 8 chiffres
  if (cleaned.length === 9 && cleaned.startsWith('0')) {
    return /^[2-9]\d{7}$/.test(cleaned.slice(1));
  }

  return false;
}

// Formater un numéro de téléphone tunisien au format standard
export function formatTunisianPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');

  let number: string;
  if (cleaned.length === 11 && cleaned.startsWith('216')) {
    number = cleaned.slice(3);
  } else if (cleaned.length === 9 && cleaned.startsWith('0')) {
    number = cleaned.slice(1);
  } else {
    return phone;
  }

  return `+216 ${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5)}`;
}

// Extraire le numéro sans préfixe
export function extractPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');

  if (cleaned.length === 11 && cleaned.startsWith('216')) {
    return cleaned.slice(3);
  }

  if (cleaned.length === 9 && cleaned.startsWith('0')) {
    return cleaned.slice(1);
  }

  return cleaned;
}

// Convertir dinars tunisiens en millimes
export function tndToMillimes(tnd: number): number {
  return Math.round(tnd * 1000);
}

// Convertir millimes en dinars tunisiens
export function millimesToTnd(millimes: number): number {
  return millimes / 1000;
}

// Formater un montant en dinars tunisiens
export function formatTND(amount: number): string {
  return `${amount.toFixed(3)} DT`;
}

// Valider un montant en dinars tunisiens
export function isValidTNDAmount(amount: number): boolean {
  // Le montant doit être positif et avoir au maximum 3 décimales
  return (
    amount >= 0 &&
    amount <= 999999999 &&
    /^\d+(\.\d{1,3})?$/.test(amount.toString())
  );
}

// Valider un code postal tunisien
export function validateTunisianPostalCode(code: string | number): boolean {
  const codeStr = String(code);
  // Les codes postaux tunisiens ont 4 chiffres
  return /^\d{4}$/.test(codeStr);
}

// Valider un matricule fiscal tunisien
export function validateTaxIdentificationNumber(matricule: string): boolean {
  // Le matricule fiscal tunisien a généralement 7-8 chiffres
  return /^\d{7,8}$/.test(matricule.replace(/\s/g, ''));
}

// Valider un identifiant fiscal (ICE) tunisien
export function validateICE(ice: string): boolean {
  // L'ICE tunisien a 15 chiffres
  return /^\d{15}$/.test(ice.replace(/\s/g, ''));
}

// Formater un montant en toutes lettres en français
export function amountToWords(amount: number): string {
  const dinars = Math.floor(amount);
  const centimes = Math.round((amount - dinars) * 100);

  const units = [
    '',
    'un',
    'deux',
    'trois',
    'quatre',
    'cinq',
    'six',
    'sept',
    'huit',
    'neuf',
    'dix',
    'onze',
    'douze',
    'treize',
    'quatorze',
    'quinze',
    'seize',
    'dix-sept',
    'dix-huit',
    'dix-neuf',
  ];

  const tens = [
    '',
    '',
    'vingt',
    'trente',
    'quarante',
    'cinquante',
    'soixante',
    'soixante-dix',
    'quatre-vingt',
    'quatre-vingt-dix',
  ];

  function convertNumber(n: number): string {
    if (n === 0) return 'zéro';
    if (n < 20) return units[n];
    if (n < 100) {
      const ten = Math.floor(n / 10);
      const unit = n % 10;
      let result = tens[ten];
      if (ten === 1 || ten === 7 || ten === 9) {
        result = units[10 + n - 10 * ten];
      }
      if (unit === 1 && ten !== 0 && ten !== 8) result += ' et un';
      if (
        unit > 0 &&
        ten !== 0 &&
        ten !== 8 &&
        ten !== 1 &&
        ten !== 7 &&
        ten !== 9
      )
        result += `-${units[unit]}`;
      return result;
    }
    if (n < 1000) {
      const hundred = Math.floor(n / 100);
      const rest = n % 100;
      let result = hundred > 1 ? `${units[hundred]} cent` : 'cent';
      if (rest > 0) result += ` ${convertNumber(rest)}`;
      return result;
    }
    if (n < 1000000) {
      const thousand = Math.floor(n / 1000);
      const rest = n % 1000;
      let result = thousand > 1 ? `${convertNumber(thousand)} mille` : 'mille';
      if (rest > 0) result += ` ${convertNumber(rest)}`;
      return result;
    }
    return `${convertNumber(Math.floor(n / 1000000))} million${Math.floor(n / 1000000) > 1 ? 's' : ''}`;
  }

  let result = convertNumber(dinars) + ' dinar' + (dinars > 1 ? 's' : '');
  if (centimes > 0) {
    result += ` et ${convertNumber(centimes)} millime${centimes > 1 ? 's' : ''}`;
  }
  return result;
}

// Obtenir le governorat tunisien à partir du code postal
export function getGovernorateFromPostalCode(postalCode: string): string {
  const code = parseInt(postalCode, 10);

  if (code >= 1000 && code <= 1099) return 'Tunis';
  if (code >= 1100 && code <= 1199) return 'Ariana';
  if (code >= 2000 && code <= 2099) return 'Ben Arous';
  if (code >= 3000 && code <= 3099) return 'Manouba';
  if (code >= 4000 && code <= 4099) return 'Nabeul';
  if (code >= 5000 && code <= 5099) return 'Zaghouan';
  if (code >= 6000 && code <= 6099) return 'Bizerte';
  if (code >= 7000 && code <= 7099) return 'Béja';
  if (code >= 8000 && code <= 8099) return 'Jendouba';
  if (code >= 9000 && code <= 9099) return 'Kef';
  if (code >= 10000 && code <= 10099) return 'Siliana';
  if (code >= 11000 && code <= 11499) return 'Kairouan';
  if (code >= 12000 && code <= 12499) return 'Kasserine';
  if (code >= 13000 && code <= 13499) return 'Sidi Bouzid';
  if (code >= 14000 && code <= 14499) return 'Sousse';
  if (code >= 15000 && code <= 15499) return 'Monastir';
  if (code >= 16000 && code <= 16499) return 'Mahdia';
  if (code >= 17000 && code <= 17999) return 'Sfax';
  if (code >= 18000 && code <= 18499) return 'Gafsa';
  if (code >= 19000 && code <= 19499) return 'Tozeur';
  if (code >= 20000 && code <= 20499) return 'Kebili';
  if (code >= 21000 && code <= 21499) return 'Gabès';
  if (code >= 22000 && code <= 22499) return 'Medenine';
  if (code >= 23000 && code <= 23499) return 'Tataouine';

  return 'Inconnu';
}

// Liste des governorats tunisiens
export const TUNISIAN_GOVERNORATES = [
  'Tunis',
  'Ariana',
  'Ben Arous',
  'Manouba',
  'Nabeul',
  'Zaghouan',
  'Bizerte',
  'Béja',
  'Jendouba',
  'Kef',
  'Siliana',
  'Kairouan',
  'Kasserine',
  'Sidi Bouzid',
  'Sousse',
  'Monastir',
  'Mahdia',
  'Sfax',
  'Gafsa',
  'Tozeur',
  'Kebili',
  'Gabès',
  'Medenine',
  'Tataouine',
];

// Préfixes téléphoniques par opérateur en Tunisie
export const TUNISIAN_PHONE_PREFIXES = {
  orange: ['50', '51', '52', '53', '54', '55', '56', '57', '58', '59'],
  telecom: ['40', '41', '42', '43', '44', '45', '46', '47', '48', '49'],
  ooredoo: ['20', '21', '22', '23', '24', '25', '26', '27', '28', '29'],
};

// Obtenir l'opérateur téléphonique à partir du numéro
export function getPhoneOperator(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');

  let prefix: string;
  if (cleaned.length === 11 && cleaned.startsWith('216')) {
    prefix = cleaned.slice(3, 5);
  } else if (cleaned.length === 9 && cleaned.startsWith('0')) {
    prefix = cleaned.slice(1, 3);
  } else {
    return 'Inconnu';
  }

  if (TUNISIAN_PHONE_PREFIXES.orange.includes(prefix)) return 'Orange';
  if (TUNISIAN_PHONE_PREFIXES.telecom.includes(prefix)) return 'Telecom';
  if (TUNISIAN_PHONE_PREFIXES.ooredoo.includes(prefix)) return 'Ooredoo';

  return 'Inconnu';
}
