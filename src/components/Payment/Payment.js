import React, { Component } from 'react';
import CurrencyInput from 'react-currency-input';

import './Payment.css';

class Payment extends Component {

    state = {
        grossWages: 0,
        payPeriods: 360,
        stateAllowances: 0,
        maritalStatus: 'Married',

        stateWithholding: 0,
        federalWithholding: 0,
        netPay: 0,
        // 7.65% (6.2% for social security tax and 1.45% for Medicare tax) 
        employeeSocialSecurityMedicare: 0,
    }

    handleChangeGrossWages = (event) => {
        this.setState({
            ...this.state,
            grossWages: Number(event.target.value.replace(/[^0-9.-]+/g, "")),
        });
    }

    handleChangePayPeriods = (event) => {
        this.setState({
            ...this.state,
            payPeriods: event.target.value,
        })
    }

    handleChangeStateAllowances = (event) => {
        this.setState({
            ...this.state,
            stateAllowances: event.target.value,
        })
    }

    handleChangeMaritalStatus = (event) => {
        this.setState({
            ...this.state,
            maritalStatus: event.target.value,
        })
    }

    handleClickCalculateState = () => {
        this.stateWithholdingCalculation(
            this.state.grossWages,
            this.state.payPeriods,
            this.state.stateAllowances,
            this.state.maritalStatus
        );
    }

    handleClickCalculateSocialSecurityMedicare = () => {
        this.employeeSocialSecurityMedicare(this.state.grossWages);
    }

    handleClickCalculateNetPay = () => {
        this.calculateNetPay(
            this.state.grossWages,
            this.state.stateWithholding,
            this.state.federalWithholding,
            this.state.employeeSocialSecurityMedicare
        );
    }


    // need to store employees withholding information in redux state
    // state allowances
    // marital status
    stateWithholdingCalculation = (grossWages, payPeriods, stateAllowances, maritalStatus) => {
        // STEP 1 - Determine gross wages (450)
        // STEP 2 - Determine the number of pay periods in the year, multiply step 1 by step 2
        // 360 if you pay by the day
        // 52 if you pay by the week (52 * 450 = $23,400)
        // 26 if you pay every two weeks
        // 24 if you pay twice a month
        // 12 if you  pay once a month
        // STEP 3 - Multiple employee's withholding allowances by $4,250
        // state allowances (1 * 4,250 = 4,250)
        // STEP 4 - subtract result in step 3 for the result in step 2
        // 23,400 - 4,250 = 19,150
        // STEP 5 - use chart to determine the value for step 5 (need marital status)
        // IF SINGLE (use result from step 4)
        // between 2400 and 28920, subtract 2,400, multiple by 5.35%
        // 19150 - 2400 = 16750
        // 16750 * 0.0535 = 896.125

        // IF MARRIED
        // STEP 6 - divide step 5 by the pay periods in step two
        // 896.125 / 52 = 17.2331730769
        let value = (grossWages * payPeriods - (stateAllowances * 4250));

        if (maritalStatus === 'Single') {
            if (value >= 2400 && value < 28920) {
                value -= 2400;
                value *= 0.0535;
                value /= payPeriods;

                this.setState({
                    ...this.state,
                    stateWithholding: value,
                    // netPay: this.state.grossWages - value,
                });
            }
            else if (value >= 28920 && value < 89510) {
                value -= 28920;
                value *= 0.0705;
                value += 1418.82;
                value /= payPeriods;

                this.setState({
                    ...this.state,
                    stateWithholding: value,
                    // netPay: this.state.grossWages - value,
                });
            }
            else if (value >= 89510 && value < 166290) {
                value -= 89510;
                value *= 0.0785;
                value += 5690.42;
                value /= payPeriods;

                this.setState({
                    ...this.state,
                    stateWithholding: value,
                    // netPay: this.state.grossWages - value,
                });
            }
            else if (value >= 166290) {
                value -= 166290;
                value *= 0.0985;
                value += 11717.65;
                value /= payPeriods;

                this.setState({
                    ...this.state,
                    stateWithholding: value,
                    // netPay: this.state.grossWages - value,
                });
            }

        }
        else if (maritalStatus === 'Married') {
            if (value >= 9050 && value < 47820) {
                value -= 9050;
                value *= 0.0535;
                value /= payPeriods;

                this.setState({
                    ...this.state,
                    stateWithholding: value,
                    // netPay: this.state.grossWages - value,
                });
            }
            else if (value >= 47820 && value < 163070) {
                value -= 47820;
                value *= 0.0705;
                value += 2074.20;
                value /= payPeriods;

                this.setState({
                    ...this.state,
                    stateWithholding: value,
                    // netPay: this.state.grossWages - value,
                });
            }
            else if (value >= 163070 && value < 282200) {
                value -= 163070;
                value *= 0.0785;
                value += 10199.33;
                value /= payPeriods;

                this.setState({
                    ...this.state,
                    stateWithholding: value,
                    // netPay: this.state.grossWages - value,
                });
            }
            else if (value >= 282200) {
                value -= 282200;
                value *= 0.0985;
                value += 19551.04;
                value /= payPeriods;

                this.setState({
                    ...this.state,
                    stateWithholding: value,
                    // netPay: this.state.grossWages - value,
                });
            }

        }

    }

    employeeSocialSecurityMedicare = (grossWages) => {
        this.setState({
            ...this.state,
            // 7.65% (6.2% for social security tax and 1.45% for Medicare tax) 
            employeeSocialSecurityMedicare: grossWages * 0.0765,
        });
    }

    calculateNetPay = (grossWages, stateWithholding, federalWithholding, employeeSocialSecurityMedicare) => {
        // this.employeeSocialSecurityMedicare(this.state.grossWages);
        this.setState({
            ...this.state,
            // 7.65% (6.2% for social security tax and 1.45% for Medicare tax) 
            netPay: (((grossWages - stateWithholding) - federalWithholding) - employeeSocialSecurityMedicare),
        });
    }
    // - federalWithholding - employeeSocialSecurityMedicare,

    render() {
        return (
            <div className="payment">

                <form>
                    <label>
                        Number of Pay periods
                        <br />
                        <select onChange={this.handleChangePayPeriods}>
                            <option value={360}>360 - Paid Daily</option>
                            <option value={52}>52 - Paid Weekly</option>
                            <option value={26}>26 - Paid Every Two Weeks</option>
                            <option value={24}>24 - Paid Twice a Month</option>
                            <option value={12}>12 - Paid Once a Month</option>
                        </select>
                    </label>
                    <br />
                    <br />
                    <label>
                        State Allowances
                        <br />
                        <input onChange={this.handleChangeStateAllowances} type="number" min={0}></input>
                    </label>
                    <br />
                    <br />
                    <label>
                        Marital Status
                        <br />
                        <select onChange={this.handleChangeMaritalStatus}>
                            <option value="Married">Married</option>
                            <option value="Single">Single</option>
                        </select>
                    </label>
                    <br />
                    <br />
                    <label>
                        Gross Wage
                        <br />
                        <CurrencyInput
                            thousandSeparator=","
                            decimalSeparator="."
                            precision="2"
                            prefix="$"
                            allowNegative={false}
                            allowEmpty={false}
                            value={this.state.grossWages}
                            onChangeEvent={this.handleChangeGrossWages} />
                    </label>
                    <br />
                    <br />
                    <label>
                        State Withholding: {this.state.stateWithholding > 0 ?
                            '$' + this.state.stateWithholding.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') :
                            '$0.00'} <br /><button onClick={this.handleClickCalculateState}>Calculate State</button>
                    </label>
                    <br />
                    <br />
                    <label>
                        Federal Withholding: {this.state.federalWithholding > 0 ?
                            '$' + this.state.federalWithholding.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') :
                            '$0.00'}
                    </label>
                    <br />
                    <br />
                    <label>
                        Social Security and Medicare: {this.state.employeeSocialSecurityMedicare > 0 ?
                            '$' + this.state.employeeSocialSecurityMedicare.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') :
                            '$0.00'} <br /><button onClick={this.handleClickCalculateSocialSecurityMedicare}>Calculate Social Security and Medicare</button>
                    </label>
                    <br />
                    <br />
                    <label>
                        Net Pay: {this.state.netPay > 0 ?
                            '$' + this.state.netPay.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') :
                            '$0.00'} <br /><button onClick={this.handleClickCalculateNetPay}>Calculate Net Pay</button>
                    </label>
                    <br />
                    <br />
                    <input onClick={this.handleClickSubmit} type="submit" value="Submit" />
                </form>
                <br />
                <pre>{JSON.stringify(this.state, null, 2)}</pre>
            </div>
        );
    }
}
export default Payment;
