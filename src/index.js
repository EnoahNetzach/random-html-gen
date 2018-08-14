import generate from './generator'

const appEl = document.getElementById('app')

document.getElementById('generate').addEventListener('click', () => {
  appEl.innerText = generate()
})
