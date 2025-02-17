const currencies = [
  {
    code: "USD",
    symbol: "$",
    title: "USD: US Dollar",
  },
  {
    code: "CAD",
    symbol: "CA$",
    title: "CAD: Canadian Dollar",
  },
  {
    code: "EUR",
    symbol: "€",
    title: "EUR: Euro",
  },
  {
    code: "AED",
    symbol: "AED",
    title: "AED: United Arab Emirates Dirham",
  },
  {
    code: "AFN",
    symbol: "Af",
    title: "AFN: Afghan Afghani",
  },
  {
    code: "ALL",
    symbol: "ALL",
    title: "ALL: Albanian Lek",
  },
  {
    code: "AMD",
    symbol: "AMD",
    title: "AMD: Armenian Dram",
  },
  {
    code: "ARS",
    symbol: "AR$",
    title: "ARS: Argentine Peso",
  },
  {
    code: "AUD",
    symbol: "AU$",
    title: "AUD: Australian Dollar",
  },
  {
    code: "AZN",
    symbol: "man.",
    title: "AZN: Azerbaijani Manat",
  },
  {
    code: "BAM",
    symbol: "KM",
    title: "BAM: Bosnia-Herzegovina Convertible Mark",
  },
  {
    code: "BDT",
    symbol: "Tk",
    title: "BDT: Bangladeshi Taka",
  },
  {
    code: "BGN",
    symbol: "BGN",
    title: "BGN: Bulgarian Lev",
  },
  {
    code: "BHD",
    symbol: "BD",
    title: "BHD: Bahraini Dinar",
  },
  {
    code: "BIF",
    symbol: "FBu",
    title: "BIF: Burundian Franc",
  },
  {
    code: "BND",
    symbol: "BN$",
    title: "BND: Brunei Dollar",
  },
  {
    code: "BOB",
    symbol: "Bs",
    title: "BOB: Bolivian Boliviano",
  },
  {
    code: "BRL",
    symbol: "R$",
    title: "BRL: Brazilian Real",
  },
  {
    code: "BWP",
    symbol: "BWP",
    title: "BWP: Botswanan Pula",
  },
  {
    code: "BYR",
    title: "BYR: Belarusian Ruble",
  },
  {
    code: "BZD",
    symbol: "BZ$",
    title: "BZD: Belize Dollar",
  },
  {
    code: "CDF",
    symbol: "CDF",
    title: "CDF: Congolese Franc",
  },
  {
    code: "CHF",
    symbol: "CHF",
    title: "CHF: Swiss Franc",
  },
  {
    code: "CLP",
    symbol: "CL$",
    title: "CLP: Chilean Peso",
  },
  {
    code: "CNY",
    symbol: "CN¥",
    title: "CNY: Chinese Yuan",
  },
  {
    code: "COP",
    symbol: "CO$",
    title: "COP: Colombian Peso",
  },
  {
    code: "CRC",
    symbol: "₡",
    title: "CRC: Costa Rican Colón",
  },
  {
    code: "CVE",
    symbol: "CV$",
    title: "CVE: Cape Verdean Escudo",
  },
  {
    code: "CZK",
    symbol: "Kč",
    title: "CZK: Czech Republic Koruna",
  },
  {
    code: "DJF",
    symbol: "Fdj",
    title: "DJF: Djiboutian Franc",
  },
  {
    code: "DKK",
    symbol: "Dkr",
    title: "DKK: Danish Krone",
  },
  {
    code: "DOP",
    symbol: "RD$",
    title: "DOP: Dominican Peso",
  },
  {
    code: "DZD",
    symbol: "DA",
    title: "DZD: Algerian Dinar",
  },
  {
    code: "EEK",
    symbol: "Ekr",
    title: "EEK: Estonian Kroon",
  },
  {
    code: "EGP",
    symbol: "EGP",
    title: "EGP: Egyptian Pound",
  },
  {
    code: "ERN",
    symbol: "Nfk",
    title: "ERN: Eritrean Nakfa",
  },
  {
    code: "ETB",
    symbol: "Br",
    title: "ETB: Ethiopian Birr",
  },
  {
    code: "GBP",
    symbol: "£",
    title: "GBP: British Pound Sterling",
  },
  {
    code: "GEL",
    symbol: "GEL",
    title: "GEL: Georgian Lari",
  },
  {
    code: "GHS",
    symbol: "GH₵",
    title: "GHS: Ghanaian Cedi",
  },
  {
    code: "GNF",
    symbol: "FG",
    title: "GNF: Guinean Franc",
  },
  {
    code: "GTQ",
    symbol: "GTQ",
    title: "GTQ: Guatemalan Quetzal",
  },
  {
    code: "HKD",
    symbol: "HK$",
    title: "HKD: Hong Kong Dollar",
  },
  {
    code: "HNL",
    symbol: "HNL",
    title: "HNL: Honduran Lempira",
  },
  {
    code: "HRK",
    symbol: "kn",
    title: "HRK: Croatian Kuna",
  },
  {
    code: "HUF",
    symbol: "Ft",
    title: "HUF: Hungarian Forint",
  },
  {
    code: "IDR",
    symbol: "Rp",
    title: "IDR: Indonesian Rupiah",
  },
  {
    code: "ILS",
    symbol: "₪",
    title: "ILS: Israeli New Sheqel",
  },
  {
    code: "INR",
    symbol: "₹",
    title: "INR: Indian Rupee",
  },
  {
    code: "IQD",
    symbol: "IQD",
    title: "IQD: Iraqi Dinar",
  },
  {
    code: "IRR",
    symbol: "IRR",
    title: "IRR: Iranian Rial",
  },
  {
    code: "ISK",
    symbol: "Ikr",
    title: "ISK: Icelandic Króna",
  },
  {
    code: "JMD",
    symbol: "J$",
    title: "JMD: Jamaican Dollar",
  },
  {
    code: "JOD",
    symbol: "JD",
    title: "JOD: Jordanian Dinar",
  },
  {
    code: "JPY",
    symbol: "¥",
    title: "JPY: Japanese Yen",
  },
  {
    code: "KES",
    symbol: "Ksh",
    title: "KES: Kenyan Shilling",
  },
  {
    code: "KHR",
    symbol: "KHR",
    title: "KHR: Cambodian Riel",
  },
  {
    code: "KMF",
    symbol: "CF",
    title: "KMF: Comorian Franc",
  },
  {
    code: "KRW",
    symbol: "₩",
    title: "KRW: South Korean Won",
  },
  {
    code: "KWD",
    symbol: "KD",
    title: "KWD: Kuwaiti Dinar",
  },
  {
    code: "KZT",
    symbol: "KZT",
    title: "KZT: Kazakhstani Tenge",
  },
  {
    code: "LBP",
    symbol: "L.L.",
    title: "LBP: Lebanese Pound",
  },
  {
    code: "LKR",
    symbol: "SLRs",
    title: "LKR: Sri Lankan Rupee",
  },
  {
    code: "LTL",
    symbol: "Lt",
    title: "LTL: Lithuanian Litas",
  },
  {
    code: "LVL",
    symbol: "Ls",
    title: "LVL: Latvian Lats",
  },
  {
    code: "LYD",
    symbol: "LD",
    title: "LYD: Libyan Dinar",
  },
  {
    code: "MAD",
    symbol: "MAD",
    title: "MAD: Moroccan Dirham",
  },
  {
    code: "MDL",
    symbol: "MDL",
    title: "MDL: Moldovan Leu",
  },
  {
    code: "MGA",
    symbol: "MGA",
    title: "MGA: Malagasy Ariary",
  },
  {
    code: "MKD",
    symbol: "MKD",
    title: "MKD: Macedonian Denar",
  },
  {
    code: "MMK",
    symbol: "MMK",
    title: "MMK: Myanma Kyat",
  },
  {
    code: "MOP",
    symbol: "MOP$",
    title: "MOP: Macanese Pataca",
  },
  {
    code: "MUR",
    symbol: "MURs",
    title: "MUR: Mauritian Rupee",
  },
  {
    code: "MXN",
    symbol: "MX$",
    title: "MXN: Mexican Peso",
  },
  {
    code: "MYR",
    symbol: "RM",
    title: "MYR: Malaysian Ringgit",
  },
  {
    code: "MZN",
    symbol: "MTn",
    title: "MZN: Mozambican Metical",
  },
  {
    code: "NAD",
    symbol: "N$",
    title: "NAD: Namibian Dollar",
  },
  {
    code: "NGN",
    symbol: "₦",
    title: "NGN: Nigerian Naira",
  },
  {
    code: "NIO",
    symbol: "C$",
    title: "NIO: Nicaraguan Córdoba",
  },
  {
    code: "NOK",
    symbol: "Nkr",
    title: "NOK: Norwegian Krone",
  },
  {
    code: "NPR",
    symbol: "NPRs",
    title: "NPR: Nepalese Rupee",
  },
  {
    code: "NZD",
    symbol: "NZ$",
    title: "NZD: New Zealand Dollar",
  },
  {
    code: "OMR",
    symbol: "OMR",
    title: "OMR: Omani Rial",
  },
  {
    code: "PAB",
    symbol: "B/.",
    title: "PAB: Panamanian Balboa",
  },
  {
    code: "PEN",
    symbol: "S/.",
    title: "PEN: Peruvian Nuevo Sol",
  },
  {
    code: "PHP",
    symbol: "₱",
    title: "PHP: Philippine Peso",
  },
  {
    code: "PKR",
    symbol: "PKRs",
    title: "PKR: Pakistani Rupee",
  },
  {
    code: "PLN",
    symbol: "zł",
    title: "PLN: Polish Zloty",
  },
  {
    code: "PYG",
    symbol: "₲",
    title: "PYG: Paraguayan Guarani",
  },
  {
    code: "QAR",
    symbol: "QR",
    title: "QAR: Qatari Rial",
  },
  {
    code: "RON",
    symbol: "RON",
    title: "RON: Romanian Leu",
  },
  {
    code: "RSD",
    symbol: "din.",
    title: "RSD: Serbian Dinar",
  },
  {
    code: "RUB",
    symbol: "RUB",
    title: "RUB: Russian Ruble",
  },
  {
    code: "RWF",
    symbol: "RWF",
    title: "RWF: Rwandan Franc",
  },
  {
    code: "SAR",
    symbol: "SR",
    title: "SAR: Saudi Riyal",
  },
  {
    code: "SDG",
    symbol: "SDG",
    title: "SDG: Sudanese Pound",
  },
  {
    code: "SEK",
    symbol: "Skr",
    title: "SEK: Swedish Krona",
  },
  {
    code: "SGD",
    symbol: "S$",
    title: "SGD: Singapore Dollar",
  },
  {
    code: "SOS",
    symbol: "Ssh",
    title: "SOS: Somali Shilling",
  },
  {
    code: "SYP",
    symbol: "SY£",
    title: "SYP: Syrian Pound",
  },
  {
    code: "THB",
    symbol: "฿",
    title: "THB: Thai Baht",
  },
  {
    code: "TND",
    symbol: "DT",
    title: "TND: Tunisian Dinar",
  },
  {
    code: "TOP",
    symbol: "T$",
    title: "TOP: Tongan Paʻanga",
  },
  {
    code: "TRY",
    symbol: "TL",
    title: "TRY: Turkish Lira",
  },
  {
    code: "TTD",
    symbol: "TT$",
    title: "TTD: Trinidad and Tobago Dollar",
  },
  {
    code: "TWD",
    symbol: "NT$",
    title: "TWD: New Taiwan Dollar",
  },
  {
    code: "TZS",
    symbol: "TSh",
    title: "TZS: Tanzanian Shilling",
  },
  {
    code: "UAH",
    symbol: "₴",
    title: "UAH: Ukrainian Hryvnia",
  },
  {
    code: "UGX",
    symbol: "USh",
    title: "UGX: Ugandan Shilling",
  },
  {
    code: "UYU",
    symbol: "$U",
    title: "UYU: Uruguayan Peso",
  },
  {
    code: "UZS",
    symbol: "UZS",
    title: "UZS: Uzbekistan Som",
  },
  {
    code: "VEF",
    symbol: "Bs.F.",
    title: "VEF: Venezuelan Bolívar",
  },
  {
    code: "VND",
    symbol: "₫",
    title: "VND: Vietnamese Dong",
  },
  {
    code: "XAF",
    symbol: "FCFA",
    title: "XAF: CFA Franc BEAC",
  },
  {
    code: "XOF",
    symbol: "CFA",
    title: "XOF: CFA Franc BCEAO",
  },
  {
    code: "YER",
    symbol: "YR",
    title: "YER: Yemeni Rial",
  },
  {
    code: "ZAR",
    symbol: "R",
    title: "ZAR: South African Rand",
  },
  {
    code: "ZMK",
    symbol: "ZK",
    title: "ZMK: Zambian Kwacha",
  },
];

export const defaultCurrency = {
  code: "USD",
  symbol: "$",
  title: "USD: US Dollar",
};

export default currencies;
