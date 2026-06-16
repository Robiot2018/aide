let articlesCourants = []
 
async function chargerArticles() {
    const response = await fetch('/articles')
    articlesCourants = await response.json()
    const select = document.querySelector('#select-article')
 
    select.innerHTML = '<option value="">-- Choisir un produit --</option>'
    for (const a of articlesCourants) {
        select.innerHTML += '<option value="' + a.id + '" data-nom="' + a.nom + '" data-quantite="' + a.quantite + '">' +
            a.nom + ' (stock : ' + a.quantite + ')' + '</option>'
    }
}
 
function afficherMessage(texte, type) {
    const el = document.querySelector('#message')
    el.textContent = texte
    el.className = 'message ' + type
    setTimeout(() => { el.className = 'message'; el.textContent = '' }, 4000)
}
 
window.addEventListener('load', async () => {
    await chargerArticles()
 
    document.querySelector('#select-article').addEventListener('change', () => {
        const select = document.querySelector('#select-article')
        const option = select.options[select.selectedIndex]
        const infoEl = document.querySelector('#info-dispo')
        if (select.value) {
            infoEl.textContent = 'Stock disponible pour ce produit : ' + option.dataset.quantite
            infoEl.style.display = 'block'
        } else {
            infoEl.style.display = 'none'
        }
    })
 
    document.querySelector('#btn-sortie').addEventListener('click', async () => {
        const select   = document.querySelector('#select-article')
        const option   = select.options[select.selectedIndex]
        const quantite = parseInt(document.querySelector('#quantite').value)
        const nom      = option.dataset ? option.dataset.nom : ''
 
        if (!select.value) {
            afficherMessage('Veuillez choisir un produit.', 'erreur')
            return
        }
        if (!quantite || quantite <= 0) {
            afficherMessage('Veuillez saisir une quantite valide.', 'erreur')
            return
        }
 
        const response = await fetch('/articles/sortie', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nom, quantite })
        })
        const data = await response.json()
 
        if (response.ok) {
            afficherMessage(data.message + ' Stock restant : ' + data.quantite_restante, 'succes')
            document.querySelector('#quantite').value = ''
            document.querySelector('#select-article').value = ''
            document.querySelector('#info-dispo').style.display = 'none'
            await chargerArticles()
        } else {
            let msg = data.erreur
            if (data.quantite_disponible !== undefined) {
                msg += ' (disponible : ' + data.quantite_disponible + ')'
            }
            afficherMessage(msg, 'erreur')
        }
    })
})
 
