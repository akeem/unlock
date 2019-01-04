const { setWorldConstructor } = require('cucumber')
const puppeteer = require('puppeteer')

class World {
  async open() {
    this.browser = await puppeteer.launch()
    this.page = await this.browser.newPage()
    await this.page.goto('http://localhost:3000/dashboard')
    await this.page.waitForSelector('button')
    // await this.page.screenshot({path: 'foo.png'})
  }

  //   setTodo(todo) {
  //     this.todo = todo;
  //   }

  async confirmDashboard(buttonText) {
    return await this.page.evaluate(
      () => Array.from(document.querySelectorAll('button')).filter(
          node => node.innerHTML === 'Create Lock'
        ).length
    )
  }

  async confirmWalletBalance(expectedBalance) {
    return await this.page.evaluate(
      () => Array.from(document.querySelectorAll('span')).filter(
          node => node.innerHTML === '99.73'
        ).length
    )
  }

  async closePage() {
    await this.browser.close()
  }
}

setWorldConstructor(World)
