document.addEventListener('DOMContentLoaded', function() {
    const scadenzeBody = document.getElementById('scadenze-body');
    const formPolizza = document.getElementById('aggiungi-polizza-form');
    const formScadenza = document.getElementById('aggiungi-scadenza-form');
    const selectPolizza = document.getElementById('select-polizza');

    // Inserisci qui i dati reali, ogni oggetto rappresenta una riga della tabella
    // Ora ogni polizza ha un array di scadenze
    const scadenze = [
        { broker: 'BIZZARRI', contraente: 'MYTHOS', twCommessa: 'TW2106', compagnia: 'S2C', polizza: '50140', pagataDa: 'MYTHOS', scadenze: [ { data: '01/09/2025', premio: '273,80 €' } ] },
        { broker: 'BIZZARRI', contraente: 'MYTHOS', twCommessa: 'TW2338', compagnia: 'AXA', polizza: '410442401', pagataDa: 'MYTHOS', scadenze: [] },
        { broker: 'BIZZARRI', contraente: 'MYTHOS', twCommessa: 'TW2336', compagnia: 'COFACE', polizza: '2390566', pagataDa: 'MYTHOS', scadenze: [] },
        { broker: 'BIZZARRI', contraente: 'MYTHOS', twCommessa: 'TW1917', compagnia: 'ZURICH', polizza: 'PC78ZVT0', pagataDa: 'MYTHOS', scadenze: [] },
        { broker: 'BIZZARRI', contraente: 'TECNICAER', twCommessa: 'TW2414', compagnia: 'DUAL ITALIA', polizza: 'PI-00K8WF2440', pagataDa: 'TECNICAER', scadenze: [] },
        { broker: 'BIZZARRI', contraente: 'MYTHOS', twCommessa: 'TW2010', compagnia: 'DUAL ITALIA', polizza: 'PI-00K1YJ2440', pagataDa: 'MYTHOS', scadenze: [] },
        { broker: 'BUSSO', contraente: 'MYTHOS', twCommessa: 'TW1809', compagnia: "LLOYD'S", polizza: 'GK24B0204D3226A-LB', pagataDa: 'MYTHOS', scadenze: [] },
        { broker: 'BIZZARRI', contraente: 'MYTHOS', twCommessa: 'TW1913', compagnia: 'S2C', polizza: '37837', pagataDa: 'MYTHOS', scadenze: [ { data: '01/07/2025', premio: '3.500,00 €' } ] },
        { broker: 'BIZZARRI', contraente: 'MYTHOS', twCommessa: 'TW1923', compagnia: "LLOYD'S", polizza: 'A122C574537-LB', pagataDa: 'MYTHOS', scadenze: [] },
        { broker: 'BIZZARRI', contraente: 'MYTHOS', twCommessa: 'TW2007', compagnia: 'S2C', polizza: '41689', pagataDa: 'MYTHOS', scadenze: [ { data: '01/12/2024', premio: '10.471,00 €' }, { data: '01/12/2025', premio: '10.471,00 €' } ] },
        { broker: 'BIZZARRI', contraente: 'MYTHOS', twCommessa: 'TW2404', compagnia: 'REVO', polizza: 'OX00033370', pagataDa: 'MYTHOS', scadenze: [ { data: '01/07/2025', premio: '300,00 €' } ] },
        { broker: 'BIZZARRI', contraente: 'MYTHOS', twCommessa: 'TW2404', compagnia: 'REVO', polizza: 'OX00033376', pagataDa: 'MYTHOS', scadenze: [ { data: '01/07/2025', premio: '300,00 €' } ] },
        { broker: 'BIZZARRI', contraente: 'MYTHOS', twCommessa: 'TW1804', compagnia: 'S2C', polizza: '27194', pagataDa: 'MYTHOS', scadenze: [ { data: '01/12/2024', premio: '9.016,00 €' }, { data: '01/06/2025', premio: '9.016,00 €' } ] },
        { broker: 'BIZZARRI', contraente: 'MYTHOS', twCommessa: 'TW2002', compagnia: 'S2C', polizza: '42210', pagataDa: 'MYTHOS', scadenze: [ { data: '01/01/2025', premio: '11.205,18 €' } ] },
        { broker: 'BUSSO', contraente: 'PAT', twCommessa: '', compagnia: 'ELBA-REVO', polizza: '1292968', pagataDa: 'PAT', scadenze: [ { data: '01/12/2024', premio: '1.104,00 €' } ] },
        { broker: 'BUSSO', contraente: 'MYTHOS', twCommessa: 'TW1821', compagnia: 'HELVETIA', polizza: '46816020', pagataDa: 'MYTHOS', scadenze: [ { data: '01/09/2025', premio: '8.708,00 €' } ] },
        { broker: 'BIZZARRI', contraente: 'MYTHOS', twCommessa: 'TW1911', compagnia: 'ZURICH', polizza: 'PC9K2KP4', pagataDa: 'MYTHOS', scadenze: [ { data: '01/05/2025', premio: '5.025,00 €' } ] },
        { broker: 'BIZZARRI', contraente: 'MYTHOS', twCommessa: 'TW2010', compagnia: 'S2C', polizza: '45901', pagataDa: 'MYTHOS', scadenze: [ { data: '01/12/2024', premio: '2.980,00 €' }, { data: '01/06/2025', premio: '2.980,00 €' }, { data: '01/12/2025', premio: '2.980,00 €' } ] },
        { broker: 'BIZZARRI', contraente: 'MYTHOS', twCommessa: 'TW2352', compagnia: 'COFACE', polizza: '2370008', pagataDa: 'MYTHOS', scadenze: [] },
        { broker: 'BIZZARRI', contraente: 'MYTHOS', twCommessa: 'TW2214', compagnia: 'BCC', polizza: '19240', pagataDa: 'MYTHOS', scadenze: [] },
        { broker: 'BIZZARRI', contraente: 'MYTHOS', twCommessa: 'TW2023', compagnia: 'S2C', polizza: '49504', pagataDa: 'MYTHOS', scadenze: [ { data: '01/12/2024', premio: '3.220,00 €' }, { data: '01/12/2025', premio: '3.220,00 €' } ] }
    ];

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
        fetch('https://TUAISTANZA.n8n.cloud/webhook/salva-polizze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(scadenze)
        })
        .then(res => res.json())
        .then(data => console.log('Dati salvati su n8n:', data))
        .catch(err => console.error('Errore salvataggio n8n:', err));
    }

    aggiornaTabella();
    aggiornaSelectPolizza();

    formPolizza.addEventListener('submit', function(e) {
        e.preventDefault();
        const dati = Object.fromEntries(new FormData(formPolizza).entries());
        dati.stato = 'in_scadenza';
        dati.fatturaUrl = '';
        dati.premioScadenza = '';
        dati.scadenza = '';
        scadenze.push(dati);
        aggiornaTabella();
        aggiornaSelectPolizza();
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
            formScadenza.reset();
        }
    });
});
