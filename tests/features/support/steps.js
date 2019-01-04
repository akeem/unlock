const {
  Given, When, Then, After, Before,
} = require('cucumber')

Before(async function (testCase) {
  return await this.open()
})

After(async function () {
  return await this.closePage()
})

Given('creator is on the dashboard', async function () {
  if (await this.confirmDashboard('Create Lock')) {
    return '';
  }
  throw 'not found';
})

When('the creator has Eth available', async function () {
  if (await this.confirmWalletBalance('99.73')) {
    return '';
  }
  throw 'not found';
})
