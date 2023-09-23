/**************************
    Variable declarations
**************************/
const colorPicker = document.getElementById("color-picker")
const colorSchemeSelect = document.getElementById("color-scheme-select")
const getColorSchemeBtn = document.getElementById("get-color-scheme-btn")
const notificationCopyModal = document.getElementById('notification-copy-modal')
let isMobile = false
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
    if (e.target.dataset.hex) {
        copyColorHexValueToClipboard(e.target.dataset.hex) 
    }
    if (isMobile && e.target.tagName === 'SPAN') {
        copyColorHexValueToClipboard(e.target.textContent)
    }
})

// Checks if it's mobile and decides which type of color area layout is required
window.addEventListener('resize', function(){
    checkMobile()
    setColorArea()
})

/**************************
    Functions
**************************/
// Function to check if it's a mobile or desktop view
function checkMobile() {
    if (window.innerWidth < 600) {
        isMobile = true
    } else {
        isMobile = false
    }
}

// Check if the user agent contains common keywords for mobile devices
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

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

            // For each color, a color and hex column is created
            colorArray.forEach(color => {
                colorAreaHTML += `
                    <div style="background: ${color.hex.value}" data-hex="${color.hex.value}">
                        ${isMobile ? `<span >${color.hex.value}</span>` : ''}
                    </div>
                `
                if (!isMobile) {
                    colorHexHTML += `
                        <div><span data-hex="${color.hex.value}">${color.hex.value}</span></div>
                    `
                }
            })

            document.getElementById('color-scheme-container').innerHTML = colorAreaHTML

            setColorArea() 
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

// Function to set the layout of color areas based on mobile or desktop view
function setColorArea() {
    const colorAreaDivs = document.querySelectorAll('#color-scheme-container div')

    if (isMobile || isMobileDevice) {
        colorAreaDivs.forEach(div => {
            div.style.width = '100%'
            const hexValue = div.dataset.hex
            div.innerHTML = `<span>${hexValue}</span>`
        })
    } else {
        colorAreaDivs.forEach(div => {
            div.style.width = `${colorAreaPercent}%`
            div.innerHTML = ""
        })
    }
}

// Copies the data hex value to the clipboard and shows&hide a notification message
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
checkMobile()
renderSelect()
renderColorScheme()
