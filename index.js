const $  = document.querySelector   .bind (document)
const $$ = document.querySelectorAll.bind (document)

// форматирует дату вида "2018-11-29T00:00:00%2B03:00" из timestamp
const fmtDate = x => new Date (x).toISOString ().replace (/T.+/, '') + 'T00:00:00%2B03:00' // символ + ескейпится как %2B

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

// преобразует "2018-11-29T12:34:00" в "12:34" (извлекает время)
const extractTime = str => str.match (/T(\d\d:\d\d)/)[1]

function renderRowContents (row, { flt, mar1: { city_eng, city }, t_st, t_et, vip_status_eng }) {

    if (t_et === null) t_et = t_st

    for (const [className, innerText] of [['flight-number', flt], ['city', city_eng], ['time', extractTime (t_st)],['flight-status', vip_status_eng]]) {
       
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
    
    const infoboard = $('.infoboard')
    const searchValue = $('#search').value

    infoboard.innerHTML = ''
    document.documentElement.classList.add('loading')

    try {

        const { items } = await loadData ({ search: $('#search').value, direction: document.forms.options.direction.value })

        if (searchValue !== $('#search').value) return // если searchValue устарел, то ничего не делать

        for (const item of items) {

            const row = document.createElement ('DIV')

            row.className = 'row'

            renderRowContents (row, item)

            infoboard.appendChild (row)
        }

        document.documentElement.classList.remove ('loading')

    } catch (e) { // если произошла ошибка...

        console.log (e)
        
        // если searchValue актуален, то повторить загрузку
        if (searchValue === $('#search').value) refresh ()
    }
}

document.addEventListener ('DOMContentLoaded', refresh)