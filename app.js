const TAX_YEAR = 2026;
const SS_WAGE_BASE = 184500;
const SOLO_401K_EMPLOYEE_LIMIT = 24500;
const RETIREMENT_COMPENSATION_LIMIT = 360000;
const MEDICARE_ADDITIONAL_THRESHOLDS = {
  single: 200000,
  mfj: 250000,
  hoh: 200000,
};

const FEDERAL = {
  single: {
    standardDeduction: 16100,
    brackets: [
      [0, 12400, 0.1],
      [12400, 50400, 0.12],
      [50400, 105700, 0.22],
      [105700, 201775, 0.24],
      [201775, 256225, 0.32],
      [256225, 640600, 0.35],
      [640600, Infinity, 0.37],
    ],
  },
  mfj: {
    standardDeduction: 32200,
    brackets: [
      [0, 24800, 0.1],
      [24800, 100800, 0.12],
      [100800, 211400, 0.22],
      [211400, 403550, 0.24],
      [403550, 512450, 0.32],
      [512450, 768700, 0.35],
      [768700, Infinity, 0.37],
    ],
  },
  hoh: {
    standardDeduction: 24150,
    brackets: [
      [0, 17700, 0.1],
      [17700, 67300, 0.12],
      [67300, 105700, 0.22],
      [105700, 201800, 0.24],
      [201800, 256250, 0.32],
      [256250, 640600, 0.35],
      [640600, Infinity, 0.37],
    ],
  },
};

const STATE_PRESETS = [
  { id: "al", name: "Alabama", brackets: [[0, 500, 0.02], [500, 3000, 0.04], [3000, Infinity, 0.05]], note: "Some municipalities impose occupational taxes." },
  { id: "ak", name: "Alaska", brackets: [[0, Infinity, 0]], note: "No broad individual income tax." },
  { id: "az", name: "Arizona", brackets: [[0, Infinity, 0.025]] },
  { id: "ar", name: "Arkansas", brackets: [[0, 5100, 0.02], [5100, 10300, 0.03], [10300, Infinity, 0.039]], note: "Separate tax tables and low-income reductions can affect actual liability." },
  { id: "ca", name: "California", brackets: [[0, 11079, 0.01], [11079, 26264, 0.02], [26264, 41452, 0.04], [41452, 57642, 0.06], [57642, 72048, 0.08], [72048, 368350, 0.093], [368350, 441240, 0.103], [441240, 735400, 0.113], [735400, 1000000, 0.123], [1000000, Infinity, 0.133]], note: "Includes the 1% surcharge above $1M." },
  { id: "co", name: "Colorado", brackets: [[0, Infinity, 0.044]] },
  { id: "ct", name: "Connecticut", brackets: [[0, 10000, 0.02], [10000, 50000, 0.045], [50000, 100000, 0.055], [100000, 200000, 0.06], [200000, 250000, 0.065], [250000, 500000, 0.069], [500000, Infinity, 0.0699]], note: "Credits and benefit recapture can affect effective rate." },
  { id: "de", name: "Delaware", brackets: [[0, 2000, 0], [2000, 5000, 0.022], [5000, 10000, 0.039], [10000, 20000, 0.048], [20000, 25000, 0.052], [25000, 60000, 0.0555], [60000, Infinity, 0.066]], note: "Wilmington may impose an earned-income tax." },
  { id: "dc", name: "District of Columbia", brackets: [[0, 10000, 0.04], [10000, 40000, 0.06], [40000, 60000, 0.065], [60000, 250000, 0.085], [250000, 500000, 0.0925], [500000, 1000000, 0.0975], [1000000, Infinity, 0.1075]] },
  { id: "fl", name: "Florida", brackets: [[0, Infinity, 0]], note: "No broad individual income tax." },
  { id: "ga", name: "Georgia", brackets: [[0, Infinity, 0.0519]] },
  { id: "hi", name: "Hawaii", brackets: [[0, 9600, 0.014], [9600, 14400, 0.032], [14400, 19200, 0.055], [19200, 24000, 0.064], [24000, 36000, 0.068], [36000, 48000, 0.072], [48000, 60000, 0.076], [60000, 72000, 0.079], [72000, 96000, 0.0825], [96000, 144000, 0.09], [144000, 168000, 0.10], [168000, Infinity, 0.11]] },
  { id: "id", name: "Idaho", brackets: [[0, Infinity, 0.053]], note: "Modeled as flat 5.30%; actual zero-tax threshold may apply." },
  { id: "il", name: "Illinois", brackets: [[0, Infinity, 0.0495]] },
  { id: "in", name: "Indiana", brackets: [[0, Infinity, 0.03]], note: "Counties may impose local income tax." },
  { id: "ia", name: "Iowa", brackets: [[0, Infinity, 0.038]] },
  { id: "ks", name: "Kansas", brackets: [[0, 23000, 0.052], [23000, Infinity, 0.0558]], note: "Exemptions and deductions can eliminate tax at lower income levels." },
  { id: "ky", name: "Kentucky", brackets: [[0, Infinity, 0.04]], note: "Certain localities impose occupational or payroll taxes." },
  { id: "la", name: "Louisiana", brackets: [[0, Infinity, 0.03]] },
  { id: "me", name: "Maine", brackets: [[0, 26050, 0.058], [26050, 61600, 0.0675], [61600, Infinity, 0.0715]] },
  { id: "md", name: "Maryland", brackets: [[0, 1000, 0.02], [1000, 2000, 0.03], [2000, 3000, 0.04], [3000, 100000, 0.0475], [100000, 125000, 0.05], [125000, 150000, 0.0525], [150000, 250000, 0.055], [250000, Infinity, 0.0575]], note: "Counties and Baltimore City impose additional local income tax." },
  { id: "ma", name: "Massachusetts", brackets: [[0, 1000000, 0.05], [1000000, Infinity, 0.09]], note: "Models 4% millionaire surtax above $1M." },
  { id: "mi", name: "Michigan", brackets: [[0, Infinity, 0.0425]], note: "Certain cities impose local income taxes." },
  { id: "mn", name: "Minnesota", brackets: [[0, 32570, 0.0535], [32570, 106990, 0.068], [106990, 198630, 0.0785], [198630, Infinity, 0.0985]] },
  { id: "ms", name: "Mississippi", brackets: [[0, 10000, 0], [10000, Infinity, 0.044]] },
  { id: "mo", name: "Missouri", brackets: [[0, 1313, 0], [1313, 2626, 0.02], [2626, 3939, 0.025], [3939, 5252, 0.03], [5252, 6565, 0.035], [6565, 7878, 0.04], [7878, 9191, 0.045], [9191, Infinity, 0.047]], note: "Kansas City and St. Louis impose local earnings taxes." },
  { id: "mt", name: "Montana", brackets: [[0, 21100, 0.047], [21100, Infinity, 0.059]], note: "Deductions and filing-status rules can materially affect taxable income." },
  { id: "ne", name: "Nebraska", brackets: [[0, 4030, 0.0246], [4030, 24120, 0.0351], [24120, 38870, 0.0501], [38870, Infinity, 0.052]] },
  { id: "nv", name: "Nevada", brackets: [[0, Infinity, 0]], note: "No broad individual income tax." },
  { id: "nh", name: "New Hampshire", brackets: [[0, Infinity, 0]], note: "No broad individual income tax." },
  { id: "nj", name: "New Jersey", brackets: [[0, 20000, 0.014], [20000, 35000, 0.0175], [35000, 40000, 0.035], [40000, 75000, 0.05525], [75000, 500000, 0.0637], [500000, 1000000, 0.0897], [1000000, Infinity, 0.1075]], note: "Tax calculation can differ near certain thresholds." },
  { id: "nm", name: "New Mexico", brackets: [[0, 5500, 0.017], [5500, 11000, 0.032], [11000, 16000, 0.047], [16000, 210000, 0.049], [210000, Infinity, 0.059]] },
  { id: "ny", name: "New York", brackets: [[0, 8500, 0.04], [8500, 11700, 0.045], [11700, 13900, 0.0525], [13900, 80650, 0.055], [80650, 215400, 0.06], [215400, 1077550, 0.0685], [1077550, 5000000, 0.0965], [5000000, 25000000, 0.103], [25000000, Infinity, 0.109]], note: "NYC and Yonkers may impose additional local taxes." },
  { id: "nc", name: "North Carolina", brackets: [[0, Infinity, 0.0425]] },
  { id: "nd", name: "North Dakota", brackets: [[0, 48475, 0], [48475, 244825, 0.0195], [244825, Infinity, 0.025]] },
  { id: "oh", name: "Ohio", brackets: [[0, 26050, 0], [26050, 100000, 0.0275], [100000, Infinity, 0.03125]], note: "Base-tax amounts, municipalities, and school districts can affect actual tax." },
  { id: "ok", name: "Oklahoma", brackets: [[0, 1000, 0.0025], [1000, 2500, 0.0075], [2500, 3750, 0.0175], [3750, 4900, 0.0275], [4900, 7200, 0.0375], [7200, Infinity, 0.0475]] },
  { id: "or", name: "Oregon", brackets: [[0, 4550, 0.0475], [4550, 11400, 0.0675], [11400, 125000, 0.0875], [125000, Infinity, 0.099]], note: "Certain Portland-area residents may owe additional local taxes." },
  { id: "pa", name: "Pennsylvania", brackets: [[0, Infinity, 0.0307]], note: "Municipalities and school districts may impose earned-income taxes." },
  { id: "ri", name: "Rhode Island", brackets: [[0, 77450, 0.0375], [77450, 176050, 0.0475], [176050, Infinity, 0.0599]] },
  { id: "sc", name: "South Carolina", brackets: [[0, 3560, 0], [3560, 17830, 0.03], [17830, Infinity, 0.062]], note: "Future rate reductions may apply if statutory conditions are met." },
  { id: "sd", name: "South Dakota", brackets: [[0, Infinity, 0]], note: "No broad individual income tax." },
  { id: "tn", name: "Tennessee", brackets: [[0, Infinity, 0]], note: "No broad individual income tax." },
  { id: "tx", name: "Texas", brackets: [[0, Infinity, 0]], note: "No broad individual income tax." },
  { id: "ut", name: "Utah", brackets: [[0, Infinity, 0.0455]] },
  { id: "vt", name: "Vermont", brackets: [[0, 47900, 0.0335], [47900, 116000, 0.066], [116000, 242400, 0.076], [242400, Infinity, 0.0875]] },
  { id: "va", name: "Virginia", brackets: [[0, 3000, 0.02], [3000, 5000, 0.03], [5000, 17000, 0.05], [17000, Infinity, 0.0575]] },
  { id: "wa", name: "Washington", brackets: [[0, Infinity, 0]], note: "No general tax on wages or ordinary income; separate capital-gains tax not modeled for NIL ordinary income." },
  { id: "wv", name: "West Virginia", brackets: [[0, 10000, 0.0222], [10000, 25000, 0.0296], [25000, 40000, 0.0333], [40000, 60000, 0.0444], [60000, Infinity, 0.0482]] },
  { id: "wi", name: "Wisconsin", brackets: [[0, 14680, 0.035], [14680, 29370, 0.044], [29370, 323290, 0.053], [323290, Infinity, 0.0765]] },
  { id: "wy", name: "Wyoming", brackets: [[0, Infinity, 0]], note: "No broad individual income tax." },
  { id: "custom", name: "Custom flat rate", brackets: null, rate: 4.0, floor: 10000 },
];

const DEFAULTS = {
  incomes: [100000, 100000, 100000, 100000],
  yearCount: 3,
  filingStatus: "single",
  otherIncome: 0,
  annualSpending: 30000,
  nearTermCashNeed: 0,
  bigPurchaseAmount: 0,
  bigPurchaseYear: 1,
  bigPurchaseAmount2: 0,
  bigPurchaseYear2: 1,
  bigPurchaseAmount3: 0,
  bigPurchaseYear3: 1,
  bigPurchaseAmount4: 0,
  bigPurchaseYear4: 1,
  expenses: 0,
  salary: 0,
  llcAdminCost: 500,
  adminCost: 2500,
  llcSetupCost: 0,
  sCorpSetupCost: 0,
  localTaxRate: 0,
  stateIncomeShare: 100,
  federalDeductionOverride: 0,
  otherStateTaxCredit: 0,
  salaryFloorPct: 0,
  stateRate: 4.4,
  stateFloor: 10000,
  qbiMode: "none",
  retirementPlan: "auto",
  employeeDeferral: 0,
  retirementCap: 72000,
  healthPremiums: 0,
};

const ids = [
  "statePreset",
  "filingStatus",
  "otherIncome",
  "annualSpending",
  "nearTermCashNeed",
  "bigPurchaseAmount",
  "bigPurchaseYear",
  "bigPurchaseAmount2",
  "bigPurchaseYear2",
  "bigPurchaseAmount3",
  "bigPurchaseYear3",
  "bigPurchaseAmount4",
  "bigPurchaseYear4",
  "yearCount",
  "expenses",
  "salary",
  "llcAdminCost",
  "adminCost",
  "llcSetupCost",
  "sCorpSetupCost",
  "localTaxRate",
  "stateIncomeShare",
  "federalDeductionOverride",
  "otherStateTaxCredit",
  "salaryFloorPct",
  "stateRate",
  "stateFloor",
  "qbiMode",
  "retirementPlan",
  "employeeDeferral",
  "retirementCap",
  "healthPremiums",
];

const els = Object.fromEntries(ids.map((id) => [id, document.getElementById(id)]));
const incomeInputs = document.getElementById("incomeInputs");
const MAX_BIG_PURCHASES = 4;

function money(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Math.round(value || 0));
}

function pct(value) {
  return `${(value * 100).toFixed(1)}%`;
}

function parseInputNumber(value) {
  const cleaned = String(value || "").replace(/,/g, "").replace(/[^\d.-]/g, "");
  return Number(cleaned || 0);
}

function formatInputNumber(value) {
  const number = parseInputNumber(value);
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(Math.round(number || 0));
}

function topStateRate(state) {
  if (!state.brackets) return state.rate || 0;
  return Math.max(...state.brackets.map((bracket) => bracket[2])) * 100;
}

function stateZeroFloor(state) {
  if (!state.brackets) return state.floor || 0;
  const zeroBracket = state.brackets.find((bracket) => bracket[0] === 0 && bracket[2] === 0);
  return zeroBracket ? zeroBracket[1] : 0;
}

function num(id) {
  return parseInputNumber(els[id].value);
}

function bigPurchaseIds(index) {
  return {
    amount: index === 1 ? "bigPurchaseAmount" : `bigPurchaseAmount${index}`,
    year: index === 1 ? "bigPurchaseYear" : `bigPurchaseYear${index}`,
  };
}

function federalTax(taxable, status) {
  return FEDERAL[status].brackets.reduce((tax, [floor, ceiling, rate]) => {
    if (taxable <= floor) return tax;
    return tax + (Math.min(taxable, ceiling) - floor) * rate;
  }, 0);
}

function ficaTax(wages, status, otherWages = 0) {
  const parts = ficaTaxParts(wages, status, otherWages);
  return parts.employee + parts.employer;
}

function ficaTaxParts(wages, status, otherWages = 0) {
  const ssTaxable = Math.max(0, Math.min(wages, SS_WAGE_BASE - otherWages));
  const employerSsTaxable = Math.max(0, Math.min(wages, SS_WAGE_BASE));
  const additionalBase = Math.max(0, wages + otherWages - MEDICARE_ADDITIONAL_THRESHOLDS[status]);
  return {
    employee: ssTaxable * 0.062 + wages * 0.0145 + additionalBase * 0.009,
    employer: employerSsTaxable * 0.062 + wages * 0.0145,
  };
}

function selfEmploymentTax(netBusiness, status, otherWages = 0) {
  const seBase = Math.max(0, netBusiness * 0.9235);
  const ssTaxable = Math.max(0, Math.min(seBase, SS_WAGE_BASE - otherWages));
  const medicare = seBase * 0.029;
  const additionalBase = Math.max(0, seBase + otherWages - MEDICARE_ADDITIONAL_THRESHOLDS[status]);
  return ssTaxable * 0.124 + medicare + additionalBase * 0.009;
}

function stateTax(taxableIncome, assumptions) {
  const apportionedIncome = taxableIncome * (assumptions.stateIncomeShare / 100);
  let tax = 0;
  if (assumptions.stateBrackets) {
    tax = assumptions.stateBrackets.reduce((sum, [floor, ceiling, rate]) => {
      if (apportionedIncome <= floor) return sum;
      return sum + (Math.min(apportionedIncome, ceiling) - floor) * rate;
    }, 0);
  } else {
    tax = Math.max(0, apportionedIncome - assumptions.stateFloor) * (assumptions.stateRate / 100);
  }
  return Math.max(0, tax - assumptions.otherStateTaxCredit);
}

function localTax(taxableIncome, assumptions) {
  return Math.max(0, taxableIncome * (assumptions.stateIncomeShare / 100) * (assumptions.localTaxRate / 100));
}

function qbiDeduction(passThrough, taxableBeforeQbi, assumptions) {
  if (assumptions.qbiMode !== "full") return 0;
  return Math.max(0, Math.min(passThrough * 0.2, taxableBeforeQbi * 0.2));
}

function retirementContributionDetails(entity, assumptions, businessProfit, salary, plan) {
  if (plan === "none") return { total: 0, employee: 0, employer: 0 };
  const annualAdditionsCap = Math.max(0, assumptions.retirementCap);

  if (entity === "selfEmployed") {
    const earnedIncome = Math.min(
      RETIREMENT_COMPENSATION_LIMIT,
      Math.max(0, businessProfit - selfEmploymentTax(businessProfit, assumptions.filingStatus, assumptions.otherIncome) / 2),
    );
    const employer = Math.min(earnedIncome * 0.2, annualAdditionsCap, earnedIncome);
    if (plan === "sep") return { total: employer, employee: 0, employer };
    const autoEmployee = Math.min(SOLO_401K_EMPLOYEE_LIMIT, earnedIncome);
    const employee = Math.min(assumptions.employeeDeferral || autoEmployee, autoEmployee);
    const total = Math.min(annualAdditionsCap, earnedIncome, employer + employee);
    const adjustedEmployee = Math.min(employee, total);
    return { total, employee: adjustedEmployee, employer: Math.max(0, total - adjustedEmployee) };
  }

  const compensation = Math.min(RETIREMENT_COMPENSATION_LIMIT, Math.max(0, salary));
  const employer = Math.min(compensation * 0.25, annualAdditionsCap, compensation);
  if (plan === "sep") return { total: employer, employee: 0, employer };
  const autoEmployee = Math.min(SOLO_401K_EMPLOYEE_LIMIT, compensation);
  const employee = Math.min(assumptions.employeeDeferral || autoEmployee, autoEmployee);
  const total = Math.min(annualAdditionsCap, compensation, employer + employee);
  const adjustedEmployee = Math.min(employee, total);
  return { total, employee: adjustedEmployee, employer: Math.max(0, total - adjustedEmployee) };
}

function sCorpSalaryCandidates(net, assumptions) {
  if (net <= 0) return [0];
  if (assumptions.salary > 0) return [Math.min(assumptions.salary, net)];

  const salaryFromSpending = Math.min(net, Math.max(0, assumptions.annualSpending));
  return [Math.round(salaryFromSpending / 1000) * 1000];
}

function calculateScenario(type, gross, assumptions, yearIndex = 0) {
  const expense = Math.min(gross, assumptions.expenses);
  const net = Math.max(0, gross - expense);
  const health = assumptions.healthPremiums;
  const isS = type.startsWith("sCorp");
  const isPlainLlc = type.startsWith("llc");
  const isNoStructure = type.startsWith("noStructure");
  const includeRetirement = type.includes("Retirement");
  const salaryCandidates = isS ? sCorpSalaryCandidates(net, assumptions) : [0];

  function solveForSalary(salary) {
    const setupCost = yearIndex === 0 ? (isS ? assumptions.sCorpSetupCost : isPlainLlc ? assumptions.llcSetupCost : 0) : 0;
    const structureCost = (isS ? assumptions.adminCost : isPlainLlc ? assumptions.llcAdminCost : 0) + setupCost;
    const adminCost = Math.min(structureCost, Math.max(0, net - salary));

    function compute(retirementDetails = { total: 0, employee: 0, employer: 0 }, planUsed = "None", desiredRetirement = retirementDetails.total) {
      const retirement = retirementDetails.total;
      const employeeRetirement = retirementDetails.employee;
      const employerRetirement = retirementDetails.employer;
      const payrollParts = isS ? ficaTaxParts(salary, assumptions.filingStatus, assumptions.otherIncome) : { employee: 0, employer: 0 };
      const payroll = payrollParts.employee + payrollParts.employer;
      const scheduleCBeforeRetirement = isS ? 0 : Math.max(0, net - adminCost);
      const k1 = isS ? Math.max(0, net - salary - adminCost - payrollParts.employer - employerRetirement - health) : 0;
      const scheduleC = scheduleCBeforeRetirement;
      const seTax = isS ? 0 : selfEmploymentTax(scheduleCBeforeRetirement, assumptions.filingStatus, assumptions.otherIncome);
      const halfSeDeduction = isS ? 0 : seTax / 2;
      const taxableSalary = Math.max(0, salary - employeeRetirement);
      const selfEmployedRetirement = isS ? 0 : retirement;
      const healthDeduction = isS ? 0 : health;
      const agi = assumptions.otherIncome + taxableSalary + k1 + scheduleC - halfSeDeduction - selfEmployedRetirement - healthDeduction;
      const deduction =
        assumptions.federalDeductionOverride > 0
          ? assumptions.federalDeductionOverride
          : FEDERAL[assumptions.filingStatus].standardDeduction;
      const beforeQbi = Math.max(0, agi - deduction);
      const qbi = qbiDeduction(isS ? k1 : scheduleC, beforeQbi, assumptions);
      const taxable = Math.max(0, beforeQbi - qbi);
      const federal = federalTax(taxable, assumptions.filingStatus);
      const state = stateTax(taxable, assumptions);
      const local = localTax(taxable, assumptions);
      const totalTax = federal + state + local + payroll + seTax;
      const cashRetained = gross - expense - adminCost - health - retirement - totalTax;
      const personalSpending = Math.min(assumptions.annualSpending, Math.max(0, cashRetained));
      const nearTermReserveTarget = assumptions.nearTermCashNeed / Math.max(1, assumptions.yearCount);
      const bigPurchaseReserveTarget = assumptions.bigPurchases
        .filter((purchase) => purchase.year === yearIndex + 1)
        .reduce((sum, purchase) => sum + purchase.amount, 0);
      const totalReserveTarget = nearTermReserveTarget + bigPurchaseReserveTarget;
      const nearTermReserveFunded = Math.min(
        nearTermReserveTarget,
        Math.max(0, cashRetained - assumptions.annualSpending),
      );
      const bigPurchaseReserveFunded = Math.min(
        bigPurchaseReserveTarget,
        Math.max(0, cashRetained - assumptions.annualSpending - nearTermReserveFunded),
      );
      const retirementFundingCushion = cashRetained - assumptions.annualSpending - totalReserveTarget;
      const cashAfterSpending = cashRetained - assumptions.annualSpending - bigPurchaseReserveTarget;
      const wealthRetained = cashRetained + retirement;
      const wealthAfterSpending = wealthRetained - assumptions.annualSpending;

      return {
        type,
        gross,
        expense,
        net,
        salary,
        salaryAuto: isS && assumptions.salary <= 0,
        noStructure: isNoStructure,
        adminCost,
        setupCost,
        retirement,
        employeeRetirement,
        employerRetirement,
        desiredRetirement,
        retirementPlanUsed: planUsed,
        health,
        personalSpending,
        nearTermReserveTarget,
        nearTermReserveFunded,
        bigPurchaseReserveTarget,
        bigPurchaseReserveFunded,
        totalReserveTarget,
        retirementFundingCushion,
        cashAfterSpending,
        wealthAfterSpending,
        liquidityGap: Math.max(0, -cashAfterSpending),
        retirementLiquidityGap: Math.max(0, -retirementFundingCushion),
        retirementLimited: desiredRetirement - retirement > 1,
        k1,
        scheduleC,
        payroll,
        seTax,
        halfSeDeduction,
        agi,
        taxable,
        qbi,
        federal,
        state,
        local,
        employerPayroll: payrollParts.employer,
        employeePayroll: payrollParts.employee,
        totalTax,
        cashRetained,
        wealthRetained,
        effectiveRate: gross ? totalTax / gross : 0,
      };
    }

    function solveForPlan(plan) {
      const businessProfitForRetirement = isS ? Math.max(0, net - adminCost) : Math.max(0, net - adminCost);
      const desiredDetails = includeRetirement
        ? retirementContributionDetails(isS ? "sCorp" : "selfEmployed", assumptions, businessProfitForRetirement, salary, plan)
        : { total: 0, employee: 0, employer: 0 };
      const desiredRetirement = desiredDetails.total;
      const planLabel = plan === "solo401k" ? "Solo 401(k)" : plan === "sep" ? "SEP-IRA" : "None";
      const scaleDetails = (total) => {
        if (desiredRetirement <= 0) return { total: 0, employee: 0, employer: 0 };
        const ratio = total / desiredRetirement;
        return {
          total,
          employee: desiredDetails.employee * ratio,
          employer: desiredDetails.employer * ratio,
        };
      };
      let row = compute(desiredDetails, planLabel, desiredRetirement);
      if (includeRetirement && desiredRetirement > 0 && row.retirementFundingCushion < 0) {
        const zeroContribution = compute({ total: 0, employee: 0, employer: 0 }, planLabel, desiredRetirement);
        if (zeroContribution.retirementFundingCushion >= 0) {
          let low = 0;
          let high = desiredRetirement;
          for (let i = 0; i < 22; i += 1) {
            const mid = (low + high) / 2;
            if (compute(scaleDetails(mid), planLabel, desiredRetirement).retirementFundingCushion >= 0) low = mid;
            else high = mid;
          }
          row = compute(scaleDetails(low), planLabel, desiredRetirement);
        } else {
          row = zeroContribution;
        }
      }
      return row;
    }

    if (!includeRetirement) return compute({ total: 0, employee: 0, employer: 0 }, "None", 0);

    if (assumptions.retirementPlan === "auto") {
      return ["sep", "solo401k"]
        .map((plan) => solveForPlan(plan))
        .sort((a, b) => {
          const wealthSpread = b.wealthAfterSpending - a.wealthAfterSpending;
          if (Math.abs(wealthSpread) > 1) return wealthSpread;
          return b.retirement - a.retirement;
        })[0];
    }

    return solveForPlan(assumptions.retirementPlan);
  }

  return salaryCandidates
    .map((salary) => solveForSalary(salary))
    .sort((a, b) => {
      const wealthSpread = b.wealthAfterSpending - a.wealthAfterSpending;
      if (Math.abs(wealthSpread) > 1) return wealthSpread;
      return a.salary - b.salary;
    })[0];
}

function getAssumptions() {
  const yearCount = num("yearCount");
  const incomes = [...document.querySelectorAll("[data-income-year]")]
    .slice(0, yearCount)
    .map((input) => parseInputNumber(input.value));
  const selectedState = STATE_PRESETS.find((state) => state.id === els.statePreset.value) || STATE_PRESETS[0];
  const bigPurchases = Array.from({ length: MAX_BIG_PURCHASES }, (_, index) => {
    const purchaseIndex = index + 1;
    const purchaseIds = bigPurchaseIds(purchaseIndex);
    return {
      amount: num(purchaseIds.amount),
      year: Math.min(yearCount, Math.max(1, num(purchaseIds.year))),
    };
  }).filter((purchase) => purchase.amount > 0);
  const totalBigPurchaseAmount = bigPurchases.reduce((sum, purchase) => sum + purchase.amount, 0);

  return {
    incomes,
    yearCount,
    selectedState,
    stateBrackets: selectedState.brackets,
    filingStatus: els.filingStatus.value,
    otherIncome: num("otherIncome"),
    annualSpending: num("annualSpending"),
    nearTermCashNeed: num("nearTermCashNeed"),
    bigPurchases,
    bigPurchaseAmount: totalBigPurchaseAmount,
    bigPurchaseYear: bigPurchases[0]?.year || Math.min(yearCount, Math.max(1, num("bigPurchaseYear"))),
    expenses: num("expenses"),
    salary: num("salary"),
    llcAdminCost: num("llcAdminCost"),
    adminCost: num("adminCost"),
    llcSetupCost: num("llcSetupCost"),
    sCorpSetupCost: num("sCorpSetupCost"),
    localTaxRate: num("localTaxRate"),
    stateIncomeShare: num("stateIncomeShare"),
    federalDeductionOverride: num("federalDeductionOverride"),
    otherStateTaxCredit: num("otherStateTaxCredit"),
    salaryFloorPct: num("salaryFloorPct"),
    stateRate: num("stateRate"),
    stateFloor: num("stateFloor"),
    qbiMode: els.qbiMode.value,
    retirementPlan: els.retirementPlan.value,
    employeeDeferral: num("employeeDeferral"),
    retirementCap: num("retirementCap"),
    healthPremiums: parseInputNumber(els.healthPremiums.value),
  };
}

function totals(rows) {
  return rows.reduce((sum, row) => {
    Object.entries(row).forEach(([key, value]) => {
      if (typeof value === "number") sum[key] = (sum[key] || 0) + value;
    });
    return sum;
  }, {});
}

function chooseBest(keys, scenarioTotals) {
  return keys
    .map((key) => [key, scenarioTotals[key]])
    .sort((a, b) => {
      const wealthSpread = b[1].wealthAfterSpending - a[1].wealthAfterSpending;
      if (Math.abs(wealthSpread) > 1) return wealthSpread;
      return a[1].totalTax - b[1].totalTax;
    })[0];
}

function planMix(rows) {
  const plans = [...new Set(rows.map((row) => row.retirementPlanUsed).filter((plan) => plan && plan !== "None"))];
  if (plans.length === 0) return "None";
  return plans.join(" / ");
}

function advancedAssumptionNote(a) {
  const active = [];
  if (a.llcSetupCost > 0 || a.sCorpSetupCost > 0) active.push("entity setup costs");
  if (a.localTaxRate > 0) active.push("local income tax");
  if (a.stateIncomeShare !== 100) active.push("state taxable share");
  if (a.federalDeductionOverride > 0) active.push("federal deduction override");
  if (a.otherStateTaxCredit > 0) active.push("other-state tax credit");
  if (a.salaryFloorPct > 0) active.push("salary floor override");
  if (active.length === 0) return "";
  return `<li><strong>Additional assumptions active:</strong> ${active.join(", ")} are included in the optimization.</li>`;
}

function recommendStructure(assumptions, scenarios, scenarioTotals) {
  const simple = chooseBest(["llc", "llcRetirement"], scenarioTotals);
  const sCorp = chooseBest(["sCorp", "sCorpRetirement"], scenarioTotals);
  const all = chooseBest(Object.keys(scenarioTotals), scenarioTotals);
  const sCorpNetBenefit = sCorp[1].wealthAfterSpending - simple[1].wealthAfterSpending;
  const hasLiquidityGap = scenarios[sCorp[0]].some((row) => row.cashAfterSpending < 0);
  const clearsFees = sCorpNetBenefit > 0;
  const recommended = clearsFees && !hasLiquidityGap ? sCorp : simple;

  let reason = "The recommendation is based on after-tax wealth after planned spending and modeled structure fees, not tax savings alone.";
  if (recommended[0].startsWith("sCorp")) {
    reason = `The S-corp path produces ${money(sCorpNetBenefit)} more after-spending wealth after modeled setup/admin costs.`;
  } else if (hasLiquidityGap && sCorpNetBenefit > 0) {
    reason = "The S-corp/retirement path shows tax value, but the spending need creates a cash shortfall in at least one modeled year.";
  } else if (sCorpNetBenefit > 0) {
    reason = `The S-corp path improves after-spending wealth by ${money(sCorpNetBenefit)}, but the cash/liquidity screen prevents recommending it.`;
  } else if (recommended[0].startsWith("llc")) {
    reason = "The LLC is the best simpler structure after entity cost, spending needs, and retirement feasibility.";
  } else {
    reason = "The LLC keeps more after-spending wealth once entity cost, payroll, retirement feasibility, and spending are included.";
  }

  return {
    key: recommended[0],
    bestTaxKey: Object.entries(scenarioTotals).sort((a, b) => a[1].totalTax - b[1].totalTax)[0][0],
    allBestKey: all[0],
    simpleKey: simple[0],
    sCorpKey: sCorp[0],
    value: recommended[1],
    sCorpNetBenefit,
    clearsFees,
    hasLiquidityGap,
    reason,
  };
}

function buildModel() {
  const assumptions = getAssumptions();
  const names = {
    noStructure: "Without Strategy",
    llc: "LLC",
    llcRetirement: "LLC + Retirement",
    sCorp: "S-Corp",
    sCorpRetirement: "S-Corp + Max Retirement",
  };
  const scenarios = Object.fromEntries(
    Object.keys(names).map((key) => [
      key,
      assumptions.incomes.map((gross, index) => calculateScenario(key, gross, assumptions, index)),
    ]),
  );

  const scenarioTotals = Object.fromEntries(
    Object.entries(scenarios).map(([key, rows]) => [key, { ...totals(rows), label: names[key] }]),
  );
  const ranked = Object.entries(scenarioTotals).sort((a, b) => a[1].totalTax - b[1].totalTax);
  const recommendation = recommendStructure(assumptions, scenarios, scenarioTotals);

  return { assumptions, scenarios, scenarioTotals, ranked, recommendation };
}

function renderIncomeInputs() {
  const current = [...document.querySelectorAll("[data-income-year]")].map((input) => parseInputNumber(input.value));
  const selectedYears = Number(els.yearCount.value || DEFAULTS.yearCount);
  incomeInputs.innerHTML = "";
  for (let i = 0; i < selectedYears; i += 1) {
    const label = document.createElement("label");
    label.innerHTML = `<span class="label-text">Year ${i + 1} <span class="info-dot" tabindex="0" data-info="Projected gross NIL income before business expenses for this year.">i</span></span><input data-income-year="${i}" type="text" inputmode="numeric" data-money value="${formatInputNumber(current[i] ?? DEFAULTS.incomes[i])}" />`;
    incomeInputs.appendChild(label);
  }
  bindMoneyInputs();
}

function bindMoneyInputs() {
  document.querySelectorAll("[data-money]").forEach((input) => {
    input.value = input.value === "" ? "" : formatInputNumber(input.value);
    if (input.dataset.moneyBound) return;
    input.dataset.moneyBound = "true";
    input.addEventListener("input", () => {
      if (input.value === "") {
        render();
        return;
      }
      input.value = formatInputNumber(input.value);
      render();
    });
    input.addEventListener("blur", () => {
      input.value = formatInputNumber(input.value);
      render();
    });
  });
}

function renderPurchaseYearOptions() {
  const selectedYears = Number(els.yearCount.value || DEFAULTS.yearCount);
  document.querySelectorAll(".big-purchase-year").forEach((select) => {
    const current = Math.min(selectedYears, Math.max(1, Number(select.value || DEFAULTS.bigPurchaseYear)));
    select.innerHTML = Array.from(
      { length: selectedYears },
      (_, index) => `<option value="${index + 1}">Year ${index + 1}</option>`,
    ).join("");
    select.value = current;
  });
}

function updateBigPurchaseButton() {
  const rows = [...document.querySelectorAll(".big-purchase-row")];
  const addButton = document.getElementById("addBigPurchase");
  addButton.disabled = rows.every((row) => !row.classList.contains("is-hidden"));
}

function addBigPurchaseRow() {
  const nextRow = [...document.querySelectorAll(".big-purchase-row")].find((row) =>
    row.classList.contains("is-hidden"),
  );
  if (!nextRow) return;
  nextRow.classList.remove("is-hidden");
  updateBigPurchaseButton();
  bindMoneyInputs();
  renderPurchaseYearOptions();
  render();
}

function renderMetrics(model) {
  const best = model.recommendation.value;
  const retirement = model.scenarioTotals.sCorpRetirement;
  const sCorp = model.scenarioTotals.sCorp;
  const llc = model.scenarioTotals.llc;
  const metrics = [
    ["Total NIL modeled", money(llc.gross)],
    ["Recommended tax burden", money(best.totalTax)],
    ["Effective tax rate", pct(best.totalTax / Math.max(1, best.gross))],
    ["After-spending wealth incl. reserve", money(best.wealthAfterSpending)],
    ["S-corp payroll taxes", money(sCorp.payroll)],
    ["LLC-only entity cost", money(llc.adminCost)],
    ["LLC self-employment tax", money(llc.seTax)],
    ["Retirement funded", money(retirement.retirement)],
  ];

  document.getElementById("metricGrid").innerHTML = metrics
    .map(([label, value]) => `<div class="metric"><span>${label}</span><strong>${value}</strong></div>`)
    .join("");

  const retirementMetrics = [
    ["LLC retirement funded", money(model.scenarioTotals.llcRetirement.retirement)],
    ["S-Corp retirement funded", money(model.scenarioTotals.sCorpRetirement.retirement)],
    ["LLC plan selected", planMix(model.scenarios.llcRetirement)],
    ["S-Corp plan selected", planMix(model.scenarios.sCorpRetirement)],
    ["Retirement tax impact", money(model.scenarioTotals.sCorp.totalTax - model.scenarioTotals.sCorpRetirement.totalTax)],
    ["Wealth after spending incl. reserve", money(model.scenarioTotals.sCorpRetirement.wealthAfterSpending)],
    ["Cash after spending/purchases", money(model.scenarioTotals.sCorpRetirement.cashAfterSpending)],
    ["Total tax with retirement", money(model.scenarioTotals.sCorpRetirement.totalTax)],
  ];

  document.getElementById("retirementMetricGrid").innerHTML = retirementMetrics
    .map(([label, value]) => `<div class="metric"><span>${label}</span><strong>${value}</strong></div>`)
    .join("");
}

function renderPlayerSummary(model) {
  const rec = model.recommendation;
  const best = rec.value;
  const noStructure = model.scenarioTotals.noStructure;
  const llc = model.scenarioTotals.llc;
  const sCorp = model.scenarioTotals.sCorp;
  const llcRetirement = model.scenarioTotals.llcRetirement;
  const sCorpRetirement = model.scenarioTotals.sCorpRetirement;
  const recommendationLift = best.wealthAfterSpending - noStructure.wealthAfterSpending;
  const taxDifference = noStructure.totalTax - best.totalTax;
  const totalIncome = llc.gross;
  const selectedIsS = rec.key.startsWith("sCorp");
  const selectedIsLlc = rec.key.startsWith("llc");
  const selectedHasRetirement = rec.key.includes("Retirement");
  const selectedBase = selectedIsS ? sCorp : llc;
  const selectedRetirement = selectedIsS ? sCorpRetirement : llcRetirement;
  const selectedRetirementLift = selectedRetirement.wealthAfterSpending - selectedBase.wealthAfterSpending;
  const entityBullet = selectedIsS
    ? `S-Corp is recommended because it produces more after-spending wealth than LLC after payroll, admin/setup costs, and the optimized salary assumption.`
    : `LLC is recommended because S-Corp does not produce enough additional after-spending wealth after payroll, admin/setup costs, salary requirements, and cash needs.`;
  const retirementBullet = selectedHasRetirement
    ? `The recommendation includes ${planMix(model.scenarios[rec.key])}, adding ${money(Math.max(0, selectedRetirementLift))} of modeled wealth versus the same entity without retirement.`
    : `The recommendation does not include a retirement account because the current inputs favor cash/liquidity over locking funds into retirement.`;
  const doingNothingBullet =
    recommendationLift >= 0
      ? `The recommended strategy improves projected wealth by ${money(recommendationLift)} and changes total tax by ${money(taxDifference)} versus taking NIL income with no structure or retirement strategy.`
      : `Without Strategy retains ${money(Math.abs(recommendationLift))} more projected wealth under these inputs, so the model is signaling that structure or retirement complexity may not be justified.`;
  const reserveText = [
    model.assumptions.nearTermCashNeed > 0 ? `${money(model.assumptions.nearTermCashNeed)} retained for 10-year liquidity` : "",
    model.assumptions.bigPurchaseAmount > 0
      ? `${money(model.assumptions.bigPurchaseAmount)} for modeled big purchases`
      : "",
  ].filter(Boolean);
  const reservePhrase = reserveText.length ? ` while keeping ${reserveText.join(" plus ")}` : "";
  const cashBullet =
    best.cashAfterSpending >= 0
      ? `After planned spending and purchases${reservePhrase}, the recommended path leaves ${money(best.cashAfterSpending)} of modeled available cash.`
      : `The recommended path still shows a ${money(best.liquidityGap)} cash gap after spending and planned purchases, so the player should reduce retirement funding before implementing.`;
  const planBullet = selectedHasRetirement
    ? `Plan selected: ${planMix(model.scenarios[rec.key])}. Contributions are cash-aware and are reduced when they interfere with spending, 10-year liquidity, or big-purchase inputs.`
    : `Plan selected: none in the top recommendation. The retirement comparison remains available in Advanced analysis.`;
  const actionItems = [
    selectedIsS ? "Form LLC and elect S-Corp tax treatment" : "Use LLC tax treatment",
    selectedHasRetirement ? `Use ${planMix(model.scenarios[rec.key])}` : "Skip retirement account for now",
    `Reserve ${money(model.assumptions.annualSpending)} per year for spending`,
    model.assumptions.nearTermCashNeed > 0 ? `Keep ${money(model.assumptions.nearTermCashNeed)} available as a 10-year liquidity target` : "No extra 10-year liquidity target modeled",
    model.assumptions.bigPurchaseAmount > 0 ? `Keep ${money(model.assumptions.bigPurchaseAmount)} available for big purchases` : "No big purchase reserve modeled",
  ];

  document.getElementById("playerSummary").innerHTML = `
    <div class="player-hero">
      <span class="eyebrow">Best recommendation</span>
      <h2>${best.label}</h2>
      <p>${rec.reason}</p>
    </div>
    <div class="action-strip">
      ${actionItems.map((item) => `<div>${item}</div>`).join("")}
    </div>
    <div class="player-impact-compare">
      <div class="compare-head">
        <span>Path</span>
        <span>Total NIL modeled</span>
        <span>Total tax</span>
        <span>Change vs. without strategy</span>
        <span>Cash after spending/purchases</span>
        <span>Wealth after spending incl. reserve</span>
      </div>
      <div class="compare-row">
        <strong>Without Strategy</strong>
        <div><span>Total NIL modeled</span><strong>${money(totalIncome)}</strong></div>
        <div><span>Total tax</span><strong>${money(noStructure.totalTax)}</strong></div>
        <div><span>Change vs. without strategy</span><strong>${money(0)}</strong></div>
        <div><span>Cash after spending/purchases</span><strong>${money(noStructure.cashAfterSpending)}</strong></div>
        <div><span>Wealth after spending incl. reserve</span><strong>${money(noStructure.wealthAfterSpending)}</strong></div>
      </div>
      <div class="compare-row recommended-row">
        <strong>${best.label}</strong>
        <div><span>Total NIL modeled</span><strong>${money(totalIncome)}</strong></div>
        <div><span>Total tax</span><strong>${money(best.totalTax)}</strong></div>
        <div><span>Change vs. without strategy</span><strong>${money(recommendationLift)}</strong></div>
        <div><span>Cash after spending/purchases</span><strong>${money(best.cashAfterSpending)}</strong></div>
        <div><span>Wealth after spending incl. reserve</span><strong>${money(best.wealthAfterSpending)}</strong></div>
      </div>
    </div>
    <div class="player-explain">
      <h3>What this means for the player</h3>
      <ul>
        <li><strong>Entity decision:</strong> ${entityBullet}</li>
        <li><strong>Compared with doing nothing:</strong> ${doingNothingBullet}</li>
        <li><strong>Retirement decision:</strong> ${retirementBullet}</li>
        <li><strong>Cash constraint:</strong> ${cashBullet}</li>
        <li><strong>Plan selected:</strong> ${planBullet}</li>
      </ul>
    </div>
  `;
}

function renderNarrative(model) {
  const bestKey = model.recommendation.key;
  const best = model.recommendation.value;
  const llc = model.scenarioTotals.llc;
  const sCorp = model.scenarioTotals.sCorp;
  const sCorpRetirement = model.scenarioTotals.sCorpRetirement;
  const retirementExtra = sCorp.totalTax - sCorpRetirement.totalTax;
  const retirementName =
    model.assumptions.retirementPlan === "auto"
      ? `Auto-selected ${planMix(model.scenarios.sCorpRetirement)}`
      : model.assumptions.retirementPlan === "solo401k"
        ? "Solo 401(k)"
        : model.assumptions.retirementPlan === "sep"
          ? "SEP-IRA"
        : "No retirement plan";
  const retirementLimited = Object.values(model.scenarios).some((rows) => rows.some((row) => row.retirementLimited));

  document.getElementById("narrative").innerHTML = `
    <p>
      This analysis evaluates ${money(llc.gross)} of projected NIL income over ${model.assumptions.yearCount}
      year${model.assumptions.yearCount > 1 ? "s" : ""}, with ${money(model.assumptions.annualSpending)} of annual
      personal spending modeled as an owner cash/salary need before determining how much cash can realistically be retained or contributed to retirement.
      Page 1 compares LLC against S-Corp before any retirement-account strategy is used.
    </p>
    <div class="memo-callout">
      <div>
        <span class="eyebrow">Recommended</span>
        <strong>${best.label}</strong>
      </div>
      <div>${money(best.totalTax)} total tax; ${money(best.wealthAfterSpending)} wealth after spending</div>
    </div>
    <ul>
      <li><strong>Recommendation rule:</strong> S-corp must beat LLC after modeled setup/admin costs, planned spending, and retirement feasibility.</li>
      <li><strong>Why not always S-corp:</strong> low NIL income, high spending needs, high compliance cost, or a higher reasonable salary can erase the benefit.</li>
      <li><strong>LLC treatment:</strong> a single-member LLC generally keeps Schedule C / self-employment tax treatment unless it makes an S-corp election. The LLC can still be useful for liability separation, contracts, banking, and recordkeeping.</li>
      <li><strong>S-corp mechanics:</strong> the player-owner takes a defensible W-2 salary, and remaining profit is K-1 pass-through income that may be retained inside the structure or distributed later; it is generally not subject to self-employment tax.</li>
      <li><strong>Reasonable salary risk:</strong> the app links S-corp W-2 salary to the annual personal spending input unless an override is entered. That salary should still be reviewed for reasonable-compensation support.</li>
      <li><strong>Retirement layer:</strong> the modeled ${retirementName} adds ${money(sCorpRetirement.retirement)} of tax-deferred savings and ${money(Math.max(0, retirementExtra))} of additional tax reduction versus S-corp alone.${retirementLimited ? " Contributions were reduced where spending needs made the maximum contribution unrealistic." : ""}</li>
      <li><strong>QBI / Section 199A:</strong> this model defaults to zero because high-income athletics and endorsement work may be treated conservatively as SSTB-like personal services; toggle it only with advisor support.</li>
      <li><strong>State planning:</strong> the model uses the selected ${model.assumptions.selectedState.name} schedule for ordinary NIL income.${model.assumptions.selectedState.note ? ` ${model.assumptions.selectedState.note}` : ""} Residency, duty days, source income, and local taxes can change the result.</li>
      ${advancedAssumptionNote(model.assumptions)}
    </ul>
  `;

  document.getElementById("retirementNarrative").innerHTML = `
    <p>
      Page 2 adds the retirement-account layer to the same LLC vs. S-Corp comparison. The model selects the
      best available deductible retirement strategy based on the selected income, spending need, compensation, and cash
      constraints.
    </p>
    <ul>
      <li><strong>Auto retirement selection:</strong> the model compares SEP-IRA and Solo 401(k) each year and uses the stronger result for retained wealth.</li>
      <li><strong>Cash-aware funding:</strong> if the planned annual spending from owner salary/cash would create a shortfall, the contribution is reduced before the recommendation is calculated.</li>
      <li><strong>Compensation link:</strong> S-Corp retirement funding depends heavily on the W-2 salary tied to annual spending or entered as an override.</li>
      <li><strong>Implementation note:</strong> plan documents, employee status, deadlines, and advisor setup should be confirmed before relying on any retirement contribution estimate.</li>
    </ul>
  `;
}

function renderScenarioTable(model, tableId, scenarioOrder, rows) {
  const headers = ["Line item"];
  scenarioOrder.forEach((key) => {
    model.scenarios[key].forEach((_, index) => headers.push(`${model.scenarioTotals[key].label} Y${index + 1}`));
  });

  const body = rows
    .map(([label, accessor, format]) => {
      const rawValues = scenarioOrder.flatMap((key) =>
        model.scenarios[key].map((row) => (typeof accessor === "function" ? accessor(row) : row[accessor])),
      );
      const allZeroMoneyRow =
        format !== "text" &&
        format !== "percent" &&
        rawValues.every((value) => Math.abs(Number(value) || 0) < 0.5);
      if (allZeroMoneyRow) return "";

      const cells = rawValues.map((value) => {
        if (format === "percent") return pct(value);
        if (format === "text") return value;
        return money(value);
      });
      return `<tr><td>${label}</td>${cells.map((cell) => `<td>${cell}</td>`).join("")}</tr>`;
    })
    .join("");

  document.getElementById(tableId).innerHTML = `
    <thead><tr>${headers.map((header) => `<th>${header}</th>`).join("")}</tr></thead>
    <tbody>${body}</tbody>
  `;
}

function renderTables(model) {
  const baseRows = [
    ["Gross NIL income", "gross"],
    ["Business expenses", "expense"],
    ["W-2 salary to owner", "salary"],
    ["K-1 pass-through profit / Sch C net", (row) => row.k1 || row.scheduleC],
    ["Entity admin cost", "adminCost"],
    ["One-time setup cost", "setupCost"],
    ["SE / payroll tax", (row) => row.seTax + row.payroll],
    ["1/2 SE deduction", (row) => -row.halfSeDeduction],
    ["AGI", "agi"],
    ["QBI deduction", (row) => -row.qbi],
    ["Taxable income", "taxable"],
    ["Federal income tax", "federal"],
    ["State income tax", "state"],
    ["Local income tax", "local"],
    ["Total tax", "totalTax"],
    ["Effective rate", (row) => row.effectiveRate, "percent"],
    ["Cash retained", "cashRetained"],
    ["Personal spending from owner cash", (row) => -model.assumptions.annualSpending],
    ["Available 10-year cash reserve", "nearTermReserveTarget"],
    ["Big purchase reserve", (row) => -row.bigPurchaseReserveTarget],
    ["Cash after spending/purchases", "cashAfterSpending"],
    ["Wealth retained incl. retirement", "wealthRetained"],
    ["Wealth after spending incl. 10-year reserve", "wealthAfterSpending"],
  ];

  const retirementRows = [
    ["Gross NIL income", "gross"],
    ["Business expenses", "expense"],
    ["W-2 salary to owner", "salary"],
    ["Retirement plan selected", "retirementPlanUsed", "text"],
    ["Retirement contribution", "retirement"],
    ["K-1 pass-through profit / Sch C net", (row) => row.k1 || row.scheduleC],
    ["Entity admin cost", "adminCost"],
    ["One-time setup cost", "setupCost"],
    ["Health premium strategy", "health"],
    ["SE / payroll tax", (row) => row.seTax + row.payroll],
    ["1/2 SE deduction", (row) => -row.halfSeDeduction],
    ["Taxable income", "taxable"],
    ["Federal income tax", "federal"],
    ["State income tax", "state"],
    ["Local income tax", "local"],
    ["Total tax", "totalTax"],
    ["Effective rate", (row) => row.effectiveRate, "percent"],
    ["Cash retained", "cashRetained"],
    ["Personal spending from owner cash", (row) => -model.assumptions.annualSpending],
    ["Available 10-year cash reserve", "nearTermReserveTarget"],
    ["Big purchase reserve", (row) => -row.bigPurchaseReserveTarget],
    ["Cash after spending/purchases", "cashAfterSpending"],
    ["Wealth retained incl. retirement", "wealthRetained"],
    ["Wealth after spending incl. 10-year reserve", "wealthAfterSpending"],
  ];

  renderScenarioTable(model, "baseComparisonTable", ["llc", "sCorp"], baseRows);
  renderScenarioTable(model, "retirementComparisonTable", ["llcRetirement", "sCorpRetirement"], retirementRows);
  document.getElementById("baseTableNote").textContent =
    `* Page 1 excludes retirement-account contributions. Entity/admin/setup costs, payroll/self-employment tax, ${model.assumptions.selectedState.name} state tax, local tax overrides, and planned spending are included.`;
  document.getElementById("retirementTableNote").textContent =
    `* Page 2 adds the optimized retirement account strategy. SEP-IRA and Solo 401(k) are compared automatically unless overridden in Advanced inputs; contributions are capped by account type and reduced when planned spending requires owner cash.`;
}

function renderStrategyCards(model) {
  const target = document.getElementById("strategyCards");
  if (!target) return;
  const a = model.assumptions;
  const totalIncome = model.scenarioTotals.llc.gross;
  const sCorpSavings = model.recommendation.sCorpNetBenefit;
  const retirementSavings = model.scenarioTotals.sCorp.totalTax - model.scenarioTotals.sCorpRetirement.totalTax;
  const selected = model.recommendation.value;
  const cards = [
    {
      tone: model.recommendation.key.startsWith("sCorp") ? "good" : "warn",
      title: "Structure call",
      text:
        model.recommendation.key.startsWith("sCorp")
          ? `S-corp wins by ${money(Math.max(0, sCorpSavings))} after spending and modeled structure costs.`
          : `${selected.label} wins because S-corp does not overcome modeled fees and cash needs.`,
    },
    {
      tone: model.recommendation.key.startsWith("llc") ? "good" : "warn",
      title: "LLC treatment",
      text:
        model.recommendation.key.startsWith("llc")
          ? `LLC is favored after its ${money(model.scenarioTotals.llc.adminCost)} modeled entity cost.`
          : `LLC keeps SE tax but avoids S-corp payroll complexity.`,
    },
    {
      tone: model.scenarioTotals.sCorp.salary < totalIncome / Math.max(1, a.yearCount) * 0.2 ? "warn" : "good",
      title: "Reasonable compensation",
      text: `${a.salary > 0 ? "Override salary" : "Auto-selected salary"} averages ${money(model.scenarioTotals.sCorp.salary / Math.max(1, a.yearCount))} per year. For service-heavy NIL deals, document why that wage is reasonable.`,
    },
    {
      tone: retirementSavings > 0 ? "good" : "warn",
      title: "Retirement deferral",
      text:
        a.retirementPlan === "none"
          ? "No retirement deduction is modeled. SEP-IRA or Solo 401(k) can shift income into long-term savings."
          : `The app selected ${planMix(model.scenarios.sCorpRetirement)} and funded about ${money(model.scenarioTotals.sCorpRetirement.retirement)}, subject to cash needs.`,
    },
    {
      tone: "good",
      title: "Retirement menu",
      text: "SEP-IRA and Solo 401(k) are the core deductible options; cash balance plans are only for very high, durable income.",
    },
    {
      tone: selected.cashAfterSpending >= 0 ? "good" : "bad",
      title: "Spending feasibility",
      text:
        selected.cashAfterSpending >= 0
          ? `Recommended path leaves ${money(selected.cashAfterSpending)} after planned spending and big purchases, with the 10-year cash reserve still available.`
          : `Recommended path still has a ${money(selected.liquidityGap)} gap after planned spending and big purchases.`,
    },
    {
      tone: a.expenses > 0 ? "good" : "warn",
      title: "Business deductions",
      text:
        a.expenses > 0
          ? `The model deducts ${money(a.expenses)} per year. Keep receipts and separate bank records.`
          : "No ordinary business expenses are modeled. Agent, legal, content, travel, and accounting costs may matter.",
    },
    {
      tone: "warn",
      title: "Quarterly payments",
      text: "Large NIL payments can require estimated tax payments. Build a cash reserve before retained entity cash or distributions are spent.",
    },
    {
      tone: "bad",
      title: "Other structures screened",
      text: "C-corp, partnership, trust, and management-company ideas are usually rejected for solo NIL unless a specific advisor-driven reason exists.",
    },
  ];

  target.innerHTML = cards
    .map(
      (card) => `
        <article class="strategy-card ${card.tone}">
          <h3>${card.title}</h3>
          <p>${card.text}</p>
        </article>
      `,
    )
    .join("");
}

function render() {
  const model = buildModel();
  renderPlayerSummary(model);
  renderMetrics(model);
  renderNarrative(model);
  renderTables(model);
  renderStrategyCards(model);
}

function setupInfoDots() {
  function toggleInfoDot(dot) {
    document.querySelectorAll(".info-dot.active").forEach((activeDot) => {
      if (activeDot !== dot) activeDot.classList.remove("active");
    });
    dot.classList.toggle("active");
  }

  document.addEventListener("pointerdown", (event) => {
    if (!event.target.closest(".info-dot")) return;
    event.preventDefault();
  });

  document.addEventListener("click", (event) => {
    const dot = event.target.closest(".info-dot");
    if (dot) {
      event.preventDefault();
      toggleInfoDot(dot);
      event.stopPropagation();
    } else {
      document.querySelectorAll(".info-dot.active").forEach((activeDot) => activeDot.classList.remove("active"));
    }
  });

  document.addEventListener("keydown", (event) => {
    const dot = event.target.closest(".info-dot");
    if (!dot || !["Enter", " "].includes(event.key)) return;
    event.preventDefault();
    toggleInfoDot(dot);
    event.stopPropagation();
  });
}

function reset() {
  Object.entries(DEFAULTS).forEach(([key, value]) => {
    if (key === "incomes") return;
    const el = els[key];
    if (el) el.value = value;
  });
  els.statePreset.value = "al";
  const preset = STATE_PRESETS.find((state) => state.id === els.statePreset.value);
  els.stateRate.value = topStateRate(preset).toFixed(2);
  els.stateFloor.value = formatInputNumber(stateZeroFloor(preset));
  document.querySelectorAll(".big-purchase-row").forEach((row) => row.classList.add("is-hidden"));
  updateBigPurchaseButton();
  renderIncomeInputs();
  renderPurchaseYearOptions();
  document.querySelectorAll("[data-income-year]").forEach((input, index) => {
    input.value = formatInputNumber(DEFAULTS.incomes[index]);
  });
  bindMoneyInputs();
  render();
}

function init() {
  els.statePreset.innerHTML = STATE_PRESETS.map(
    (state) => `<option value="${state.id}">${state.name}</option>`,
  ).join("");
  els.statePreset.value = "al";
  renderIncomeInputs();
  renderPurchaseYearOptions();
  updateBigPurchaseButton();
  ids.forEach((id) => {
    els[id].addEventListener("input", render);
    els[id].addEventListener("change", render);
  });
  document.getElementById("addBigPurchase").addEventListener("click", addBigPurchaseRow);
  els.yearCount.addEventListener("change", () => {
    renderIncomeInputs();
    renderPurchaseYearOptions();
    render();
  });
  ["stateRate", "stateFloor"].forEach((id) => {
    els[id].addEventListener("input", () => {
      els.statePreset.value = "custom";
      render();
    });
  });
  els.statePreset.addEventListener("change", () => {
    const preset = STATE_PRESETS.find((state) => state.id === els.statePreset.value);
    if (!preset || preset.id === "custom") return;
    els.stateRate.value = topStateRate(preset).toFixed(2);
    els.stateFloor.value = formatInputNumber(stateZeroFloor(preset));
    render();
  });
  document.getElementById("printBtn").addEventListener("click", () => window.print());
  setupInfoDots();
  reset();
}

init();
