const $  = document.querySelector   .bind (document)
const $$ = document.querySelectorAll.bind (document)

// форматирует дату вида "2018-11-29T00:00:00%2B03:00"
const fmtDate = x => new Date (x).toLocaleDateString ().split ('/').reverse ().join ('-') + 'T00:00:00%2B03:00' // символ + ескейпится как %2B

// загружает данные из API Шереметьево
async function loadData ({ search    = '',
                           direction = 'arrival',
                           dateStart = fmtDate (Date.now ()),                           // сегодня
                           dateEnd   = fmtDate (Date.now () + (1000 * 60 * 60 * 24)),   // завтра
                           perPage   = 99999,
                           page      = 0,
                           locale    = 'ru' } = {}) {

    return (await fetch (`https://cors.io/?https://www.svo.aero/bitrix/timetable/?search=${search}&direction=${direction}&dateStart=${dateStart}&dateEnd=${dateEnd}&perPage=${perPage}&page=${page}&locale=${locale}`)).json ()
}

const extractTime = str => str.match (/T(\d\d:\d\d)/)[1]

function renderRowContents (row, { flt, mar1: { city_eng, city }, t_st, t_et, vip_status_eng }) {

    if (t_et === null) t_et = t_st

    for (const [className, innerText] of [['city', city_eng], ['flight-number', flt], ['time', extractTime (t_st)],['flight-status', vip_status_eng]]) {
       
        const el = document.createElement ('DIV')

        el.className = className
        el.innerText = innerText

        row.appendChild (el)
    }

    const st = new Date (t_st).getTime ()
    const et = new Date (t_et).getTime ()

    if (et > st) row.classList.add ('delayed')
}

async function refresh () {

    // const items = (await loadData ({ search: '116' })).items

    const { items } = await loadData ({ search: '10' })

    const infoboard = $('.infoboard')

    infoboard.innerHTML = ''

    for (const item of items) {

        const row = document.createElement ('DIV')

        row.className = 'row'

        renderRowContents (row, item)
    
        infoboard.appendChild (row)
    }

    document.documentElement.classList.remove('loading')

}

document.addEventListener ('DOMContentLoaded', () => {  
    
    const active = $('button.active')
    const buttons = $$('.buttons button')
    
    for (const button of buttons){
        
        button.onclick = () => {

            for (const otherButton of buttons) {
                otherButton.classList.toggle ('active', button === otherButton)
            }
        }
    }

    refresh ()
})
