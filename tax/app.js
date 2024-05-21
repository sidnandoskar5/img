const app = function () {
    const setupFixSalary = (value) => {
        const fixedSalary = Number(value);
        const basicSalary = Math.round(Number(fixedSalary * 0.4));
        const hra = Math.round(Number(basicSalary * 0.5));
        const epf = Math.round(Number(basicSalary * 0.12));
        const gratuity = Math.round(Number(basicSalary * 0.0480759262));
        const extra = Math.round(fixedSalary - (basicSalary + hra + epf + gratuity));

        document.querySelector("#salary-basic").value = basicSalary;
        document.querySelector("#salary-hra").value = hra;
        document.querySelector("#salary-epf").value = epf;
        document.querySelector("#salary-gratuity").value = gratuity;
        document.querySelector("#salary-extra").value = extra;
    }

    const setUpLeavesAmount = (value) => {
        const leavesCount = Math.round(Number(value));
        const encashableLeaves = leavesCount - 10;
        let leavesCash = 0;
        if (encashableLeaves > 0) {
            leavesCash = ((Number(document.querySelector("#salary-basic").value) * encashableLeaves) / (12 * 30.14)).toFixed(2);
        }

        document.querySelector("#leaves-amount").value = leavesCash;
    }

    const setUpAppraisal = (value) => { 
        const apprPer = Number(value);
        if (apprPer === 0) {
            document.querySelector("#fix-future-salary").value = 0;
            document.querySelector("#future-basic").value = 0;
            document.querySelector("#future-hra").value = 0;
            document.querySelector("#future-epf").value = 0;
            document.querySelector("#future-gratuity").value = 0;
            document.querySelector("#future-extra").value = 0;   
        } else {
            const currentFixed = Number(document.querySelector("#fix-salary").value);
            const currentBonus = Number(document.querySelector("#bonus").value);
            const currentTotal = currentFixed + currentBonus;
            const newTotal = currentTotal + ((currentTotal * apprPer) / 100);
            const newFixed = newTotal - currentBonus;

            const basicSalary = Math.round(Number(newFixed * 0.4));
            const hra = Math.round(Number(basicSalary * 0.5));
            const epf = Math.round(Number(basicSalary * 0.12));
            const gratuity = Math.round(Number(basicSalary * 0.0480759262));
            const extra = Math.round(newFixed - (basicSalary + hra + epf + gratuity));

            document.querySelector("#fix-future-salary").value = newFixed;
            document.querySelector("#future-basic").value = basicSalary;
            document.querySelector("#future-hra").value = hra;
            document.querySelector("#future-epf").value = epf;
            document.querySelector("#future-gratuity").value = gratuity;
            document.querySelector("#future-extra").value = extra;   
        }
    }

    const getAprilToMarchCost = (fixed, arraisal) => {
        if (arraisal === 0) {
            return fixed;
        }
        
        const atd = fixed / 12 * 9;
        const jtm = arraisal / 12 * 3;
        return atd + jtm;
    }

    const setupEPF = () => {
        const epf = Number(document.querySelector("#salary-epf").value);
        const newEpf = Number(document.querySelector("#future-epf").value);
        const totalEpf = getAprilToMarchCost(epf, newEpf);
        document.querySelector("#inv-epf").value = totalEpf;
        document.querySelector("#inv-epf").setAttribute("title", `12%: ${totalEpf} | cap of 1800: ${1800*12}`);
    }

    const calculateTax = () => {
        // setup variables
        const limit80c = 150000;

        //fixed
        const basicSalary = Number(document.querySelector("#salary-basic").value);
        const hra = Number(document.querySelector("#salary-hra").value);
        const epf = Number(document.querySelector("#salary-epf").value);
        const gratuity = Number(document.querySelector("#salary-gratuity").value);
        const extra = Number(document.querySelector("#salary-extra").value);

        //appraisal
        const newBasicSalary = Number(document.querySelector("#future-basic").value);
        const newHra = Number(document.querySelector("#future-hra").value);
        const newEpf = Number(document.querySelector("#future-epf").value);
        const newGratuity = Number(document.querySelector("#future-gratuity").value);
        const newExtra = Number(document.querySelector("#future-extra").value);

        //bonus
        const bonus = Number(document.querySelector("#bonus").value);
        
        //arrears
        const arrears = Number(document.querySelector("#arrears").value);

        //leaves
        const leaves = Number(document.querySelector("#leaves-amount").value);

        //HRA
        const isMetro = Number(document.querySelector("#is-metro").value);
        const rentPaid = Number(document.querySelector("#rent").value);

        //80C
        const mf = Number(document.querySelector("#inv-mf").value);
        const ppf = Number(document.querySelector("#inv-ppf").value);
        const epfVal = Number(document.querySelector("#inv-epf").value);
        const lic = Number(document.querySelector("#inv-lic").value);
        const ssy = Number(document.querySelector("#inv-ssy").value);
        const ulip = Number(document.querySelector("#inv-ulip").value);
        const fd = Number(document.querySelector("#inv-fd").value);
        const homeloan = Number(document.querySelector("#inv-homeloan").value);

        //mediclaim
        const selfMediclaim = Number(document.querySelector("#mediclaim-self").value);
        const isparentsAge = Number(document.querySelector("#is-parentsage").value);
        const parentsMediclaim = Number(document.querySelector("#mediclaim-parents").value);

        //misc
        const miscDeductions = Number(document.querySelector("#other-deductions").value);

        // TotalIncome
        const totalIncome = getAprilToMarchCost(basicSalary + hra + epf + extra + gratuity, newBasicSalary + newHra + newEpf + newExtra + newGratuity) + bonus + leaves + arrears;
        document.querySelector("#total-income").value = totalIncome;

        //Deduction under 80C
        let total80c = mf + ppf + epfVal + lic + ssy + ulip + fd + homeloan;
        if (total80c > limit80c) {
            total80c = limit80c;
        }
        document.querySelector("#deduction-80c").value = total80c;

        // HRA Calculation
        const totalBasic = getAprilToMarchCost(basicSalary, newBasicSalary);
        let totalHRA = getAprilToMarchCost(hra, newHra);
        if (isMetro === 0) {
            totalHRA = totalBasic * 0.4;
        }
        const calcWithBasic10per = rentPaid - (totalBasic * 0.1);
        const hraExempt = Math.min(calcWithBasic10per > 0 ? calcWithBasic10per : 0, totalHRA, rentPaid)
        document.querySelector("#hra-exception").value = hraExempt;

        // EPF Calculation
        const emprEPF = epfVal;
        document.querySelector("#eepf").value = emprEPF;

        // Mediclaim Calculation
        const maxSelfMediclaim = Math.min(selfMediclaim, 25000)
        const maxParentsMediclaimLimit = isparentsAge === 1 ? 50000 : 25000;
        const maxParentsMediclaim = Math.min(parentsMediclaim, maxParentsMediclaimLimit);
        const mediclaimTotal = maxSelfMediclaim + maxParentsMediclaim;

        document.querySelector("#mediclaim-total").value = mediclaimTotal;

        // Gratuity Calculation
        const totalGratuity = getAprilToMarchCost(gratuity, newGratuity);
        document.querySelector("#gratuity-less").value = totalGratuity;

        // Other Deductions
        const otherTotalDeduction = miscDeductions;
        document.querySelector("#other-total-deductions").value = otherTotalDeduction;

        // standard deduction
        const standardDeduction = Number(document.querySelector("#standard-deduction").value);
        
        // Prof. tax
        const profTax = Number(document.querySelector("#professional-tax").value);

        //Taxable income
        const taxableIncome = totalIncome - (total80c + standardDeduction + profTax + totalGratuity + mediclaimTotal + hraExempt + emprEPF + otherTotalDeduction);
        document.querySelector("#total-taxable-income").value = taxableIncome;
    }

    const setupArriers = () => {
        const basic = Number(document.querySelector("#salary-basic").value);
        const hra = Number(document.querySelector("#salary-hra").value);
        const epf = Number(document.querySelector("#salary-epf").value);
        const extra = Number(document.querySelector("#salary-extra").value);

        const arrCalc = (basic + hra + epf + extra) / 3;

        document.querySelector("#arrears").value = Math.round(arrCalc);
    }
    return {
        init: () => {
            document.querySelector("#fix-salary")
                .addEventListener("blur",
                    function (e) {
                        setupFixSalary(e.target.value)
                        setupEPF();
                        setupArriers();
                    }
                );

            document.querySelector("#leaves-count")
                .addEventListener("blur",
                    function (e) {
                        setUpLeavesAmount(e.target.value)
                    }
                );

            document.querySelector("#expected-appr")
                .addEventListener("blur",
                    function (e) {
                        setUpAppraisal(e.target.value)
                        setupEPF();
                    }
            );
            
            document.querySelector("#calculate")
                .addEventListener("click",
                    function (e) {
                        calculateTax()
                    }
                );
        }
    }
}();

app.init();