document.addEventListener('DOMContentLoaded', function() {
    // Inisialisasi alternatif
    let alternatives = [
        { name: 'Alternatif 1', lokasi: 4, keamanan: 3, fasilitas: 5, harga: 300000 },
        { name: 'Alternatif 2', lokasi: 5, keamanan: 4, fasilitas: 3, harga: 250000 }
    ];

    const alternativesContainer = document.getElementById('alternatives-container');
    const addAlternativeBtn = document.getElementById('add-alternative');
    const calculateBtn = document.getElementById('calculate');
    const updateWeightsBtn = document.getElementById('update-weights');
    const resultsSection = document.getElementById('results-section');

    // Render alternatif
    function renderAlternatives() {
        alternativesContainer.innerHTML = '';
        alternatives.forEach((alt, index) => {
            const altDiv = document.createElement('div');
            altDiv.className = 'alternative';
            altDiv.innerHTML = `
                <div class="alternative-header">
                    <span class="alternative-title">${alt.name}</span>
                    <button class="remove-alternative" data-index="${index}">Hapus</button>
                </div>
                <table>
                    <tr>
                        <td>Lokasi (1-5)</td>
                        <td><input type="number" class="lokasi-value" value="${alt.lokasi}" min="1" max="5"></td>
                    </tr>
                    <tr>
                        <td>Keamanan (1-5)</td>
                        <td><input type="number" class="keamanan-value" value="${alt.keamanan}" min="1" max="5"></td>
                    </tr>
                    <tr>
                        <td>Fasilitas (1-5)</td>
                        <td><input type="number" class="fasilitas-value" value="${alt.fasilitas}" min="1" max="5"></td>
                    </tr>
                    <tr>
                        <td>Harga Tiket (Rp)</td>
                        <td><input type="number" class="harga-value" value="${alt.harga}" min="1"></td>
                    </tr>
                </table>
            `;
            alternativesContainer.appendChild(altDiv);
        });

        // Tambahkan event listener untuk tombol hapus
        document.querySelectorAll('.remove-alternative').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                alternatives.splice(index, 1);
                renderAlternatives();
            });
        });
    }

    // Tambahkan alternatif baru
    addAlternativeBtn.addEventListener('click', function() {
        const newAlt = {
            name: `Alternatif ${alternatives.length + 1}`,
            lokasi: 3,
            keamanan: 3,
            fasilitas: 3,
            harga: 300000
        };
        alternatives.push(newAlt);
        renderAlternatives();
    });

    // Update nilai alternatif
    function updateAlternativeValues() {
        const altElements = document.querySelectorAll('.alternative');
        altElements.forEach((altEl, index) => {
            alternatives[index].lokasi = parseFloat(altEl.querySelector('.lokasi-value').value);
            alternatives[index].keamanan = parseFloat(altEl.querySelector('.keamanan-value').value);
            alternatives[index].fasilitas = parseFloat(altEl.querySelector('.fasilitas-value').value);
            alternatives[index].harga = parseFloat(altEl.querySelector('.harga-value').value);
        });
    }

    // Hitung weighted product
    calculateBtn.addEventListener('click', function() {
        updateAlternativeValues();
        
        // Dapatkan bobot dan jenis kriteria
        const weights = {
            lokasi: parseFloat(document.getElementById('lokasi-weight').value),
            keamanan: parseFloat(document.getElementById('keamanan-weight').value),
            fasilitas: parseFloat(document.getElementById('fasilitas-weight').value),
            harga: parseFloat(document.getElementById('harga-weight').value)
        };
        
        const criteriaType = {
            lokasi: document.getElementById('lokasi-type').value,
            keamanan: document.getElementById('keamanan-type').value,
            fasilitas: document.getElementById('fasilitas-type').value,
            harga: document.getElementById('harga-type').value
        };        
        
        // Validasi total bobot
        const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
        if (Math.abs(totalWeight - 1) > 0.001) {
            alert(`Total bobot harus 1. Saat ini total bobot: ${totalWeight}`);
            return;
        }
        
        // Hitung weighted product
        const S_values = {};
        alternatives.forEach(alt => {
            let S = 1;
            for (const [criteria, weight] of Object.entries(weights)) {
                const value = alt[criteria];
                if (criteriaType[criteria] === 'benefit') {
                    S *= Math.pow(value, weight);
                } else { // cost
                    S *= Math.pow(value, -weight);
                }
            }
            S_values[alt.name] = S;
        });
        
        // Hitung total S
        const total_S = Object.values(S_values).reduce((sum, S) => sum + S, 0);
        
        // Hitung vektor V (nilai preferensi)
        const V_values = {};
        for (const [altName, S] of Object.entries(S_values)) {
            V_values[altName] = S / total_S;
        }
        
        // Tampilkan hasil
        displayResults(V_values);
    });

    // Tampilkan hasil
    function displayResults(results) {
        const resultsContainer = document.getElementById('results-container');
        resultsContainer.innerHTML = '';
        
        // Urutkan hasil dari nilai tertinggi ke terendah
        const sortedResults = Object.entries(results).sort((a, b) => b[1] - a[1]);
        
        // Temukan nilai tertinggi
        const maxValue = sortedResults[0][1];
        
        sortedResults.forEach(([altName, score]) => {
            const resultDiv = document.createElement('div');
            resultDiv.className = 'result-item';
            if (score === maxValue) {
                resultDiv.classList.add('best-result');
            }
            resultDiv.textContent = `${altName}: ${score.toFixed(4)}`;
            resultsContainer.appendChild(resultDiv);
        });
        
        resultsSection.classList.remove('hidden');
    }

    // Update bobot
    updateWeightsBtn.addEventListener('click', function() {
        const weights = {
            lokasi: parseFloat(document.getElementById('lokasi-weight').value),
            keamanan: parseFloat(document.getElementById('keamanan-weight').value),
            fasilitas: parseFloat(document.getElementById('fasilitas-weight').value),
            harga: parseFloat(document.getElementById('harga-weight').value)
        };
        
        const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
        
        if (Math.abs(totalWeight - 1) > 0.001) {
            alert(`Total bobot harus 1. Saat ini total bobot: ${totalWeight}`);
        } else {
            alert('Bobot berhasil diperbarui!');
        }
    });

    // Render alternatif awal
    renderAlternatives();
});