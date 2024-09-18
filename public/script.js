document.addEventListener('DOMContentLoaded', () => {
    const resultsDiv = document.getElementById('results');

    // Fetch the API data from the Node.js server (e.g., for 'today' results)

    const symbol = {
        NS:"Upcoming",
        FT:"Finished",
        HT:"Half Time",
        ON:"Live",
        AET:"Extra Time",
        PEN:"Penalties",
    }

    const symbolcolor = {
        NS:"0D00A4",
        FT:"A3A3A3",
        ON:"44CF6C",
        HT:"FFC100",
        AET:"FFC100",
        PEN:"E0479E",
    }
    fetch('/today')
        .then(response => response.json())
        .then(data => {
            console.log('Data received:', data);
            // if (data.message.length > 0) {
            //   let html = '<ul>';
            //   data.message.forEach(match => {
            //     html += `<li>${match.time}: ${match.home} vs ${match.away} - ${match.result} (${match.status})</li><hr/>`;
            //   });
            //   html += '</ul>';
            //   resultsDiv.innerHTML = html;
            // } else {
            //   resultsDiv.innerHTML = 'No matches found.';
            // }


            if (data.message.length > 0) {
              
                let html = '<div class="rowsofdata-x">';
                data.message.forEach(match => { 
                     let time = match.time;
                let post = time.includes("Postponed");
                if (time.includes("Postponed")) {
                    time = time.replace("Postponed", "").trim();
                }

                const [hscore, ascore] = match.result.split(':');
                    html += `<div class="rowsofdata-y"><p class="scoreme">${time}</p> <div class="teamnames"> <p>${match.home}</p>  <p>${match.away}</p></div> <div class="scorestats"><p class="scoreme">${(hscore === "-" || ascore === "-") ? "" : hscore + " - " + ascore}</p> <p style="fontSize:14px;color:#${symbolcolor[match.status]}">${symbol[match.status]}</p></div> </div><hr/>`;
                });
                html += '</div>';
                resultsDiv.innerHTML = html;
            } else {
                resultsDiv.innerHTML = 'No matches found.';
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            resultsDiv.innerHTML = 'Error loading results.';
        });
});
