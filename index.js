const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());


const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send(`
        <html>
        <head>
        <title>ScoreScrap API</title>
        </head>
        <h1>Welcome, Scorescrap API</h1>
        <h1>No specific day provided.</h1>
        <br/> 
        <p>Please provide a day in the URL.</p>
        <ul>
        <li>For today's matches: <a href="/today">/today</a></li>
        <li>For tomorrow's matches: <a href="/tomorrow">/tomorrow</a></li>
        <li>For yesterday's matches: <a href="/yesterday">/yesterday</a></li
        </ul>
        <blockquote>Example: <a href="/today">https://scorescrap.vercel.app/today</a></blockquote>
        <i>Developed by Jerry <a href="https://github.com/JeremiahJacob261">GITHUB 🔥</a></i>
        
        </html>
        `);
});

app.get('/:day',async (req, res) => {
    const day = req.params.day;
    let url = 'https://www.flashscore.mobi/';

    if (day === 'today' || day === '') {
        url += '';
    } else if (day === 'tomorrow') {
        url += '?d=1';
    }else if(day === 'yesterday'){
        url += '?d=-1';

    }else {
        res.status(400).json({ message: 'Invalid day parameter' });
        return;
    }
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        const mdsoup = $('#score-data');
    
        mdsoup.find('h4').remove();
    
        const fullres = [];
    
        mdsoup.find('> span').each((index, element) => {
            try {
                const $element = $(element);
                let matchObj = {};
    
                // Check for postponed status
                if ($element.find('span.status.postponed').length > 0) {
                    matchObj.status = 'PS';
                    return; // Skip further processing for postponed matches
                }
    
                matchObj.time = $element.text().trim();
                
                let matchName = '';
                let node = element.nextSibling;
                let hasRedCard = false;
                while (node && (node.type === 'text' || (node.type === 'tag' && node.name === 'img'))) {
                    if (node.type === 'text') {
                        matchName += node.data;
                    } else if (node.name === 'img') {
                        hasRedCard = true;
                    }
                    node = node.nextSibling;
                }
                matchName = matchName.trim().replace(/^"|"$/g, '');
    
                const parts = matchName.split(' - ');
                matchObj.home = parts[0];
                matchObj.away = parts[1];
                
                if (hasRedCard) {
                    matchObj.redCard = true;
                }
    
                const $resultTag = $element.nextAll('a').first();
                matchObj.result = $resultTag.text().trim();
    
                // Determine status based on 'a' tag class
                if ($resultTag.hasClass('sched')) {
                    matchObj.status = 'NS';
                } else if ($resultTag.hasClass('fin')) {
                    matchObj.status = 'FT';
                } else if ($resultTag.hasClass('live')) {
                    matchObj.status = 'ON';
                }
    
                fullres.push(matchObj);
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: error });
            }
        });
        // res.json(fullres);
        res.status(200).json({ message: fullres });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error });
    }
});

app.listen(port, () => {
    //enjoy
    console.log(`Server is running on port ${port} 🚀`);
});