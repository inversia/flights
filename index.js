const $  = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)


document.addEventListener ('DOMContentLoaded', () => {  

    const buttons = $$('.buttons button')
    
    for (const button of buttons){
        
        button.onclick = () => {

            alert('ХУЯССЕ!')
        }
    }
})

