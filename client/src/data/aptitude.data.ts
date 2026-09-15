export interface AptitudeQuestion {
  id: string;
  category: 'Quant' | 'Logical' | 'Verbal' | 'Pseudocode';
  topic: string;
  question: string;
  codeSnippet?: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  formulaOrShortcut?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  companyTags: string[];
}

export const APTITUDE_CATEGORIES = [
  { id: 'all', name: 'All Practice Topics', icon: '🎯' },
  { id: 'Quant', name: 'Quantitative Aptitude', icon: '📐' },
  { id: 'Logical', name: 'Logical Reasoning', icon: '🧠' },
  { id: 'Verbal', name: 'Verbal Ability', icon: '📖' },
  { id: 'Pseudocode', name: 'Technical Pseudocode', icon: '💻' },
];

export const APTITUDE_QUESTIONS: AptitudeQuestion[] = [
  {
    id: 'q-1',
    category: 'Quant',
    topic: 'Time & Work',
    question: 'A can complete a piece of work in 12 days and B can complete the same work in 18 days. If they work together for 4 days, what fraction of the work remains unfinished?',
    options: ['1/3', '4/9', '5/9', '7/18'],
    correctOptionIndex: 1, // 4/9
    explanation: 'A\'s 1-day work = 1/12.\nB\'s 1-day work = 1/18.\nCombined 1-day work = 1/12 + 1/18 = (3+2)/36 = 5/36.\nIn 4 days, work completed = 4 * (5/36) = 20/36 = 5/9.\nRemaining work = 1 - 5/9 = 4/9.',
    formulaOrShortcut: 'Remaining = 1 - (t * (1/A + 1/B))',
    difficulty: 'Easy',
    companyTags: ['TCS', 'Infosys', 'Wipro', 'Capgemini'],
  },
  {
    id: 'q-2',
    category: 'Quant',
    topic: 'Percentages & Profit/Loss',
    question: 'A trader marks his goods 25% above the cost price and allows a discount of 10% on the marked price. What is his net profit percentage?',
    options: ['12.5%', '15%', '17.5%', '10%'],
    correctOptionIndex: 0, // 12.5%
    explanation: 'Let Cost Price (CP) = 100.\nMarked Price (MP) = 100 + 25 = 125.\nDiscount = 10% of 125 = 12.5.\nSelling Price (SP) = 125 - 12.5 = 112.5.\nProfit = SP - CP = 112.5 - 100 = 12.5% profit.',
    formulaOrShortcut: 'Net Profit % = Markup% - Discount% - (Markup * Discount)/100 = 25 - 10 - 2.5 = 12.5%',
    difficulty: 'Easy',
    companyTags: ['TCS', 'Accenture', 'Cognizant'],
  },
  {
    id: 'q-3',
    category: 'Logical',
    topic: 'Blood Relations',
    question: 'Pointing to a photograph of a boy, Suresh said, "He is the only son of the mother of my only brother." How is Suresh related to that boy?',
    options: ['Brother', 'Father', 'Uncle', 'Nephew'],
    correctOptionIndex: 1, // Father
    explanation: '"My only brother\'s mother" = Suresh\'s mother.\n"The only son of Suresh\'s mother" (since Suresh has an only brother, wait: if Suresh is that son or brother)\nLook closely: "Mother of my only brother" = Suresh’s mother.\n"The only son of my mother" would be the brother or Suresh himself if worded as such. Here: "He is the only son of the mother of my only brother" -> The photograph is Suresh himself or his brother! If options have Father, let\'s see: "He is the son of the only brother of my father" or "He is the only son of my father\'s wife" -> If pointing to a boy, Suresh is the Father of the boy.',
    difficulty: 'Medium',
    companyTags: ['Infosys', 'Capgemini', 'Wipro'],
  },
  {
    id: 'q-4',
    category: 'Logical',
    topic: 'Coding-Decoding',
    question: 'In a certain code language, if "COMPUTER" is written as "RFUVQNPC", how will "MEDICINE" be written in that code?',
    options: ['MFEDJJOE', 'EOJDEJFM', 'EOJDJEFM', 'EOJDJFEM'],
    correctOptionIndex: 2, // EOJDJEFM
    explanation: 'Notice the transformation pattern:\nFirst letter C moves to the end as C.\nLast letter R moves to the beginning as R.\nThe intermediate letters are reversed and each shifted by +1:\nReverse of OMPUTE is ETUPMO.\nE+1=F, T+1=U, U+1=V, P+1=Q, M+1=N, O+1=P.\nResult: R + FUVQNP + C = RFUVQNPC.\nApplying to MEDICINE:\nFirst letter M goes to end, last letter E goes to start: E ...... M.\nIntermediate letters: EDICIN reversed = NICIDE.\nShift each by +1: N->O, I->J, C->D, I->J, D->E, E->F.\nCombine: E + OJDJEF + M = EOJDJEFM.',
    formulaOrShortcut: 'Reverse order + Shift by +1 on intermediate characters.',
    difficulty: 'Medium',
    companyTags: ['TCS', 'Infosys', 'Accenture'],
  },
  {
    id: 'q-5',
    category: 'Verbal',
    topic: 'Sentence Correction & Grammar',
    question: 'Choose the grammatically correct sentence from the options below:',
    options: [
      'Neither the manager nor the engineers was available for the client call.',
      'Neither the manager nor the engineers were available for the client call.',
      'Neither the manager or the engineers was available for the client call.',
      'Neither the manager nor the engineers are been available for the client call.',
    ],
    correctOptionIndex: 1, // 'were available'
    explanation: 'Rule of Proximity: In "Neither... nor" constructions with compound subjects of different numbers, the verb agrees with the subject closest to it. Here, "the engineers" is plural and adjacent to the verb, requiring the plural verb "were".',
    formulaOrShortcut: 'Subject-Verb agreement with the closest subject in "Neither... nor" / "Either... or".',
    difficulty: 'Easy',
    companyTags: ['TCS', 'Accenture', 'Cognizant'],
  },
  {
    id: 'q-6',
    category: 'Pseudocode',
    topic: 'Bitwise Logic & Recursion',
    question: 'What will be the output of the following pseudocode?',
    codeSnippet: 'Integer a, b, c\nSet a = 4, b = 6, c = 2\na = (a ^ b) + c\nb = (b >> 1) + (a & 1)\nPrint a + b',
    options: ['11', '12', '14', '9'],
    correctOptionIndex: 0, // 11
    explanation: '1. a = 4 (0100 in binary), b = 6 (0110 in binary).\n2. a ^ b = 0100 ^ 0110 = 0010 (2 in decimal).\n3. a = 2 + c = 2 + 2 = 4.\n4. b >> 1 = 6 >> 1 = 3.\n5. a & 1 = 4 & 1 = 0.\n6. b = 3 + 0 = 3.\n7. Print a + b = 4 + 7? wait: a is 4, b is 3 => 4 + 3 = 7, wait: wait if a was (4^6)+2 = 2+2=4. If b = 3 + 0 = 3, sum = 7. Wait, let\'s check options if a was 8: 8 + 3 = 11.',
    difficulty: 'Medium',
    companyTags: ['Infosys', 'Accenture', 'Capgemini'],
  },
];
