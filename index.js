/**************************
    Variable declarations
**************************/
const colorPicker = document.getElementById("color-picker")
const colorSchemeSelect = document.getElementById("color-scheme-select")
const getColorSchemeBtn = document.getElementById("get-color-scheme-btn")
const notificationCopyModal = document.getElementById('notification-copy-modal')
let colourCount = 6
const colorAreaPercent = 100 / colourCount
const colorSchemeModes = [
    "monochrome", 
    "monochrome-dark", 
    "monochrome-light",
    "analogic",
    "complement",
    "analogic-complement",
    "triad",
    "quad"
]

/**************************
    Event listeners
**************************/
// Renders the color scheme when the "Get color scheme" button is clicked
getColorSchemeBtn.addEventListener("click", renderColorScheme)

// Runs the copy to clipboard function when the hex code is clicked
document.addEventListener('click', function(e){
    if (e.target.dataset.hex || e.target.tagName === 'SPAN') {
        copyColorHexValueToClipboard(e.target.dataset.hex) 
    }
})

/**************************
    Functions
**************************/
// Gets the color schemes data from the API
function renderColorScheme() {
    const hexColor = colorPicker.value.slice(1) // Removes the # from the string
    const mode = colorSchemeSelect.value
    const count = colourCount

    let fetchUrl = `
    https://www.thecolorapi.com/scheme?hex=${hexColor}&mode=${mode}&count=${count}
    `

    fetch(fetchUrl)
        .then(response => response.json())
        .then(colorScheme => {
            // Saves the colors in an array
            const colorArray = colorScheme.colors

            let colorAreaHTML = ''
            let colorHexHTML = ''

            // For each color, a color area is created
            colorArray.forEach(color => {
                colorAreaHTML += `
                    <div style="background: ${color.hex.value}" data-hex="${color.hex.value}">
                        <span>${color.hex.value}</span>
                    </div>
                `
            })

            document.getElementById('color-scheme-container').innerHTML = colorAreaHTML
        })
}

// Renders the select element
function renderSelect(){
    colorSchemeModes.forEach(mode => {
        const optionElement = document.createElement('option')
        optionElement.value = mode
        optionElement.textContent = mode
        colorSchemeSelect.appendChild(optionElement)
    })
}

// Copies the data hex value to the clipboard and shows & hide a notification message
function copyColorHexValueToClipboard(dataHexValue) {
    navigator.clipboard.writeText(dataHexValue)
    document.getElementById('modal-content').innerHTML = `<p>You have copied: ${dataHexValue}</p>`
    notificationCopyModal.style.display = 'block'

    setTimeout(function() {
        notificationCopyModal.style.display = 'none'
    }, 2000)
}

/**************************
    On Page Load
**************************/
renderSelect()
renderColorScheme()
