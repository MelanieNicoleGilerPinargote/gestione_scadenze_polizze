document.addEventListener('DOMContentLoaded', function() {
    const scadenzeBody = document.getElementById('scadenze-body');
    const formPolizza = document.getElementById('aggiungi-polizza-form');
    const formScadenza = document.getElementById('aggiungi-scadenza-form');
    const selectPolizza = document.getElementById('select-polizza');

    // Variabile globale per le scadenze
    let scadenze = [];

    // Funzione per normalizzare i dati ricevuti dal Google Sheets
    function normalizzaDatiGoogleSheets(data) {
        // Esempio: data = [ { BROKER: ..., CONTRAENTE: ..., ... , PREMIO: ..., SCADENZA: ... }, ... ]
        const polizze = [];
        data.forEach(riga => {
            // Gestione scadenze multiple separate da virgola
            let scadenzeArr = [];
            if (riga.SCADENZA && riga.SCADENZA.trim() !== "0" && riga.SCADENZA.trim() !== "") {
                const dateArr = riga.SCADENZA.split(',').map(s => s.trim());
                dateArr.forEach(dataScad => {
                    scadenzeArr.push({
                        data: dataScad,
                        premio: riga.PREMIO || '',
                        stato: 'in_scadenza',
                        fatturaUrl: ''
                    });
                });
            }
            polizze.push({
                broker: riga.BROKER || '',
                contraente: riga.CONTRAENTE || '',
                twCommessa: riga["TW COMMESSA"] || '',
                compagnia: riga["AGNIA ASSICUR"] || '',
                polizza: riga["polizza n."] || '',
                pagataDa: riga["PAGATA DA"] || '',
                scadenze: scadenzeArr
            });
        });
        return polizze;
    }

    // Carica dati da n8n/Google Sheets all'avvio
    function caricaDatiDaN8N() {
        fetch('https://TUA_INSTANZA_N8N/webhook/leggi-polizze') // Sostituisci con il tuo URL reale
            .then(res => res.json())
            .then(data => {
                scadenze = normalizzaDatiGoogleSheets(data);
                aggiornaTabella();
                aggiornaSelectPolizza();
            })
            .catch(err => {
                console.error('Errore caricamento dati da n8n:', err);
                // Se errore, puoi opzionalmente mostrare un messaggio o caricare dati di default
            });
    }

    function aggiornaTabella() {
        scadenzeBody.innerHTML = '';
        scadenze.forEach((polizza, polizzaIdx) => {
            if (!polizza.scadenze || polizza.scadenze.length === 0) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${polizza.broker || ''}</td>
                    <td>${polizza.contraente || ''}</td>
                    <td>${polizza.twCommessa || ''}</td>
                    <td>${polizza.compagnia || ''}</td>
                    <td>${polizza.polizza || ''}</td>
                    <td>${polizza.pagataDa || ''}</td>
                    <td class="premio-cell" data-polizza-idx="${polizzaIdx}" data-scad-idx="-1"></td>
                    <td></td>
                    <td></td>
                    <td></td>
                `;
                scadenzeBody.appendChild(row);
            } else {
                polizza.scadenze.forEach((scad, scadIdx) => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${polizza.broker || ''}</td>
                        <td>${polizza.contraente || ''}</td>
                        <td>${polizza.twCommessa || ''}</td>
                        <td>${polizza.compagnia || ''}</td>
                        <td>${polizza.polizza || ''}</td>
                        <td>${polizza.pagataDa || ''}</td>
                        <td class="premio-cell" data-polizza-idx="${polizzaIdx}" data-scad-idx="${scadIdx}">${scad.premio || ''}</td>
                        <td>${scad.data || ''}</td>
                        <td>${scad.stato === 'pagata' ? '<span class="status pagato">PAGATA</span>' : '<span class="status in_scadenza">IN SCADENZA</span>'}</td>
                        <td>${scad.fatturaUrl ? `<a href="${scad.fatturaUrl}" target="_blank">Scarica Fattura</a>` : ''}</td>
                    `;
                    scadenzeBody.appendChild(row);
                });
            }
        });

        // Aggiungi event listener per doppio click sulle celle premio
        document.querySelectorAll('.premio-cell').forEach(cell => {
            cell.ondblclick = function() {
                const polizzaIdx = this.getAttribute('data-polizza-idx');
                const scadIdx = this.getAttribute('data-scad-idx');
                let currentValue = this.textContent.trim();
                const input = document.createElement('input');
                input.type = 'text';
                input.value = currentValue;
                input.style.width = '80px';
                this.innerHTML = '';
                this.appendChild(input);
                input.focus();
                input.onblur = () => {
                    const newValue = input.value.trim();
                    if (scadIdx == -1) {
                        // Caso senza scadenze (non usato, ma per coerenza)
                    } else {
                        scadenze[polizzaIdx].scadenze[scadIdx].premio = newValue;
                    }
                    aggiornaTabella();
                    salvaSuN8N(); // <--- Salva su n8n dopo ogni modifica
                };
                input.onkeydown = (e) => {
                    if (e.key === 'Enter') input.blur();
                };
            };
        });
    }

    function aggiornaSelectPolizza() {
        // Prendi solo polizze uniche
        const polizzeUniche = [...new Set(scadenze.map(s => s.polizza))];
        selectPolizza.innerHTML = '<option value="">Seleziona polizza...</option>';
        polizzeUniche.forEach(polizza => {
            if (polizza) {
                const option = document.createElement('option');
                option.value = polizza;
                option.textContent = polizza;
                selectPolizza.appendChild(option);
            }
        });
    }

    function salvaSuN8N() {
        fetch('http://localhost:5678/webhook-test/salva-polizze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(scadenze)
        })
        .then(res => res.json?.() ?? res.text())
        .then(data => console.log('Dati salvati su n8n:', data))
        .catch(err => console.error('Errore salvataggio n8n:', err));
    }

    // Carica i dati all'avvio
    caricaDatiDaN8N();

    formPolizza.addEventListener('submit', function(e) {
        e.preventDefault();
        const dati = Object.fromEntries(new FormData(formPolizza).entries());
        dati.stato = 'in_scadenza';
        dati.fatturaUrl = '';
        dati.premioScadenza = '';
        dati.scadenza = '';
        // ...aggiungi la nuova polizza all'array scadenze...
        scadenze.push(dati);
        aggiornaTabella();
        aggiornaSelectPolizza();
        salvaSuN8N(); // Salva su n8n dopo aggiunta polizza
        formPolizza.reset();
    });

    formScadenza.addEventListener('submit', function(e) {
        e.preventDefault();
        const dati = Object.fromEntries(new FormData(formScadenza).entries());
        // Trova una polizza esistente e aggiungi una nuova scadenza
        const polizza = dati.polizza;
        // Copia i dati della polizza esistente
        const polizzaBase = scadenze.find(s => s.polizza === polizza);
        if (polizzaBase) {
            scadenze.push({
                ...polizzaBase,
                premioScadenza: dati.premioScadenza,
                scadenza: dati.scadenza,
                stato: 'in_scadenza',
                fatturaUrl: ''
            });
            aggiornaTabella();
            salvaSuN8N(); // Salva su n8n dopo aggiunta scadenza
            formScadenza.reset();
        }
    });
});
